import { ScgOptions, ValidationPathType } from '@/types';
import { validatePath, writeSplitLabelIntoJson } from '@/utils/file';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { selectAndGetSplitLabel } from '@/utils/project';
import { spawn_launcher } from '../command_wrapper';
import { assert_if } from '@/error';
import { showMessage } from '@/utils/vscode';

export function execute() {
	return async (uri: vscode.Uri) => {
		const scgPath = await validatePath(uri, ValidationPathType.file, /(\.scg)$/i, {
			fileNotFound: 'SCG not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .scg',
		});

		if (!scgPath) {
			return;
		}

		const isSplitLabel = await selectAndGetSplitLabel();

		const fileDestination = scgPath.replace('.scg', '.package');

		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.decode',
				source: scgPath,
				destination: fileDestination,
				generic: ScgOptions.Advanced,
				animation_split_label: isSplitLabel,
			},
			success() {
				assert_if(fs.existsSync(fileDestination), 'Failed to decode SCG!');
				showMessage('SCG decoded successfully!', 'info');
				const dataJsonPath = path.join(fileDestination, 'data.json');
				assert_if(fs.existsSync(dataJsonPath), `${dataJsonPath} not found!`);
				writeSplitLabelIntoJson(fileDestination, isSplitLabel === 'true');
			},
		});
	};
}
