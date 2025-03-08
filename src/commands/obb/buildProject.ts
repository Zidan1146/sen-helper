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
import { showInfo, showMessage } from '@/utils/vscode';
import { combineRegex } from '@/utils/regex';
import { BUNDLE_EXT, SENPROJ_EXT } from '@/constants';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const allowedExtensions = combineRegex(SENPROJ_EXT, BUNDLE_EXT);

		const projectPath = uri
			? await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions, {
					fileNotFound: 'Project not found!',
					invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions}`,
			})
			: await fileUtils.validateWorkspacePath(allowedExtensions);

		if (!projectPath) {
			return;
		}

		let obbPath: string = projectPath;
		let textureCategoryOption: textureCategory;

		if (allowedExtensions.test(projectPath)) {
			const configFileName = 'config.json';
			const configPath = path.join(projectPath, configFileName);

			const configData: ProjectConfig = fileUtils.readJson(configPath, false);

			if (!configData) {
				showInfo('Configuration missing. Please choose an option.');
				const projectObbPath = await selectObbBundleFolder(projectPath);

				if (!projectObbPath) {
					return;
				}

				obbPath = projectObbPath;

				const obbFile = projectObbPath.split('/').at(-1)?.replace(BUNDLE_EXT, '');
				textureCategoryOption = await selectAndGetTextureCategory();

				const projectName = projectPath.split('/').at(-1)?.replace(SENPROJ_EXT, '');
				initializeProjectConfig(context, projectName!, projectPath, obbFile!);
			} else {
				obbPath = path.join(projectPath, `${configData.obbName}.bundle`);
				textureCategoryOption = configData.option.textureCategory;
			}
		} else {
			textureCategoryOption = await selectAndGetTextureCategory();
		}

		const destinationPath = obbPath.replace(BUNDLE_EXT, '');

		await spawn_launcher({
			argument: {
				method: 'popcap.rsb.build_project',
				source: obbPath,
				destination: destinationPath,
				generic: textureCategoryOption,
			},
			success() {
				showMessage(`Project built successfully!\nLocated at ${destinationPath}`, 'info');
			},
		});
	};
}
