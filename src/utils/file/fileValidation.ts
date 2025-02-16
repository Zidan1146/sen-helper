import { ValidationPathType } from '@/types';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { senUtils } from '..';

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

    return await validatePath(workspaceFolders[0].uri, ValidationPathType.folder, allowedExtensions, {
        fileNotFound: 'No workspace path found!',
        invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions.join(', ')}`
    });
}

export async function validatePath(
    uri: vscode.Uri | undefined,
    allowedPathType: ValidationPathType,
    allowedExtensions: string[] = [],
    errorMessages: { [key: string]: string } = {}
): Promise<string | null> {
    if(!(await senUtils.validateSenPath())) {
        return null;
    }

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
            return ValidationPathType.folder;
        } else if(stats.isFile()) {
            return ValidationPathType.file;
        } else {
            return ValidationPathType.unknown;
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to check pathParam type: ${error}`);
        return null;
    }
}