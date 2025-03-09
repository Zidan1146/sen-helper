import * as vscode from 'vscode';
import { MessageOptions } from '@/types';
import { getSenPath, getLauncherPath } from '.';
import * as fs from 'fs';
import { showMessage } from '../vscode';
import { assert_if } from '@/error';

export async function validateSenPath(): Promise<boolean> {
	if (!isSenPathExists()) {
		const options = [MessageOptions.OpenSettings, MessageOptions.Cancel];

		const answer = await vscode.window.showErrorMessage(
			'Sen path is not set, open settings?',
			...options,
		);

		if (answer === MessageOptions.OpenSettings) {
			vscode.commands.executeCommand('workbench.action.openSettings', 'sen-helper.path');
		}
		return false;
	}

	if (!isSenLauncherExists()) {
		showMessage('Launcher for Sen not found!', 'error');
		return false;
	}

	return true;
}

export function isSenPathExists(): boolean {
	const senPath = getSenPath();
	return senPath !== undefined && senPath !== '' && senPath !== null;
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
