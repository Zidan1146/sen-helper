import * as vscode from 'vscode';
import { MissingSenPathOption } from "@/types";
import { getSenPath, getLauncherPath } from '.';
import * as fs from 'fs';

export async function validateSenPath(): Promise<boolean> {
    if (!isSenPathExists()) {
        const options = [MissingSenPathOption.OpenSettings, MissingSenPathOption.Cancel];

        const answer = await vscode.window.showErrorMessage(
            'Sen path is not set, open settings?',
            ...options
        );

        if (answer === MissingSenPathOption.OpenSettings) {
            vscode.commands.executeCommand('workbench.action.openSettings', 'senHelper.path');
        }
        return false;
    }

    if (!isSenLauncherExists()) {
        vscode.window.showErrorMessage('Sen launcher.exe not found!');
        return false;
    }

    return true;
}

export function isSenPathExists(): boolean {
    const senPath = getSenPath();
    return senPath !== undefined && senPath !== '';
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