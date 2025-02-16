import * as vscode from 'vscode';
import * as path from 'path';
import { replaceWithConfig } from '../configUtils';
import { isSenPathExists } from './senValidation';
import { SenLauncherType } from '@/types';
import * as fs from 'fs';

export function getSenPath(): string | undefined {
    return vscode.workspace.getConfiguration('sen-helper').get('path.sen');
}

export function getSenGuiPath(): string | undefined {
    const senPath = getSenPath();

    if (!isSenPathExists() || !senPath) { 
        return undefined; 
    }

    const config: string | undefined = vscode.workspace.getConfiguration('sen-helper').get('path.sui');

    if (!config) {
        return undefined;
    }

    return replaceWithConfig(config);
}

export function getLauncherPath(): string | null {
    const senPath = getSenPath();

    if (!isSenPathExists() || !senPath) {
        return null;
    }

    const config: string | undefined = vscode.workspace.getConfiguration('sen-helper').get('advanced.launcher');
    if (!config) {
        return null;
    }

    const launcherExecutable = `${config}.exe`;
    return path.join(senPath, launcherExecutable);
}

export function getLauncherLibraries(): string[] | '' | null  {
    const senPath = getSenPath();

    if (!isSenPathExists() || !senPath) {
        return null;
    }

    const config: string | undefined = vscode.workspace.getConfiguration('sen-helper').get('advanced.launcher');
    if (!config) {
        return null;
    }

    if(config === SenLauncherType.Launcher) {
        return '';
    }

    const kernelPath = path.join(senPath, 'Kernel.dll');
    const scriptPath = path.join(senPath, 'script');
    const mainScriptPath = path.join(scriptPath, 'main.js');

    if(!fs.existsSync(kernelPath) && config === SenLauncherType.Shell) {
        vscode.window.showErrorMessage(`Missing Kernel.dll at ${senPath}`);
        return null;
    }

    if((!fs.existsSync(scriptPath) || !fs.existsSync(mainScriptPath)) && config === SenLauncherType.Shell) {
        vscode.window.showErrorMessage(`Missing script folder or main.js at ${senPath}`);
        return null;
    }

    return [kernelPath, mainScriptPath];
}