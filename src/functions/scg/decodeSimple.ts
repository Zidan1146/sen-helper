import { ScgOptions, ValidationPathType } from '@/types';
import { remove, validatePath } from '@/utils/file';
import * as vscode from 'vscode';
import { showMessage } from '@/utils/vscode';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
	const scgPath = await validatePath(uri, ValidationPathType.file, /(\.scg)$/i);
	const fileDestination = scgPath.replace(/(\.scg)?$/i, '.package');
	await spawn_launcher({
		argument: {
			method: 'pvz2.custom.scg.decode',
			source: scgPath,
			generic: ScgOptions.Simple,
		},
		success() {
			showMessage('SCG decoded successfully!', 'info');
		},
		exception: async () => await remove(fileDestination),
	});
}
