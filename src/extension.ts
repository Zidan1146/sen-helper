import * as vscode from 'vscode';
import { registerCommands } from './commandManager';
import { updateContext } from './contextManager';
import { loggerUtils } from '@/utils';

export async function activate(context: vscode.ExtensionContext) {
	loggerUtils.log.info('registering commands');
	registerCommands(context);
	await updateContext(context);

	vscode.workspace.onDidChangeConfiguration(async (event) => {
        if (event.affectsConfiguration('sen-helper.senPath')) {
            await updateContext(context);
        }
    }, null, context.subscriptions);
	loggerUtils.log.info('registering ok');
}

export function deactivate() {}
