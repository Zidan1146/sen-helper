import { AnimationResolution, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { selectAndGetSplitLabel } from '@/utils/project';
import vscode from 'vscode';
import * as fs from 'fs';
import { assert_if } from '@/error';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
	return async function (uri: vscode.Uri) {
		const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.pam)$/i, {
			fileNotFound: 'PAM not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .pam',
		});

		if (pamPath === undefined) {
			return;
		}

		const isSplitLabel = await selectAndGetSplitLabel();

		const destinationPath = `${pamPath}.xfl`;

		await spawn_launcher({
			argument: {
				method: 'popcap.animation.decode_and_to_flash',
				source: pamPath,
				destination: destinationPath,
				resolution: AnimationResolution.High,
				has_label: isSplitLabel,
			},
			success() {
				assert_if(fs.existsSync(destinationPath), 'Failed to convert pam to xfl!');
			},
		});
	};
}
