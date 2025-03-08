import { AnimationResolution, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { selectAndGetSplitLabel } from '@/utils/project';
import vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';
import { PAM_EXT } from '@/constants';

export function execute() {
	return async function (uri: vscode.Uri) {
		const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, PAM_EXT, {
			fileNotFound: 'PAM not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .pam',
		});

		if (pamPath === undefined) {
			return;
		}

		const isSplitLabel = await selectAndGetSplitLabel();

		await spawn_launcher({
			argument: {
				method: 'popcap.animation.decode_and_to_flash',
				source: pamPath,
				resolution: AnimationResolution.High,
				has_label: isSplitLabel,
			}
		});
	};
}
