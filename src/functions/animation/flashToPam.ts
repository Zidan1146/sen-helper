import { ConfigFlashToPAM, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { selectAndGetSplitLabel, xfl_maybe_split_label } from '@/utils/project';
import vscode from 'vscode';
import { getConfiguration, showMessage } from '@/utils/vscode';
import { spawn_launcher } from '@/commands/command_wrapper';
import { remove } from '@/utils/file';

export async function execute(uri: vscode.Uri) {
	const xflPath = await fileUtils.validatePath(uri, ValidationPathType.folder, /(\.xfl)$/i);

	const config = getConfiguration<ConfigFlashToPAM>('configFlashToPam');

	let is_split_label;
	switch(config) {
		case 'Automatic':
		default:
			is_split_label = await xfl_maybe_split_label(xflPath);
			showMessage(
				is_split_label
					? 'Label folder found! Proceeds to convert with split label'
					: 'Label folder is missing, proceeds to convert without split label',
				'info',
			);
			break;
		case 'AlwaysAsk':
			is_split_label = await selectAndGetSplitLabel();
	}

	showMessage(
		is_split_label
			? 'Label folder found! Proceeds to convert with split label'
			: 'Label folder is missing, proceeds to convert without split label',
		'info',
	);
	const destinationPath = xflPath.replace(/(((\.pam)?\.xfl))?$/i, '.pam');
	await spawn_launcher({
		argument: {
			method: 'popcap.animation.from_flash_and_encode',
			source: xflPath,
			destination: destinationPath,
			has_label: is_split_label,
		},
		exception: async () => await remove(destinationPath),
	});
}
