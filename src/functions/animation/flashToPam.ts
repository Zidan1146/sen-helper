import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { xfl_maybe_split_label } from '@/utils/project';
import vscode from 'vscode';
import { showMessage } from '@/utils/vscode';
import { unlinkSync } from 'fs';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
	const xflPath = await fileUtils.validatePath(uri, ValidationPathType.folder, /(\.xfl)$/i);
	const is_split_label = await xfl_maybe_split_label(xflPath);
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
		exception: () => unlinkSync(destinationPath),
	});
}
