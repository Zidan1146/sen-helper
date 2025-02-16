import * as vscode from 'vscode';
import { registerCommands } from './commandManager';

export async function activate(context: vscode.ExtensionContext) {
	registerCommands(context);
}

export function deactivate() {}
