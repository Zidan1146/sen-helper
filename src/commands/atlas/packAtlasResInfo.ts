import { AtlasData, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { readJson } from '@/utils/file';
import { getFirstDimension } from '@/utils/project/projectAtlases';
import path from 'path';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
	return async function (uri: vscode.Uri) {
		const sourcePath = await fileUtils.validatePath(
			uri,
			ValidationPathType.folder,
			/\.sprite$/i,
		);

		const atlasJsonPath = sourcePath.replace(/\.sprite/, '.json');
		const jsonData: AtlasData = await readJson(atlasJsonPath);
		const imageDimension = getFirstDimension(jsonData);

		spawn_launcher({
			argument: {
				method: 'popcap.atlas.pack_by_resource_group',
				width: imageDimension.width,
				height: imageDimension.height,
			},
		});
	};
}
