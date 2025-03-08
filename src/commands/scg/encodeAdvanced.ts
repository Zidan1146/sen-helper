import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { spawn_launcher } from '../command_wrapper';
import { showMessage } from '@/utils/vscode';
import { PACKAGE_EXT } from '@/constants';

export function execute() {
	return async (uri: vscode.Uri) => {
		const packagePath = await fileUtils.validatePath(
			uri,
			ValidationPathType.folder,
			PACKAGE_EXT,
			{
				fileNotFound: 'Package not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .package',
			},
		);

		if (!packagePath) {
			return;
		}

		const isSplitLabel = fileUtils.isEncodeWithSplitLabel(packagePath).toString();

		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.encode',
				source: packagePath,
				generic: ScgOptions.Advanced,
				animation_split_label: isSplitLabel,
			}
		});
	};
}
