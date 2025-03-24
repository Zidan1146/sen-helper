import { ProjectConfig, textureCategory, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as path from 'path';
import * as vscode from 'vscode';
import {
	initializeProjectConfig,
	selectAndGetTextureCategory,
	selectObbBundleFolder,
} from '@/utils/project';
import { spawn_launcher } from '../command_wrapper';
import { unlinkSync, existsSync } from 'fs';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const allowedExtensions = /(\.(senproj|bundle))$/i;
		const projectPath = uri
			? await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions)
			: await fileUtils.validateWorkspacePath(allowedExtensions);
		let obbPath: string = projectPath;
		let textureCategoryOption: textureCategory;
		if (/(\.senproj)$/i.test(projectPath)) {
			const configPath = path.join(projectPath, 'config.json');
			if (!existsSync(configPath)) {
				const projectObbPath = await selectObbBundleFolder(projectPath);
				obbPath = projectObbPath;
				const obbFile = projectObbPath.replace(/((\.bundle))?$/i, '');
				textureCategoryOption = await selectAndGetTextureCategory();
				const projectName = projectPath.replace(/((\.senproj))?$/i, '');
				initializeProjectConfig(context, projectName!, projectPath, obbFile!);
			} else {
				const configData = fileUtils.readJson<ProjectConfig>(configPath);
				obbPath = path.join(projectPath, `${configData.obbName}.bundle`);
				textureCategoryOption = configData.option.textureCategory;
			}
		} else {
			textureCategoryOption = await selectAndGetTextureCategory();
		}

		await spawn_launcher({
			argument: {
				method: 'popcap.rsb.build_project',
				source: obbPath,
				generic: textureCategoryOption,
			},
			exception: () => unlinkSync(projectPath),
		});
	};
}
