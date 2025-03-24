import { MessageOptions } from '@/types';
import { getSenPath, getLauncherPath } from '.';
import * as fs from 'fs';
import { showEnumeration, showError, showInfo, spawn_command } from '../vscode';
import { assert_if } from '@/error';

export function validateSen() {
	try {
		validateSenPath();
		showInfo('Sen Loaded!');
		return true;
	} catch (error) {
		if(error instanceof Error) {
			const options = [MessageOptions.OpenSettings, MessageOptions.Cancel];
			showEnumeration({
					message: error.message,
					type: 'error',
					items: options,
					then(e) {
						if (e === MessageOptions.OpenSettings) {
							spawn_command('workbench.action.openSettings', 'sen-helper.path');
						}
					}
				}
			);
			return;
		}
		showError('An error occured when validating sen path.');
	}
}

export function validateSenPath(): boolean {
	return isSenPathExists() && isSenLauncherExists();
}

export function isSenPathExists(): boolean {
	const senPath = getSenPath();
	assert_if(
		senPath !== undefined && senPath !== '' && senPath !== null, 
		'Sen Path not found in vscode configuration'
	);
	return true;
}

export function isSenLauncherExists(): boolean {
	const launcherPath = getLauncherPath();
	assert_if(launcherPath !== null, 'Launcher not found in vscode configuration');
	assert_if(
		fs.existsSync(launcherPath),
		'Launcher path was found, however the Launcher was not existed',
	);
	return true;
}
