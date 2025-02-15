import * as vscode from 'vscode';
import * as path from 'path';
import { replaceWithConfig } from '../configUtils';
import { isSenPathExists } from './senValidation';

export function getSenPath(): string | undefined {
    return vscode.workspace.getConfiguration('senHelper').get('path.sen');
}

export function getSenGuiPath(): string | undefined {
    const senPath = getSenPath();

    if (!isSenPathExists() || !senPath) { 
        return undefined; 
    };

    const config: string | undefined = vscode.workspace.getConfiguration('senHelper').get('path.sen');

    if (!config) {
        return undefined;
    };

    return replaceWithConfig(config);
}

export function getLauncherPath(): string | null {
    const senPath = getSenPath();

    if (!isSenPathExists() || !senPath) {
        return null;
    };

    return path.join(senPath, 'launcher.exe');
}