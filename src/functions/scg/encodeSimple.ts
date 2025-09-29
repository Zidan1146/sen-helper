import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { spawn_launcher } from '@/commands/command_wrapper';
import { remove } from '@/utils/file';

export async function execute(uri: vscode.Uri) {
	const packagePath = await fileUtils.validatePath(
		uri,
		ValidationPathType.folder,
		/(\.package)$/i,
	);
	await spawn_launcher({
		argument: {
			method: 'pvz2.custom.scg.encode',
			source: packagePath,
			generic: ScgOptions.Simple,
		}
	});
}
