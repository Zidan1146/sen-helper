import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';
import { JSON_EXT, PAM_JSON_EXT } from '@/constants/fileExt';

export function execute() {
	return async function (uri: vscode.Uri) {
		const jsonPamPath = await fileUtils.validatePath(
			uri,
			ValidationPathType.file,
			PAM_JSON_EXT,
			{
				fileNotFound: 'JSON PAM not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .pam.json',
			},
		);

		if (!jsonPamPath) {
			return;
		}

		await spawn_launcher({
			argument: {
				method: 'popcap.animation.encode',
				source: jsonPamPath
			}
		});
	};
}
