import { ValidationPathType } from '@/types';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { senUtils } from '..';
import { showError } from '../vscode';

export async function validateWorkspacePath(
	allowedExtensions: string[] = [],
): Promise<string | null> {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		showError('No workspace path found!');
		return null;
	}

	if (!workspaceFolders.length) {
		showError('Workspace cannot be empty!');
		return null;
	}

	return await validatePath(
		workspaceFolders[0].uri,
		ValidationPathType.folder,
		allowedExtensions,
		{
			fileNotFound: 'No workspace path found!',
			invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions.join(
				', ',
			)}`,
		},
	);
}

export async function validatePath(
	uri: vscode.Uri | undefined,
	allowedPathType: ValidationPathType,
	allowedExtensions: string[] = [],
	errorMessages: { [key: string]: string } = {},
): Promise<string | null> {
	if (!(await senUtils.validateSenPath())) {
		return null;
	}

	if (!uri) {
		showError(errorMessages.noFileSelected || 'No file selected!');
		return null;
	}

	const filePath = uri.fsPath;

	if (!fs.existsSync(filePath)) {
		showError(errorMessages.fileNotFound || `File ${filePath} not found!`);
		return null;
	}

	const pathType = await checkPathType(filePath);

	if (!pathType || pathType !== allowedPathType) {
		showError(
			errorMessages.invalidPathType ||
				`Invalid pathParam type! Given: ${pathType}, Required: ${allowedPathType}`,
		);
		return null;
	}

	if (allowedExtensions.length > 0 && !allowedExtensions.some((ext) => filePath.endsWith(ext))) {
		showError(
			errorMessages.invalidFileType ||
				`Unsupported file type! Supported types: ${allowedExtensions.join(', ')}`,
		);
		return null;
	}

	return filePath.replaceAll('\\', '/');
}

export async function checkPathType(pathParam: string): Promise<string | null> {
	try {
		const stats = await fs.promises.stat(pathParam);

		if (stats.isDirectory()) {
			return ValidationPathType.folder;
		} else if (stats.isFile()) {
			return ValidationPathType.file;
		} else {
			return ValidationPathType.unknown;
		}
	} catch (error) {
		showError(`Failed to check pathParam type: ${error}`);
		return null;
	}
}
