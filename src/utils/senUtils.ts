import * as vscode from 'vscode';
import * as  fs from 'fs';

enum missingSenPathOption {
	openSettings = 'Open settings',
	cancel = 'Cancel'
}

export async function validateSenPath(): Promise<boolean>{
    if(!isSenPathExists()) {
        const options = [
            missingSenPathOption.openSettings,
            missingSenPathOption.cancel
        ];

        const answer = await vscode.window.showErrorMessage(
            'sen path is not set, open settings?',
            ...options
        );

        if(answer === missingSenPathOption.openSettings) {
            vscode.commands.executeCommand('workbench.action.openSettings', 'senHelper.path');
        }
        return false;
    }

    if(!isSenLauncherExists()) {
        vscode.window.showErrorMessage('Sen launcher.exe not found!');
        return false;
    }

    return true;
}

export function getSenPath(): string|undefined {
    const senPath: string|undefined = vscode.workspace.getConfiguration('senHelper').get('path');
    return senPath;
}

export function getLauncherPath():string|null {
    if(!isSenPathExists()) {
        return null;
    }

    const senPath: string|undefined = getSenPath();
    const launcherPath = senPath + '\\launcher.exe';
    return launcherPath;
}

export async function runSenAndExecute(title:string, args: string[]): Promise<void> {
    return new Promise(async (resolve) => {
        const terminal = vscode.window.createTerminal(title);
        const launcherPath = getLauncherPath();
        
        terminal.sendText(`${launcherPath} ${args.join(' ')}`, true);
        terminal.show();

        terminal.sendText('exit', true);

        await new Promise((resolve) => {
            setInterval(() => {
                if(terminal.exitStatus) {
                    terminal.dispose();
                    resolve(null);
                }
            }, 1000);
        });

        resolve();
    });
}

function isSenPathExists(): boolean {
    const senPath: string|undefined = getSenPath();
    
    if(!senPath || senPath === '') {
        return false;
    }
    return true;
}

function isSenLauncherExists(): boolean {
    const launcherPath = getLauncherPath();

    if(!launcherPath) {
        vscode.window.showErrorMessage('Sen launcher not found!');
        return false;
    }

    if(!fs.existsSync(launcherPath)) {
        vscode.window.showErrorMessage('Sen launcher not found!');
        return false;
    }
    return true;
}