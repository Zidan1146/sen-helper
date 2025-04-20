import { DataJson } from '@/types';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { showError } from '../vscode';
import { read_file, write_file } from './fileHelper';

export async function readDataJson(
	pathParam: string,
	reviver?: (key: string, value: any) => any,
): Promise<DataJson> {
	const dataJsonPath = path.join(pathParam, 'data.json');
	const data = await read_file(dataJsonPath);
	return JSON.parse(data, reviver);
}

export async function writeSplitLabelIntoJson(
	pathParam: string,
	isSplitLabel: boolean,
): Promise<void> {
	const data_file: DataJson = await readDataJson(pathParam);

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

export async function isEncodeWithSplitLabel(pathParam: string): Promise<boolean> {
	const dataJson: DataJson = await readDataJson(pathParam);

	if (dataJson === null || !dataJson['#split_label']) {
		return true;
	}

	return dataJson['#split_label'];
}

export async function writeJson<T>(pathParam: string, data: T): Promise<void> {
	await write_file(pathParam, JSON.stringify(data, null, '\t'));
}

export async function readJsonFromConfig<T>(
	context: vscode.ExtensionContext,
	configName: string,
): Promise<T> {
	const dataPath = path.join(context.extensionPath, 'src', 'config', configName);
	return await readJson(dataPath);
}

export async function readJson<T>(path: string): Promise<T> {
	const data = await read_file(path);
	return JSON.parse(data);
}
