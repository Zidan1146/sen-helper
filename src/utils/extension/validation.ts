import * as vscode from 'vscode';
import { showError } from '../vscode';

export function isUrisEmpty(uris: vscode.Uri[] | undefined, message?: string) {
    const isEmpty = !uris || uris.length === 0;
    if(isEmpty) {
        showError(message ? message : "Input cannot be empty");
    }
    return isEmpty;
}