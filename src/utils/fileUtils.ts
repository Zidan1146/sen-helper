import fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { DataJson } from '../interfaces/DataJson';

export enum PathType {
    folder = 'folder',
    file = 'file',
    unknown = 'unknown'
}

export async function validateWorkspacePath(
    allowedExtensions: string[] = []
): Promise<string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace path found!');
        return null;
    }

    if(!workspaceFolders.length) {
        vscode.window.showErrorMessage('Workspace cannot be empty!');
        return null;
    }

    return await validatePath(workspaceFolders[0].uri, PathType.folder, allowedExtensions, {
        fileNotFound: 'No workspace path found!',
        invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions.join(', ')}`
    });
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
            `Invalid pathParam type! Given: ${pathType}, Required: ${allowedPathType}`
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

export async function checkPathType(pathParam: string): Promise<string|null> {
    try {
        const stats = await fs.promises.stat(pathParam);

        if(stats.isDirectory()) {
            return PathType.folder;
        } else if(stats.isFile()) {
            return PathType.file;
        } else {
            return PathType.unknown;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to check pathParam type: ${error}`);
        return null;
    }
}

export function writeSplitLabelIntoJson(context: vscode.ExtensionContext, pathParam: string, isSplitLabel: boolean): void {
    const dataJson:DataJson|null = readDataJson(context, pathParam);

    if(!dataJson) {
        vscode.window.showErrorMessage(`Failed to write ${pathParam}\\data.json: Missing data.json!`);
        return;
    }

    const splitLabel = {
        '#split_label': isSplitLabel || isEncodeWithSplitLabel(context, pathParam)
    };

    const dataJsonStr = JSON.stringify({...splitLabel, ...dataJson}, null, 4);

    try {
        const dataJsonPath = path.join(pathParam, 'data.json');
        fs.createWriteStream(dataJsonPath, { flags: 'w' }).write(dataJsonStr);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write ${pathParam}\\data.json: ${error}`);
    }
}

export function isEncodeWithSplitLabel(context: vscode.ExtensionContext, pathParam:string): boolean {
    const dataJson:DataJson|null = readDataJson(context, pathParam);

    if(!dataJson || !dataJson['#split_label']) {
        return true;
    }

    return dataJson['#split_label'];
}

function readDataJson(context: vscode.ExtensionContext, pathParam: string, reviver?: (key:string, value:any) => any): DataJson | null {
    try {
        const dataJsonPath = context.asAbsolutePath(path.join(pathParam, 'data.json'));
        const data = fs.readFileSync(dataJsonPath, 'utf-8');
        return JSON.parse(data, reviver);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to read data.json: ${error}`);
        return null;
    }
}

export function writeJsonFromConfig(pathParam: string, data: any) {
    try {
        fs.writeFileSync(pathParam, JSON.stringify(data, null, 4));
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write ${pathParam}: ${error}`);
    }
}

export function readJsonFromConfig(context: vscode.ExtensionContext, configName: string) {
    try {
        const dataPath = path.join(context.extensionPath, 'src', 'config', configName);
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to read ${configName}: ${error}`);
        return null;
    }
}

export function readJson(path: string, showErrorMessage: boolean = true) {
    try {
        const data = fs.readFileSync(path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to read ${path}: ${error}`);
        return null;
    }
}