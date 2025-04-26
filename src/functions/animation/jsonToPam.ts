import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import vscode from 'vscode';
import { spawn_launcher } from '@/commands/command_wrapper';
import { remove } from '@/utils/file';

export async function execute(uri: vscode.Uri) {
	const jsonPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam\.json)$/i);
	const destinationPath = jsonPath.replace(/\.json/, '');
	await spawn_launcher({
		argument: {
			method: 'popcap.animation.encode',
			source: jsonPath,
			destination: destinationPath,
		},
		exception: async () => await remove(destinationPath),
	});
}
