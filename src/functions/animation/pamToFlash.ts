import { AnimationResolution, ConfigSplitLabel, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { selectAndGetSplitLabel } from '@/utils/project';
import vscode from 'vscode';
import { spawn_launcher } from '@/commands/command_wrapper';
import { remove } from '@/utils/file';
import { getConfiguration } from '@/utils/vscode';

export async function execute(uri: vscode.Uri) {
	const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam)$/i);
	const config = getConfiguration<ConfigSplitLabel>('configPamToFlash');
	
	let isSplitLabel;
	switch(config) {
		case 'AlwaysAsk':
		default:
			isSplitLabel = await selectAndGetSplitLabel();
			break;
		case 'AlwaysSplit':
			isSplitLabel = 'true';
			break;
		case 'NeverSplit':
			isSplitLabel = 'false';
			break;
	}
	
	const destinationPath = `${pamPath}.xfl`;
	await spawn_launcher({
		argument: {
			method: 'popcap.animation.decode_and_to_flash',
			source: pamPath,
			resolution: AnimationResolution.High,
			has_label: isSplitLabel,
		},
		exception: async () => await remove(destinationPath),
	});
}
