import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { spawn_launcher } from '@/commands/command_wrapper';
import { showMessage } from '@/utils/vscode';

export async function execute(uri: vscode.Uri) {
	const packagePath = await fileUtils.validatePath(
		uri,
		ValidationPathType.folder,
		/(\.package)$/i,
	);
	const isSplitLabel = fileUtils.isEncodeWithSplitLabel(packagePath).toString();

	await runFunction({
		source: packagePath,
		isSplitLabel: isSplitLabel,
		silent: false
	});
}

interface functionConfig {
	source: string,
	isSplitLabel: string,
	silent: boolean
}

export async function runFunction(config: functionConfig) {
	await spawn_launcher({
		argument: {
			method: 'pvz2.custom.scg.encode',
			source: config.source,
			generic: ScgOptions.Advanced,
			animation_split_label: config.isSplitLabel,
		},
		success() {
			if (!config.silent) {
				showMessage("Unpack SCG completed successfully", 'info');
			}
		},
	});
}