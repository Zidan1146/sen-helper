import { ScgOptions, ValidationPathType } from '@/types';
import { validatePath } from '@/utils/file';
import * as vscode from 'vscode';
import * as fs from 'fs';
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

		const fileDestination = scgPath.replace(SCG_EXT, '.package');

		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.decode',
				source: scgPath,
				generic: ScgOptions.Simple,
			}
		});
	};
}
