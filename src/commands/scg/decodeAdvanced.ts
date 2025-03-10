import { ScgOptions, ValidationPathType } from '@/types';
import { validatePath, writeSplitLabelIntoJson } from '@/utils/file';
import * as vscode from 'vscode';
import { selectAndGetSplitLabel } from '@/utils/project';
import { spawn_launcher } from '../command_wrapper';
import { showMessage } from '@/utils/vscode';
import { unlinkSync } from 'fs';

export function execute() {
	return async (uri: vscode.Uri) => {
		const scgPath = await validatePath(uri, ValidationPathType.file, /(\.scg)$/i);
		const isSplitLabel = await selectAndGetSplitLabel();
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
			exception: () => unlinkSync(fileDestination),
		});
	};
}
