import * as vscode from 'vscode';
import { getLauncherLibraries, getLauncherPath, getSenGuiPath } from './senPaths';
import { spawn } from 'node:child_process';
import { MissingLibrary } from '@/error';

export async function runSenAndExecute(title: string, args: string[]): Promise<void> {
    return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Running command...',
            cancellable: true
        },
        async (progress, token) => {
            return new Promise((resolve, reject) => {
                const launcherPath = getLauncherPath();
        
                if (!launcherPath) {
                    reject(new MissingLibrary('Launcher path is not valid'));
                }
                
                const launcherLibraries: string[] | 'none' | null = getLauncherLibraries();
                
                if(!launcherLibraries) {
                    reject(new MissingLibrary('Launcher libraries are not valid!'));
                }

                const libraryArgument = Array.isArray(launcherLibraries) ? [...launcherLibraries] : [];

                const childArgs = [
                    ...libraryArgument,
                    ...args
                ];

                const child = spawn(launcherPath!, childArgs);
                let hasError = false;
                let errorMessage:string;
                let errorStackTrace:string;

                child.stdout.on('data', (data) => {
                    console.log(`Output: ${data.toString()}`);

                    const messages:string[] = data.toString().split('●').map((msg:string) => msg.trim()).filter((msg:string) => msg);
                    
                    messages.forEach(message => {
                        if (message.includes("Error")) {
                            errorMessage = message;
                            hasError = true;
                        }
                        if(/^Stack for traceback error/i.test(message)) {
                            errorStackTrace = message;
                            hasError = true;
                        }
                    });
                    
                });

                child.stderr.on('data', (data) => {
                    console.error(`Error Output: ${data.toString()}`);
                });

                child.on('close', (code) => {
                    if(code === 0 && !hasError) {
                        vscode.window.showInformationMessage('Command completed successfully');
                        resolve();
                    } else if(hasError) {
                        vscode.window.showErrorMessage(errorMessage);
                        vscode.window.showErrorMessage('Command reported success but errors were found!');
                        reject(new Error(errorMessage));
                    }
                    else {
                        vscode.window.showErrorMessage(`Command failed with code ${code}`);
                        reject(new Error(`Command exited with code ${code}`));
                    }
                });

                child.on('error', (err) => {
                    vscode.window.showErrorMessage(`Failed to run command: ${err.message}`);
                    reject(err);
                });

                token.onCancellationRequested(() => {
                    vscode.window.showInformationMessage('Cancelling process...');
                    child.kill('SIGTERM');
                    reject(new vscode.CancellationError());
                });
            });
        }
    );
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

        terminal.sendText(senGuiPath, true);

        const interval = setInterval(() => {
            if (terminal.exitStatus) {
                terminal.dispose();
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    });
}
