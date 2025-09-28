import * as vscode from 'vscode';

export function isUrisEmpty(uris: vscode.Uri[] | undefined) {
    return !uris || uris.length === 0;
}