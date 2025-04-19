import * as vscode from 'vscode';
import { jsonToRton } from '@/functions/json';
import { showOpenDialog, showWarning } from '@/utils/vscode';
import { execute as rtonToJson } from '@/functions/json/rtonToJson';

export function execute() {
    return async (uri: vscode.Uri) => uri ? await handleSingle(uri) : await handleMultiple();
}

async function handleSingle(uri: vscode.Uri) {
    await rtonToJson(uri);
}

async function handleMultiple() {
    const selectedFiles = await showOpenDialog({
        canSelectMany: true,
        openLabel: "Select Files",
        filters: {
            "RTON files": ['rton']
        }
    });

    if(!selectedFiles) {
        showWarning('No Files Selected!');
        return;
    }

    for(const file of selectedFiles) {
        await rtonToJson(file);
    }
}