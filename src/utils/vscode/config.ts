import * as vscode from 'vscode';

export function replaceWithConfig(template: string): string {
    return template.replace(/\$\{([\w\.-]+)\}/g, (_, key) => {
        return vscode.workspace.getConfiguration().get<string>(key) || '';
    });
}

