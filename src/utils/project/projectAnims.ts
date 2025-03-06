import { MessageOptions } from '@/types';
import path from 'path';
import fs from 'fs';
import * as vscode from 'vscode';
import { showError } from '../vscode';

export async function selectAndGetSplitLabel() {
	return await vscode.window
		.showQuickPick([MessageOptions.Yes, MessageOptions.No], {
			title: 'Split animation label?',
			placeHolder: 'Split animation label? (Default: Yes)',
		})
		.then((val) => (!val ? MessageOptions.Yes : val))
		.then((val) => (val && val === MessageOptions.Yes).toString());
}

export async function isXflHasLabel(xflPath: string) {
	const libraryPath = path.join(xflPath, 'library');
	const labelFolderName = 'label';

	try {
		const entries = await fs.promises.readdir(libraryPath, { withFileTypes: true });

		const folderEntry = entries.find(
			(entry) => entry.isDirectory() && entry.name === labelFolderName,
		);

		if (folderEntry) {
			return true;
		}
		return false;
	} catch (error) {
		if (error instanceof Error) {
			showError(`Error reading xfl: ${error.message}`);
		}
		return;
	}
}
