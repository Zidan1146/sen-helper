import { MessageOptions } from '@/types';
import { getSenPath, getLauncherPath } from '.';
import { showEnumeration, showError, showInfo, spawn_command } from '../vscode';
import { assert_if } from '@/error';
import { is_directory } from '../file';

export function validateSen() {
	try {
		validateSenPath();
		showInfo('Sen Loaded!');
		return true;
	} catch (error) {
		if (error instanceof Error) {
			const options = [MessageOptions.OpenSettings, MessageOptions.Cancel];
			showEnumeration({
				message: error.message,
				type: 'error',
				items: options,
				then(e) {
					if (e === MessageOptions.OpenSettings) {
						spawn_command('workbench.action.openSettings', 'sen-helper.path');
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
	const launcherPath = getLauncherPath();
	assert_if(launcherPath !== null, 'Launcher not found in vscode configuration');
	assert_if(
		await is_directory(launcherPath),
		'Launcher path was found, however the Launcher was not existed',
	);
	return true;
}
