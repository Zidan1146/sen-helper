import * as vscode from 'vscode';
import { decodeScg, encodeScg } from './commands/handleScg';

export function registerCommands(context: vscode.ExtensionContext) {
    const handleScg = [
        decodeScg,
        encodeScg
    ];

    handleScg.forEach((command) => {
        context.subscriptions.push(command);
    });
}