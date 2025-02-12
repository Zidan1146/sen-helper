import * as vscode from 'vscode';
import { openSenGui as utilOpenSenGui } from '../utils/senUtils';

export function getSenGuiCommands(context: vscode.ExtensionContext) {
    const openSenGui = vscode.commands.registerCommand('sen-helper.sen-gui', async () => {
        await utilOpenSenGui();
    });

    return [
        openSenGui
    ];
}