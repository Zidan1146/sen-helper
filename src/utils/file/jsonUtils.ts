import { DataJson } from '@/types';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { showError } from '../vscode';

function readDataJson(
	pathParam: string,
	reviver?: (key: string, value: any) => any,
): DataJson | null {
	try {
		const dataJsonPath = path.join(pathParam, 'data.json');
		const data = fs.readFileSync(dataJsonPath, 'utf-8');
		return JSON.parse(data, reviver);
	} catch (error) {
		showError(`Failed to read data.json: ${error}`);
		return null;
	}
}

export function writeSplitLabelIntoJson(pathParam: string, isSplitLabel: boolean): void {
	const data_file: DataJson | null = readDataJson(pathParam);

	if (data_file === undefined) {
		showError(`Failed to write ${pathParam}/data.json: Missing data.json!`);
		return;
	}

	const splitLabel = {
		'#split_label': isSplitLabel ?? isEncodeWithSplitLabel(pathParam),
	};

	const dataJsonStr = JSON.stringify({ ...splitLabel, ...data_file }, null, 4);

	try {
		const dataJsonPath = path.join(pathParam, 'data.json');
		fs.createWriteStream(dataJsonPath, { flags: 'w' }).write(dataJsonStr);
	} catch (error) {
		showError(`Failed to write ${pathParam}/data.json: ${error}`);
	}
}

export function isEncodeWithSplitLabel(pathParam: string): boolean {
	const dataJson: DataJson | null = readDataJson(pathParam);

	if (dataJson === null || !dataJson['#split_label']) {
		return true;
	}

	return dataJson['#split_label'];
}

export function writeJson(pathParam: string, data: any) {
	try {
		fs.writeFileSync(pathParam, JSON.stringify(data, null, '\t'));
	} catch (error) {
		showError(`Failed to write ${pathParam}: ${error}`);
	}
}

export function readJsonFromConfig(context: vscode.ExtensionContext, configName: string) {
	try {
		const dataPath = path.join(context.extensionPath, 'src', 'config', configName);
		const data = fs.readFileSync(dataPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		showError(`Failed to read ${configName}: ${error}`);
		return null;
	}
}

export function readJson(path: string, showErrorMessage: boolean = true) {
	try {
		const data = fs.readFileSync(path, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		if (showErrorMessage) {
			showError(`Failed to read ${path}: ${error}`);
		}
		return null;
	}
}
