import fs from 'fs';
import * as vscode from 'vscode';
import { DataJson } from '../interfaces/DataJson';

export enum PathType {
    folder = 'folder',
    file = 'file',
    unknown = 'unknown'
}

export async function validatePath(
    uri: vscode.Uri | undefined,
    allowedPathType: PathType,
    allowedExtensions: string[] = [],
    errorMessages: { [key: string]: string } = {}
): Promise<string | null> {
    if (!uri) {
        vscode.window.showErrorMessage(errorMessages.noFileSelected || 'No file selected!');
        return null;
    }

    const filePath = uri.fsPath;

    if (!fs.existsSync(filePath)) {
        vscode.window.showErrorMessage(errorMessages.fileNotFound || 'File not found!');
        return null;
    }

    const pathType = await checkPathType(filePath);

    if (!pathType || pathType !== allowedPathType) {
        vscode.window.showErrorMessage(
            errorMessages.invalidPathType ||
            `Invalid path type! Given: ${pathType}, Required: ${allowedPathType}`
        );
        return null;
    }

    if (allowedExtensions.length > 0 && !allowedExtensions.some(ext => filePath.endsWith(ext))) {
        vscode.window.showErrorMessage(
            errorMessages.invalidFileType || `Unsupported file type! Supported types: ${allowedExtensions.join(', ')}`
        );
        return null;
    }

    return filePath;
}

export async function checkPathType(path: string): Promise<string|null> {
    try {
        const stats = await fs.promises.stat(path);

        if(stats.isDirectory()) {
            return PathType.folder;
        } else if(stats.isFile()) {
            return PathType.file;
        } else {
            return PathType.unknown;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to check path type: ${error}`);
        return null;
    }
}

export function writeSplitLabelIntoJson(path: string, isSplitLabel: boolean): void {
    const dataJson:DataJson|null = readDataJson(path);

    if(!dataJson) {
        vscode.window.showErrorMessage(`Failed to write ${path}\\data.json: Missing data.json!`);
        return;
    }

    const splitLabel = {
        '#split_label': isSplitLabel || isEncodeWithSplitLabel(path)
    };

    const dataJsonStr = JSON.stringify({...splitLabel, ...dataJson}, null, 4);

    try {
        fs.createWriteStream(`${path}\\data.json`, { flags: 'w' }).write(dataJsonStr);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write ${path}\\data.json: ${error}`);
    }
}

export function isEncodeWithSplitLabel(path:string): boolean {
    const dataJson:DataJson|null = readDataJson(path);

    if(!dataJson || !dataJson['#split_label']) {
        return true;
    }

    return dataJson['#split_label'];
}

function readDataJson(path: string, reviver?: (key:string, value:any) => any): DataJson | null {
    try {
        const dataJsonPath = path + '\\data.json';
        const data = fs.readFileSync(dataJsonPath, 'utf-8');
        return JSON.parse(data, reviver);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to read data.json: ${error}`);
        return null;
    }
}