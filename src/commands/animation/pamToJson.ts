import { assert_if } from '@/error';
import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
	return async function (uri: vscode.Uri) {
		const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam)$/i, {
			fileNotFound: 'PAM not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .pam',
		});

		if (!pamPath) {
			return;
		}

		const destinationPath = `${pamPath}.json`;

		await spawn_launcher({
			argument: {
				method: 'popcap.animation.decode',
				source: pamPath,
				destination: destinationPath,
			},
			success() {
				assert_if(fs.existsSync(destinationPath), 'Failed to convert pam to json!');
			},
		});
	};
}
