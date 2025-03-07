import { ScgOptions, ValidationPathType } from '@/types';
import { senUtils } from '@/utils';
import { validatePath } from '@/utils/file';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { spawn_launcher } from '../command_wrapper';
import { assert_if } from '@/error';
import { showMessage } from '@/utils/vscode';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const scgPath = await validatePath(uri, ValidationPathType.file, ['.scg'], {
			fileNotFound: 'SCG not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .scg',
		});

		if (!scgPath) {
			return;
		}

		const fileDestination = scgPath.replace('.scg', '.package');

		await spawn_launcher({
			argument: [
				'-method',
				'pvz2.custom.scg.decode',
				'-source',
				scgPath,
				'-destination',
				fileDestination,
				'-generic',
				ScgOptions.Simple,
			],
			success() {
				assert_if(fs.existsSync(fileDestination), 'Failed to decode SCG!');
				showMessage('SCG decoded successfully!', 'info');
			},
		});
	};
}
