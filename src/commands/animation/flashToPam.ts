import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { isXflHasLabel } from '@/utils/project';
import vscode from 'vscode';
import { showMessage } from '@/utils/vscode';
import { spawn_launcher } from '../command_wrapper';
import { XFL_EXT } from '@/constants';

export function execute() {
	return async function (uri: vscode.Uri) {
		const xflPath = await fileUtils.validatePath(uri, ValidationPathType.folder, XFL_EXT, {
			fileNotFound: 'XFL not found!',
			invalidFileType: 'Unsupported file type! Supported file type: .xfl',
		});

		if (!xflPath) {
			return;
		}

		const isSplitLabelBool = await isXflHasLabel(xflPath);

		if (isSplitLabelBool === undefined) {
			return;
		}
		showMessage(
			isSplitLabelBool
				? 'Label folder found! Proceeds to convert with split label'
				: 'Label folder is missing, proceeds to convert without split label',
			'info',
		);

		const isSplitLabel = isSplitLabelBool.toString();

		await spawn_launcher({
			argument: {
				method: 'popcap.animation.from_flash_and_encode',
				source: xflPath,
				has_label: isSplitLabel,
			}
		});
	};
}
