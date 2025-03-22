import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { xfl_maybe_split_label } from '@/utils/project';
import vscode from 'vscode';
import { showMessage } from '@/utils/vscode';
import { spawn_launcher } from '../command_wrapper';
import { unlinkSync } from 'fs';

export function execute() {
	return async function (uri: vscode.Uri) {
		const jsonPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam\.json)$/i);
		const destinationPath = jsonPath.replace(/\.json/, '');
		await spawn_launcher({
			argument: {
				method: 'popcap.animation.encode',
				source: jsonPath,
				destination: destinationPath,
			},
			exception: () => unlinkSync(destinationPath),
		});
	};
}
