import { ConfigSplitLabel, ScgOptions, ValidationPathType } from '@/types';
import { remove, validatePath, writeSplitLabelIntoJson } from '@/utils/file';
import * as vscode from 'vscode';
import { selectAndGetSplitLabel } from '@/utils/project';
import { getConfiguration, showMessage } from '@/utils/vscode';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
	const scgPath = await validatePath(uri, ValidationPathType.file, /(\.scg)$/i);

	const config = getConfiguration<ConfigSplitLabel>('configScgForModding');

	let isSplitLabel;
	switch (config) {
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

	await runFunction({
		source: scgPath,
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
	const fileDestination = config.source.replace(/(\.scg)?$/i, '.package');
	await spawn_launcher({
		argument: {
			method: 'pvz2.custom.scg.decode',
			source: config.source,
			generic: ScgOptions.Advanced,
			animation_split_label: config.isSplitLabel,
		},
		success() {
			if (!config.silent) {
				writeSplitLabelIntoJson(fileDestination, config.isSplitLabel === 'true');
				showMessage("Unpack SCG completed successfully", 'info');
			}
		}
	});
}