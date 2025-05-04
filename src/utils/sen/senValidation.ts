import { MessageOptions } from '@/types';
import { getSenPath, getLauncherPath } from '.';
import { async_spawn_command, showEnumeration, showError, showInfo, showOpenDialog, spawn_command, updateConfiguration } from '../vscode';
import { assert_if } from '@/error';
import { is_directory } from '../file';

export async function validateSen() {
	try {
		await validateSenPath();
		showInfo('Sen Loaded!');
		return true;
	} catch (error) {
		if (error instanceof Error) {
			const options = [MessageOptions.SelectPath, MessageOptions.OpenSettings, MessageOptions.Cancel];
			showEnumeration({
				message: error.message,
				type: 'error',
				items: options,
				then(e) {
					if (e === MessageOptions.OpenSettings) {
						spawn_command('workbench.action.openSettings', 'sen-helper.senPath');
					}
					if(e === MessageOptions.SelectPath) {
						async_spawn_command("sen-helper.extension.senSenPath");
					}
				},
			});
			return;
		}
		showError('An error occured when validating sen path.');
	}
}

export async function validateSenPath(): Promise<boolean> {
	return isSenPathExists() && (await isSenLauncherExists());
}

export function isSenPathExists(): boolean {
	const senPath = getSenPath();
	assert_if(
		senPath !== undefined && senPath !== '' && senPath !== null,
		'Sen Path not found in vscode configuration',
	);
	return true;
}

export async function isSenLauncherExists(): Promise<boolean> {
	const senPath = getSenPath();
	const launcherPath = getLauncherPath();
	assert_if(!!launcherPath, 'Launcher not found in vscode configuration');
	assert_if(
		!!senPath && await is_directory(senPath),
		'Launcher path was found, however the Launcher was not existed',
	);
	return true;
}
