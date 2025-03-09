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

export async function xfl_maybe_split_label(xflPath: string) {
	const libraryPath = path.join(xflPath, 'library');
	const entries = await fs.promises.readdir(libraryPath, { withFileTypes: true });
	return entries.some((entry) => entry.isDirectory() && /(label)$/i.test(entry.name));
}
