import { assert_if } from '@/error';
import {
	DataJson,
	ExpandMethod,
	ResGroupType,
	SplitResInfoOptions,
	ValidationPathType,
} from '@/types';
import { fileUtils } from '@/utils';
import { readDataJson } from '@/utils/file';
import { getSelectedAtlas } from '@/utils/project/projectAtlases';
import { findFiles } from '@/utils/vscode';
import * as path from 'path';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
	return async function (uri: vscode.Uri) {
		const packagePath = await fileUtils.validatePath(
			uri,
			ValidationPathType.folder,
			/(\.package)$/i,
		);
		const dataJson: DataJson = await readDataJson(packagePath);

		assert_if(
			dataJson['#expand_method'] === ExpandMethod.simple && !!dataJson,
			`This package folder was produced from 'For Modding' option, only 'Simple' option are allowed to execute this operation`,
		);

		const atlasToSplit = await getSelectedAtlas(dataJson);
		assert_if(!!atlasToSplit, "there's no atlases to split");

		const jsonAtlasPath = atlasToSplit!.description;

		const jsonAtlasFullPath = path.join(packagePath, 'resource', jsonAtlasPath);
		const imagesPath = path.dirname(jsonAtlasFullPath);

		const atlasFile = path.basename(jsonAtlasFullPath);
		const atlasFileNoExt = atlasFile.replace(/\.json$/i, '');

		const atlasImagesGlob = new vscode.RelativePattern(
			imagesPath,
			`**/${atlasFileNoExt}_[0-9][0-9].*`,
		);
		const files = await findFiles(atlasImagesGlob);
		const atlasImagesRegex = new RegExp(`${atlasFileNoExt}_\\d{2}\\.png$`, 'i');

		const atlasImages = files
			.filter((file) => {
				return atlasImagesRegex.test(file.fsPath);
			})
			.map((filteredFiles) => filteredFiles.fsPath);

		const source = [jsonAtlasFullPath, ...atlasImages];

		spawn_launcher({
			argument: {
				method: 'popcap.atlas.split_by_res_info',
				source: [...source],
				split_method: SplitResInfoOptions.Path,
			},
		});
	};
}
