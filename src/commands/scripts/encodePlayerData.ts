import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import { showWarning, uriOf } from '@/utils/vscode';
import { assert_if } from '@/error';
import { jsonToRton } from '@/functions/json';
import { rename_link } from '@/utils/file';

export function execute() {
	return async function (uri: vscode.Uri) {
		showWarning(
			"Disclaimer: this command is intended for mod testing purposes only, beyond that's up to the user responsibility.",
		);

		const source_path = await fileUtils.validatePath(
			uri,
			ValidationPathType.file,
			/pp\.json$/i,
		);
		assert_if(!!source_path, 'Source path not found');

		const sourceUri = uriOf(source_path);

		await jsonToRton(sourceUri);

		const processedFile = source_path.replace(/(\.json)?$/i, '.rton');
		const renamedProcessedFile = processedFile.replace('.rton', '.dat');
		await rename_link(processedFile, renamedProcessedFile);
	};
}
