import { MessageOptions } from '@/types';
import vscode from 'vscode';

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
	vscode.commands.executeCommand(command, ...rest, {
		forceReuseWindow: true,
	});
}

export function uriOf(source: string): vscode.Uri {
	return vscode.Uri.file(source);
}
