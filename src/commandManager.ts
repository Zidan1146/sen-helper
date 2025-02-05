import * as vscode from 'vscode';
import { getScgCommands } from './commands/handleScg';
import { getObbCommands } from './commands/handleObb';

export function registerCommands(context: vscode.ExtensionContext) {
    const handleScg = getScgCommands(context);

    handleScg.forEach((command) => {
        context.subscriptions.push(command);
    });

    const handleObb = getObbCommands(context);

    handleObb.forEach((command) => {
        context.subscriptions.push(command);
    });
}