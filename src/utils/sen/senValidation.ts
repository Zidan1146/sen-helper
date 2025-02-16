import * as vscode from 'vscode';
import { MessageOptions } from "@/types";
import { getSenPath, getLauncherPath } from '.';
import * as fs from 'fs';

export async function validateSenPath(): Promise<boolean> {
    if (!isSenPathExists()) {
        const options = [MessageOptions.OpenSettings, MessageOptions.Cancel];

        const answer = await vscode.window.showErrorMessage(
            'Sen path is not set, open settings?',
            ...options
        );

        if (answer === MessageOptions.OpenSettings) {
            vscode.commands.executeCommand('workbench.action.openSettings', 'sen-helper.path');
        }
        return false;
    }

    if (!isSenLauncherExists()) {
        vscode.window.showErrorMessage('Sen launcher not found!');
        return false;
    }

    return true;
}

export function isSenPathExists(): boolean {
    const senPath = getSenPath();
    return senPath !== undefined && senPath !== '' && senPath !== null;
}

export function isSenLauncherExists(): boolean {
    const launcherPath = getLauncherPath();

    if (!launcherPath) {
        vscode.window.showErrorMessage('Sen launcher not found!');
        return false;
    }

    if (!fs.existsSync(launcherPath)) {
        vscode.window.showErrorMessage('Sen launcher not found!');
        return false;
    }

    return true;
}