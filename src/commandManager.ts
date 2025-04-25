import * as vscode from 'vscode';
import * as commands from './commands';

export function registerCommands(context: vscode.ExtensionContext) {
    for (const [name, command] of Object.entries(commands.default)) {
        context.subscriptions.push(vscode.commands.registerCommand(name, command()));
    }
}