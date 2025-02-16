import * as vscode from 'vscode';
import { getLauncherLibraries, getLauncherPath, getSenGuiPath } from './senPaths';

export async function runSenAndExecute(title: string, args: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
        const terminal = vscode.window.createTerminal(title);
        const launcherPath = getLauncherPath();

        if (!launcherPath) {
            vscode.window.showErrorMessage('Launcher path is not valid!');
            reject();
            return;
        }

        const launcherLibraries: String[] | '' | null = getLauncherLibraries();

        if(!launcherLibraries) {
            vscode.window.showErrorMessage('Launcher libraries are not valid!');
            reject();
            return;
        }

        const libraryArgument = Array.isArray(launcherLibraries) ? launcherLibraries.join(' ') : '';

        terminal.sendText(`${launcherPath} ${libraryArgument} ${args.join(' ')}`, true);
        terminal.show();

        terminal.sendText('exit', true);

        const interval = setInterval(() => {
            if (terminal.exitStatus) {
                terminal.dispose();
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    });
}

export async function openSenGui(): Promise<void> {
    return new Promise(async (resolve) => {
        const terminals = vscode.window.terminals;
        let terminal = vscode.window.createTerminal();

        if (terminals.length > 0) {
            terminal = terminals[0];
        }

        const senGuiPath = getSenGuiPath();

        if (!senGuiPath) {
            vscode.window.showErrorMessage('Sen GUI not found!');
            resolve();
            return;
        }

        terminal.sendText(`${senGuiPath}`, true);

        const interval = setInterval(() => {
            if (terminal.exitStatus) {
                terminal.dispose();
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    });
}