import * as vscode from 'vscode';
import * as path from 'path';
import { replaceWithConfig } from '../vscode/config';
import { isSenPathExists } from './senValidation';
import * as fs from 'fs';
import { showMessage } from '../vscode';

export function getSenPath(): string | undefined {
	return vscode.workspace.getConfiguration('sen-helper').get('path.sen');
}

export function getSenGuiPath(): string | undefined {
	const senPath = getSenPath();

	if (!isSenPathExists() || !senPath) {
		return undefined;
	}

	const config: string | undefined = vscode.workspace
		.getConfiguration('sen-helper')
		.get('path.sui');

	if (!config) {
		return undefined;
	}

	return replaceWithConfig(config);
}

export function getLauncherPath(): string | null {
	const senPath = getSenPath();

	if (!isSenPathExists() || !senPath) {
		return null;
	}

	return path.join(senPath, 'Shell.exe');
}

export function getLauncherLibraries(): string[] | null {
	const senPath = getSenPath();

	if (!isSenPathExists() || !senPath) {
		return null;
	}

	const kernelPath = path.join(senPath, 'Kernel.dll');
	const scriptPath = path.join(senPath, 'script');
	const mainScriptPath = path.join(scriptPath, 'main.js');

	if (!fs.existsSync(kernelPath)) {
		showMessage(`Missing Kernel.dll at ${senPath}`, 'error');
		return null;
	}

	if (
		(!fs.existsSync(scriptPath) || !fs.existsSync(mainScriptPath))
	) {
		showMessage(`Missing script folder or main.js at ${senPath}`, 'error');
		return null;
	}

	return [kernelPath, mainScriptPath];
}
