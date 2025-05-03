import { ConfigSCGForModding, ScgOptions, ValidationPathType } from '@/types';
import { remove, validatePath, writeSplitLabelIntoJson } from '@/utils/file';
import * as vscode from 'vscode';
import { selectAndGetSplitLabel } from '@/utils/project';
import { getConfiguration, showMessage } from '@/utils/vscode';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
	const scgPath = await validatePath(uri, ValidationPathType.file, /(\.scg)$/i);

	const config = getConfiguration<ConfigSCGForModding>('configScgForModding');

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

	const fileDestination = scgPath.replace(/(\.scg)?$/i, '.package');
	await spawn_launcher({
		argument: {
			method: 'pvz2.custom.scg.decode',
			source: scgPath,
			generic: ScgOptions.Advanced,
			animation_split_label: isSplitLabel,
		},
		success() {
			showMessage('SCG decoded successfully!', 'info');
			writeSplitLabelIntoJson(fileDestination, isSplitLabel === 'true');
		},
		exception: async () => remove(fileDestination),
	});
}
