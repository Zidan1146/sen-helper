import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as fs from 'fs';
import { spawn_launcher } from '../command_wrapper';
import { assert_if } from '@/error';
import { showMessage } from '@/utils/vscode';

export function execute() {
	return async (uri: vscode.Uri) => {
		const packagePath = await fileUtils.validatePath(
			uri,
			ValidationPathType.folder,
			/(\.package)$/i,
			{
				fileNotFound: 'Package not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .package',
			},
		);

		if (!packagePath) {
			return;
		}

		const fileDestination = packagePath.replace('.package', '.scg');

		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.encode',
				source: packagePath,
				destination: fileDestination,
				generic: ScgOptions.Simple,
			},
			success() {
				assert_if(fs.existsSync(fileDestination), 'Failed to decode SCG!');
				showMessage('SCG encoded successfully!', 'info');
			},
		});
	};
}
