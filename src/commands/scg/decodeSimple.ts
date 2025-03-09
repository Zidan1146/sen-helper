import { ScgOptions, ValidationPathType } from '@/types';
import { validatePath } from '@/utils/file';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';
import { showMessage } from '@/utils/vscode';
import { unlinkSync } from 'fs';

export function execute() {
	return async (uri: vscode.Uri) => {
		const scgPath = await validatePath(uri, ValidationPathType.file, /(\.scg)$/i);
		const fileDestination = scgPath.replace(/(\.scg)?$/i, '.package');
		await spawn_launcher({
			argument: {
				method: 'pvz2.custom.scg.decode',
				source: scgPath,
				destination: fileDestination,
				generic: ScgOptions.Simple,
			},
			success() {
				showMessage('SCG decoded successfully!', 'info');
			},
			exception: () => unlinkSync(fileDestination),
		});
	};
}
