import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { spawn_launcher } from '../command_wrapper';
import { showMessage } from '@/utils/vscode';
import { unlinkSync } from 'fs';

export function execute() {
	return async (uri: vscode.Uri) => {
		const packagePath = await fileUtils.validatePath(
			uri,
			ValidationPathType.folder,
			/(\.package)$/i,
		);

		if (!packagePath) {
			return;
		}

		const isSplitLabel = fileUtils.isEncodeWithSplitLabel(packagePath).toString();

		const fileDestination = packagePath.replace(/(\.package)?$/i, '.scg');

		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.encode',
				source: packagePath,
				destination: fileDestination,
				generic: ScgOptions.Advanced,
				animation_split_label: isSplitLabel,
			},
			success() {
				showMessage('SCG encoded successfully!', 'info');
			},
			exception: () => unlinkSync(fileDestination),
		});
	};
}
