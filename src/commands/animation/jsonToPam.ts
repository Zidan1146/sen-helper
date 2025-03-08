import { assert_if } from '@/error';
import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
	return async function (uri: vscode.Uri) {
		const jsonPamPath = await fileUtils.validatePath(
			uri,
			ValidationPathType.file,
			/(\.pam\.json)$/i,
			{
				fileNotFound: 'JSON PAM not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .pam.json',
			},
		);

		if (!jsonPamPath) {
			return;
		}

		const destinationPath = jsonPamPath.replace('.json', '');

		await spawn_launcher({
			argument: {
				method: 'popcap.animation.encode',
				source: jsonPamPath,
				destination: destinationPath,
			},
			success() {
				assert_if(fs.existsSync(destinationPath), 'Failed to convert json to pam!');
			},
		});
	};
}
