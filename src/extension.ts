import * as vscode from 'vscode';
import { registerCommands } from './commandManager';
import { loggerUtils } from '@/utils';

export async function activate(context: vscode.ExtensionContext) {
	loggerUtils.log.info('registering commands');
	registerCommands(context);
	loggerUtils.log.info('registering ok');
}

export function deactivate() {}
