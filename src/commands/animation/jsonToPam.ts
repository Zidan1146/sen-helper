import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';
import { unlinkSync } from 'fs';

export function execute() {
	return async function (uri: vscode.Uri) {
		const jsonPamPath = await fileUtils.validatePath(
			uri,
			ValidationPathType.file,
			/(\.pam\.json)$/i,
		);
		const destinationPath = jsonPamPath.replace(/(((\.pam)?\.json))?$/i, '.pam');
		await spawn_launcher({
			argument: {
				method: 'popcap.animation.encode',
				source: jsonPamPath,
				destination: destinationPath,
			},
			exception: () => unlinkSync(destinationPath),
		});
	};
}
