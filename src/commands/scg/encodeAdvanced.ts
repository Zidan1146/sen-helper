import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import * as fs from 'fs';
import { spawn_launcher } from '../command_wrapper';
import { assert_if } from '@/error';
import { showMessage } from '@/utils/vscode';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const packagePath = await fileUtils.validatePath(
			uri,
			ValidationPathType.folder,
			['.package'],
			{
				fileNotFound: 'Package not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .package',
			},
		);

		if (!packagePath) {
			return;
		}

		const isSplitLabel = fileUtils.isEncodeWithSplitLabel(packagePath).toString();

		const fileDestination = packagePath.replace('.package', '.scg');

		await spawn_launcher({
			argument: [
				'-method',
				'pvz2.custom.scg.encode',
				'-source',
				packagePath,
				'-destination',
				fileDestination,
				'-generic',
				ScgOptions.Advanced,
				'-animation_split_label',
				isSplitLabel,
			],
			success() {
				assert_if(fs.existsSync(fileDestination), 'Failed to decode SCG!');
				showMessage('SCG encoded successfully!', 'info');
			},
		});
	};
}
