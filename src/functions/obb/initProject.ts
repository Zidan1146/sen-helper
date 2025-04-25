import { assert_if } from '@/error';
import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { initializeProjectConfig, selectAndGetTextureCategory } from '@/utils/project';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import * as vscode from 'vscode';
import { showBoolean, spawn_command, uriOf } from '@/utils/vscode';
import path from 'path';
import { spawn_launcher } from '@/commands/command_wrapper';

export function execute(context: vscode.ExtensionContext) {
	return async (uri: vscode.Uri) => {
		const source_file = await fileUtils.validatePath(
			uri,
			ValidationPathType.file,
			/(\.(rsb|obb))$/i,
		);
		const projectName = await vscode.window.showInputBox({
			prompt: 'Project name',
			placeHolder: `Input your project name (insert '.' for current directory)`,
		});
		assert_if(
			projectName !== undefined && projectName.length !== 0,
			'Project name cannot be empty',
		);

		let projectPath = source_file.replace(/(\.(obb|rsb))?$/i, '.senproj');
		let projectFullPath = projectPath
			.concat(path.basename(source_file))
			.replace(/(\.(obb|rsb))?$/i, '.bundle');
		initializeProjectConfig(context, projectName, projectPath, source_file);
		const textureCategoryOption = await selectAndGetTextureCategory();
		mkdirSync(projectPath);
		await spawn_launcher({
			argument: {
				method: 'popcap.rsb.init_project',
				source: source_file,
				destination: projectFullPath,
				generic: textureCategoryOption,
			},
			success() {
				assert_if(
					existsSync(projectFullPath),
					`Failed to init project: ${projectFullPath} path doesn't exists`,
				);
				showBoolean({
					message: 'Initialized project successfully! Open the resulting folder?',
					type: 'info',
					then: (_) => {
						spawn_command('vscode.openFolder', uriOf(projectPath), {
							forceReuseWindow: true,
						});
					},
				});
			},
			exception: () => unlinkSync(projectPath),
		});
	};
}
