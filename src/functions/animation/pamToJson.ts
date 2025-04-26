import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import { spawn_launcher } from '@/commands/command_wrapper';
import { remove } from '@/utils/file';

export async function execute(uri: vscode.Uri) {
	const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam)$/i);
	const destinationPath = `${pamPath}.json`;
	await spawn_launcher({
		argument: {
			method: 'popcap.animation.decode',
			source: pamPath,
			destination: destinationPath,
		},
		exception: async () => await remove(destinationPath),
	});
}
