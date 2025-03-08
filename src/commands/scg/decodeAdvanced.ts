import { ScgOptions, ValidationPathType } from '@/types';
import { validatePath, writeSplitLabelIntoJson } from '@/utils/file';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { selectAndGetSplitLabel } from '@/utils/project';
import { spawn_launcher } from '../command_wrapper';
import { assert_if } from '@/error';
import { showMessage } from '@/utils/vscode';
import { SCG_EXT } from '@/constants';

export function execute() {
	return async (uri: vscode.Uri) => {
		const scgPath = await validatePath(uri, ValidationPathType.file, SCG_EXT, {
			fileNotFound: 'SCG not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .scg',
		});

		if (!scgPath) {
			return;
		}

		const isSplitLabel = await selectAndGetSplitLabel();

		const fileDestination = scgPath.replace(SCG_EXT, '.package');

		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.decode',
				source: scgPath,
				generic: ScgOptions.Advanced,
				animation_split_label: isSplitLabel,
			},
			success() {
				const dataJsonPath = path.join(fileDestination, 'data.json');
				assert_if(fs.existsSync(dataJsonPath), `${dataJsonPath} not found!`);
				writeSplitLabelIntoJson(fileDestination, isSplitLabel === 'true');
			},
		});
	};
}
