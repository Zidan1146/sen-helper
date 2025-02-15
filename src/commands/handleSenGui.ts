import * as SenUtils from '@/utils/sen';
import * as vscode from 'vscode';

export function getSenGuiCommands(context: vscode.ExtensionContext) {
    const openSenGui = vscode.commands.registerCommand('sen-helper.sen-gui', async () => {
        await SenUtils.openSenGui()
        .catch((error) => {
            vscode.window.showErrorMessage(error);
        });
    });

    return [
        openSenGui
    ];
}