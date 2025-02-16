import * as vscode from 'vscode';
import { getLauncherLibraries, getLauncherPath, getSenGuiPath } from './senPaths';

export async function runSenAndExecute(title: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const launcherPath = getLauncherPath();
        
        if (!launcherPath) {
            vscode.window.showErrorMessage('Launcher path is not valid!');
            return;
        }
        
        const launcherLibraries: String[] | '' | null = getLauncherLibraries();
        
        if(!launcherLibraries) {
            vscode.window.showErrorMessage('Launcher libraries are not valid!');
            return;
        }
        
        const libraryArgument = Array.isArray(launcherLibraries) ? launcherLibraries.join(' ') : '';
        
        const terminal = vscode.window.createTerminal(title);
        terminal.sendText(`${launcherPath} ${libraryArgument} ${args.join(' ')}`, true);

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Running command...',
                cancellable: true
            },
            async (progress, token) => {
                if(token.isCancellationRequested) {
                    vscode.window.showErrorMessage('Command cancelled!');
                    terminal.dispose();
                    return;
                }

                terminal.sendText('exit', true);
            }
        );

        const interval = setInterval(() => {
            if (terminal.exitStatus) {
                terminal.dispose();
                clearInterval(interval);
                resolve();
            }
        }, 500);
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

async function executeWithProgress(
    title: string,
    terminal: vscode.Terminal,
    taskFunction: (progress: vscode.Progress<{ message?: string; increment?: number }>, token: vscode.CancellationToken) => Promise<void>
) {
    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: title,
        cancellable: false
    }, async (progress, token) => {
        new Promise<void>(async (resolve) => {
            await taskFunction(progress, token);

            const interval = setInterval(() => {
                if (terminal.exitStatus) {
                    terminal.sendText('exit', true);
                    terminal.dispose();
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    });
}