import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { rtonToJson as getRtonToJsonCommand } from '@/commands/json';
import * as vscode from 'vscode';
import { unlinkSync } from 'fs';
import { showWarning, uriOf } from '@/utils/vscode';
import { copy_file } from '@/utils/file';

export function execute(): (uri: vscode.Uri) => Promise<void> {
	return async function (uri: vscode.Uri): Promise<void> {
		showWarning(
			"Disclaimer: this command is intended for mod testing purposes only, beyond that's up to the user responsibility.",
		);

		const source_path = await fileUtils.validatePath(uri, ValidationPathType.file, /pp\.dat$/i);
		if (!source_path) {
			return;
		}

		const tempSource = source_path.replace(/(\.dat)?$/i, '.rton');
		const tempSourceUri = uriOf(tempSource);

		await copy_file(source_path, tempSource);

		const command = getRtonToJsonCommand();
		await command(tempSourceUri);

		unlinkSync(tempSource);
	};
}
