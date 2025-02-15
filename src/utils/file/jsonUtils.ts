import { DataJson } from '@/types';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

function readDataJson(context: vscode.ExtensionContext, pathParam: string, reviver?: (key:string, value:any) => any): DataJson | null {
    try {
        const dataJsonPath = context.asAbsolutePath(path.join(pathParam, 'data.json'));
        const data = fs.readFileSync(dataJsonPath, 'utf-8');
        return JSON.parse(data, reviver);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to read data.json: ${error}`);
        return null;
    }
}

export function writeSplitLabelIntoJson(context: vscode.ExtensionContext, pathParam: string, isSplitLabel: boolean): void {
    const dataJson:DataJson|null = readDataJson(context, pathParam);

    if(!dataJson) {
        vscode.window.showErrorMessage(`Failed to write ${pathParam}\\data.json: Missing data.json!`);
        return;
    }

    const splitLabel = {
        '#split_label': isSplitLabel || isEncodeWithSplitLabel(context, pathParam)
    };

    const dataJsonStr = JSON.stringify({...splitLabel, ...dataJson}, null, 4);

    try {
        const dataJsonPath = path.join(pathParam, 'data.json');
        fs.createWriteStream(dataJsonPath, { flags: 'w' }).write(dataJsonStr);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write ${pathParam}\\data.json: ${error}`);
    }
}

export function isEncodeWithSplitLabel(context: vscode.ExtensionContext, pathParam:string): boolean {
    const dataJson:DataJson|null = readDataJson(context, pathParam);

    if(!dataJson || !dataJson['#split_label']) {
        return true;
    }

    return dataJson['#split_label'];
}

export function writeJson(pathParam: string, data: any) {
    try {
        fs.writeFileSync(pathParam, JSON.stringify(data, null, 4));
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write ${pathParam}: ${error}`);
    }
}

export function readJsonFromConfig(context: vscode.ExtensionContext, configName: string) {
    try {
        const dataPath = path.join(context.extensionPath, 'src', 'config', configName);
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to read ${configName}: ${error}`);
        return null;
    }
}

export function readJson(path: string, showErrorMessage: boolean = true) {
    try {
        const data = fs.readFileSync(path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if(showErrorMessage) {
            vscode.window.showErrorMessage(`Failed to read ${path}: ${error}`);
        }
        return null;
    }
}