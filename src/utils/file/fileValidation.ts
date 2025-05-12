import { ValidationPathType } from '@/types';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { assert_if } from '@/error';
import { is_file } from './fileHelper';

export async function validateWorkspacePath(allowedExtensions?: RegExp): Promise<string> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	assert_if(
		workspaceFolders !== undefined && workspaceFolders.length === 0,
		'No workspace path found!',
	);
	return await validatePath(
		workspaceFolders[0].uri,
		ValidationPathType.folder,
		allowedExtensions,
	);
}

export async function validatePath(
	uri: vscode.Uri | undefined,
	allowedPathType: ValidationPathType,
	allowedExtensions?: RegExp,
): Promise<string> {
	assert_if(uri !== undefined, 'No file was selected!');
	const filePath = uri.fsPath;
	const pathType = await checkPathType(filePath);
	assert_if(
		pathType !== null && pathType === allowedPathType,
		`Invalid parameteres type! Given: ${pathType}, Required: ${allowedPathType}`,
	);
	if (allowedExtensions !== undefined) {
		assert_if(allowedExtensions.test(filePath), 'Unsupported file type!');
	}
	return filePath.replaceAll('\\', '/');
}

export async function checkPathType(pathParam: string): Promise<string | null> {
	const stats = await fs.promises.stat(pathParam);
	if (stats.isDirectory()) {
		return ValidationPathType.folder;
	} else if (stats.isFile()) {
		return ValidationPathType.file;
	} else {
		return ValidationPathType.unknown;
	}
}
