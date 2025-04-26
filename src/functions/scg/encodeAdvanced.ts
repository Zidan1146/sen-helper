import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { showMessage } from '@/utils/vscode';
import { spawn_launcher } from '@/commands/command_wrapper';
import { remove } from '@/utils/file';

export async function execute(uri: vscode.Uri) {
	const packagePath = await fileUtils.validatePath(
		uri,
		ValidationPathType.folder,
		/(\.package)$/i,
	);
	const isSplitLabel = fileUtils.isEncodeWithSplitLabel(packagePath).toString();
	const fileDestination = packagePath.replace(/(\.package)?$/i, '.scg');
	await spawn_launcher({
		argument: {
			method: 'pvz2.custom.scg.encode',
			source: packagePath,
			generic: ScgOptions.Advanced,
			animation_split_label: isSplitLabel,
		},
		success() {
			showMessage('SCG encoded successfully!', 'info');
		},
		exception: async () => await remove(fileDestination),
	});
}
