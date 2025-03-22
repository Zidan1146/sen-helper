import { DataJson } from '@/types';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { showError } from '../vscode';

export function readDataJson(pathParam: string, reviver?: (key: string, value: any) => any): DataJson {
	const dataJsonPath = path.join(pathParam, 'data.json');
	const data = fs.readFileSync(dataJsonPath, 'utf-8');
	return JSON.parse(data, reviver);
}

export function writeSplitLabelIntoJson(pathParam: string, isSplitLabel: boolean): void {
	const data_file: DataJson = readDataJson(pathParam);

	if (data_file === undefined) {
		showError(`Failed to write ${pathParam}/data.json: Missing data.json!`);
		return;
	}

	const splitLabel = {
		'#split_label': isSplitLabel ?? isEncodeWithSplitLabel(pathParam),
	};

	const dataJsonStr = JSON.stringify({ ...splitLabel, ...data_file }, null, '\t');

	const dataJsonPath = path.join(pathParam, 'data.json');
	fs.createWriteStream(dataJsonPath, { flags: 'w' }).write(dataJsonStr);
}

export function isEncodeWithSplitLabel(pathParam: string): boolean {
	const dataJson: DataJson = readDataJson(pathParam);

	if (dataJson === null || !dataJson['#split_label']) {
		return true;
	}

	return dataJson['#split_label'];
}

export function writeJson<T>(pathParam: string, data: T): void {
	fs.writeFileSync(pathParam, JSON.stringify(data, null, '\t'));
}

export function readJsonFromConfig<T>(context: vscode.ExtensionContext, configName: string): T {
	const dataPath = path.join(context.extensionPath, 'src', 'config', configName);
	const data = fs.readFileSync(dataPath, 'utf-8');
	return JSON.parse(data);
}

export function readJson<T>(path: string): T {
	const data = fs.readFileSync(path, 'utf-8');
	return JSON.parse(data);
}
