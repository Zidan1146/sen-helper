import * as vscode from 'vscode';
import { registerCommands } from './commandManager';
import { updateContext } from './contextManager';

export async function activate(context: vscode.ExtensionContext) {
	await updateContext(context);

	vscode.workspace.onDidChangeConfiguration(async (event) => {
        if (event.affectsConfiguration('sen-helper.path.sen')) {
            await updateContext(context);
        }
    }, null, context.subscriptions);

	registerCommands(context);
}

export function deactivate() {}
