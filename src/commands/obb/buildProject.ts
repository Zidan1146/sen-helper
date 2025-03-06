import { ProjectConfig, textureCategory, ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
	initializeProjectConfig,
	selectAndGetTextureCategory,
	selectObbBundleFolder,
} from '@/utils/project';
import { spawn_launcher } from '../command_wrapper';
import { assert_if } from '@/error';
import { showInfo, showMessage } from '@/utils/vscode';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const allowedExtensions = ['.senproj', '.bundle'];

		const projectPath = uri
			? await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions, {
					fileNotFound: 'Project not found!',
					invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions.join(
						', ',
					)}`,
			  })
			: await fileUtils.validateWorkspacePath(allowedExtensions);

		if (!projectPath) {
			return;
		}

		let obbPath: string = projectPath;
		let textureCategoryOption: textureCategory;

		if (projectPath.endsWith('.senproj')) {
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

				const obbFile = projectObbPath.split('/').at(-1)?.replace('.bundle', '');
				textureCategoryOption = await selectAndGetTextureCategory();

				const projectName = projectPath.split('/').at(-1)?.replace('.senproj', '');
				initializeProjectConfig(context, projectName!, projectPath, obbFile!);
			} else {
				obbPath = path.join(projectPath, `${configData.obbName}.bundle`);
				textureCategoryOption = configData.option.textureCategory;
			}
		} else {
			textureCategoryOption = await selectAndGetTextureCategory();
		}

		const destinationPath = obbPath.replace('.bundle', '');

		await spawn_launcher({
			argument: [
				'-method',
				'popcap.rsb.build_project',
				'-source',
				obbPath,
				'-destination',
				destinationPath,
				'-generic',
				textureCategoryOption,
			],
			success() {
				assert_if(fs.existsSync(destinationPath), 'Failed to convert pam to xfl!');
				showMessage(`Project built successfully!\nLocated at ${destinationPath}`, 'info');
			},
		});
	};
}
