import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigOBBFunction, ProjectConfig, textureCategory } from '@/types';
import { readJsonFromConfig, writeJson } from '../file';
import { getConfiguration, showError, showQuickPick, showWarning } from '../vscode';

export async function initializeProjectConfig(
	context: vscode.ExtensionContext,
	projectName: string,
	projectPath: string,
	obbName: string,
): Promise<boolean | null> {
	const configPath = path.join(projectPath, 'config.json');
	const defaultConfig: ProjectConfig | null = await readJsonFromConfig(
		context,
		'sen-helper.obb.androidInitProject.json',
	);

	if (!defaultConfig) {
		fs.rm(
			projectPath,
			{
				recursive: true,
				force: true,
			},
			() => null,
		);
		return null;
	}

	defaultConfig.obbName = obbName;
	defaultConfig.projectName = projectName;
	defaultConfig.option.textureCategory = textureCategory.Android;

	writeJson(configPath, defaultConfig);

	return true;
}

export async function selectAndGetTextureCategory() {
	const categories = Object.keys(textureCategory).map((key) => ({
		label: key,
	}));

	return await vscode.window
		.showQuickPick(categories, {
			placeHolder: 'Select texture category (Default: Android)',
		})
		.then((value) => {
			const key = value?.label ?? 'Android';

			return textureCategory[key as keyof typeof textureCategory];
		});
}

export async function getTextureCategory() {
	const config = getConfiguration<ConfigOBBFunction>('configOBBFunction');
	let textureCategoryOption;
	switch(config) {
		case 'AlwaysAsk':
		default:
			textureCategoryOption = await selectAndGetTextureCategory();
			break;
		case 'AlwaysAndroid':
			textureCategoryOption = textureCategory.Android;
			break;
		case 'AlwaysIOS':
			textureCategoryOption = textureCategory.IOS;
			break;
		case 'AlwaysAndroidChina':
			textureCategoryOption = textureCategory.AndroidChina;
			break;
	}

	return textureCategoryOption;
}

export async function selectObbBundleFolder(parentFolder: string): Promise<string> {
	return new Promise((resolve, reject) => {
		// Read directories inside parentFolder
		fs.readdir(parentFolder, { withFileTypes: true }, async (err, files) => {
			if (err) {
				showError(`Failed to read directory: ${err.message}`);
				reject(err);
				return;
			}

			// Filter folders ending with .obb.bundle
			const obbBundles = files
				.filter((dirent) => dirent.isDirectory() && dirent.name.endsWith('.obb.bundle'))
				.map((dirent) => ({
					label: dirent.name,
					description: path.join(parentFolder, dirent.name),
				}));

			if (obbBundles.length === 0) {
				showWarning('Unpacked obb is not found.');
				showWarning(
					'Did you rename the unpacked obb? or unpacked obb never exists in the first place?',
				);
				reject('Unallowed operation');
			}

			const selected = await showQuickPick(obbBundles, {
				placeHolder: 'Select OBB to be packed',
			});
			if (selected === undefined) {
				reject('You have not selected any file!');
			}
			resolve(selected!.description); // Return full path if selected
		});
	});
}
