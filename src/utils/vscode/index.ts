import { MessageOptions } from '@/types';
import vscode, { QuickPickItem } from 'vscode';

export type Type = 'info' | 'error' | 'warning';

export interface Parameter {
	message: string;
	type: Type;
}

export function showMessage(message: string, type: Type): void {
	switch (type) {
		case 'info':
			vscode.window.showInformationMessage(message);
			break;
		case 'error':
			vscode.window.showErrorMessage(message);
			break;
		case 'warning':
			vscode.window.showWarningMessage(message);
			break;
	}
}

export function showError(message: string): void {
	return showMessage(message, 'error');
}

export function showInfo(message: string): void {
	return showMessage(message, 'info');
}

export function showWarning(message: string): void {
	return showMessage(message, 'warning');
}

export interface Parameter {
	message: string;
	type: Type;
	then: (e: string | undefined) => any;
}

export interface EnumerationParameter extends Parameter {
	items: Array<string>;
}

export function showEnumeration({ message, type, items, then }: EnumerationParameter): void {
	switch (type) {
		case 'info':
			vscode.window.showInformationMessage(message, ...items).then(then);
			break;
		case 'error':
			vscode.window.showErrorMessage(message, ...items).then(then);
			break;
		case 'warning':
			vscode.window.showWarningMessage(message, ...items).then(then);
			break;
	}
}

export function showBoolean(it: Parameter): void {
	return showEnumeration({
		...it,
		then: (e) => {
			if (e === MessageOptions.Yes) {
				it.then(e);
			}
		},
		items: [MessageOptions.Yes, MessageOptions.No],
	});
}

export function spawn_command(command: string, ...rest: Array<any>): void {
	vscode.commands.executeCommand(command, ...rest);
}

export async function async_spawn_command(command: string, ...rest: Array<any>): Promise<void> {
	await vscode.commands.executeCommand(command, ...rest);
}

export function uriOf(source: string): vscode.Uri {
	return vscode.Uri.file(source);
}

export function uriJoin(baseUri:vscode.Uri, ...paths:string[]) {
	return vscode.Uri.joinPath(baseUri, ...paths);
}

export async function findFiles(include:vscode.GlobPattern, exclude?:vscode.GlobPattern) {
	return await vscode.workspace.findFiles(include, exclude);
}

export interface showQuickPickItems {
	label: string,
	description: string
}

export async function showQuickPick(items:showQuickPickItems[], options:vscode.QuickPickOptions) {
	return await vscode.window.showQuickPick(items, options);
}

export async function showOpenDialog(options?: vscode.OpenDialogOptions) {
	return await vscode.window.showOpenDialog(options);
}