import * as path from 'path';
import { replaceWithConfig } from '../vscode/config';
import { isSenPathExists } from './senValidation';
import { getConfiguration, showMessage } from '../vscode';
import { is_directory, is_file } from '../file';
import os from 'os';

export function getSenPath(): string | undefined {
	return getConfiguration<string|undefined>('senPath');
}

export function getSenGuiPath(): string | undefined {
	const senPath = getSenPath();

	if (!isSenPathExists() || !senPath) {
		return undefined;
	}

	const config = getConfiguration<string|undefined>('suiPath');

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

	const shellExecutable = `Shell${os.type() === "Windows_NT" ? ".exe" : ""}`;

	return path.join(senPath, shellExecutable);
}

export async function getLauncherLibraries(): Promise<Array<string> | null> {
	const senPath = getSenPath();

	if (!isSenPathExists() || !senPath) {
		return null;
	}

	const kernelPath = path.join(senPath, getKernelName());
	const scriptPath = path.join(senPath, 'Script');
	const mainScriptPath = path.join(scriptPath, 'main.js');

	if (!(await is_file(kernelPath))) {
		showMessage(`Missing Kernel.dll at ${senPath}`, 'error');
		return null;
	}

	if (!(await is_directory(scriptPath)) || !(await is_file(mainScriptPath))) {
		showMessage(`Missing script folder or main.js at ${senPath}`, 'error');
		return null;
	}

	return [kernelPath, mainScriptPath];
}

function getKernelName() {
	const kernel = "Kernel";

	switch(os.type()) {
		case "Windows_NT":
		default:
			return `${kernel}.dll`;
		case "Darwin":
			return `${kernel}.dylib`;
		case "Linux":
			return `${kernel}.so`;
	}
}