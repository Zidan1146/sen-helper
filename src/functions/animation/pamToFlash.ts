import { AnimationResolution, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { selectAndGetSplitLabel } from '@/utils/project';
import vscode from 'vscode';
import { unlinkSync } from 'fs';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute (uri: vscode.Uri) {
	const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam)$/i);
	const isSplitLabel = await selectAndGetSplitLabel();
	const destinationPath = `${pamPath}.xfl`;
	await spawn_launcher({
		argument: {
			method: 'popcap.animation.decode_and_to_flash',
			source: pamPath,
			resolution: AnimationResolution.High,
			has_label: isSplitLabel,
		},
		exception: () => unlinkSync(destinationPath),
	});
}