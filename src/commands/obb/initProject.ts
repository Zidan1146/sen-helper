import { assert_if } from '@/error';
import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { initializeProjectConfig, selectAndGetTextureCategory } from '@/utils/project';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';
import { showBoolean, showError, spawn_command, uriOf } from '@/utils/vscode';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const obbPath = await fileUtils.validatePath(
			uri,
			ValidationPathType.file,
			/(\.(rsb|obb))$/i,
			{
				fileNotFound: 'OBB not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .obb',
			},
		);

		if (!obbPath) {
			return;
		}

		const projectName = await vscode.window.showInputBox({
			prompt: 'Project name',
			placeHolder: `Input your project name (insert '.' for current directory)`,
		});

		let projectFullPath = obbPath;
		let projectPath = obbPath;

		const textureCategoryOption = await selectAndGetTextureCategory();

		const isProjectNameNotEmpty = projectName && projectName !== '.';

		if (isProjectNameNotEmpty) {
			// Create {ProjectName}.senproj folder for better organization
			const pathParts = obbPath.split('/');
			const obbFile = pathParts.pop();

			if (!obbFile) {
				showError(`Input OBB doesn't exists!`);
				return;
			}
			pathParts.push(`${projectName}.senproj`);

			projectPath = pathParts.join('/');
			fs.mkdirSync(projectPath);

			initializeProjectConfig(context, projectName, projectPath, obbFile);

			pathParts.push(`${obbFile}.bundle`);

			projectFullPath = pathParts.join('/');
		}

		await spawn_launcher({
			argument: {
				method: 'popcap.rsb.init_project',
				source: obbPath,
				destination: projectFullPath,
				generic: textureCategoryOption,
			},
			success() {
				assert_if(
					fs.existsSync(projectFullPath),
					`Failed to init project: ${projectFullPath} path doesn't exists`,
				);
				showBoolean({
					message: 'Initialized project successfully! Open the resulting folder?',
					type: 'info',
					then: (_) => {
						spawn_command('vscode.openFolder', uriOf(projectPath));
					},
				});
			},
			exception() {
				if (isProjectNameNotEmpty) {
					fs.rm(
						projectFullPath,
						{
							recursive: true,
							force: true,
						},
						() => null,
					);
				}
			},
		});
	};
}
