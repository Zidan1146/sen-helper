import * as SenUtils from '@/utils/sen';
import * as vscode from 'vscode';

export function execute(context: vscode.ExtensionContext) {
    return async () => {
        await SenUtils.openSenGui()
            .catch((error) => {
            vscode.window.showErrorMessage(error);
        });
    };
}