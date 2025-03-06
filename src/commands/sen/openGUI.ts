import * as SenUtils from '@/utils/sen';
import { showError } from '@/utils/vscode';
import * as vscode from 'vscode';

export function execute(context: vscode.ExtensionContext) {
	return async () => {
		await SenUtils.openSenGui().catch((error) => {
			showError(error);
		});
	};
}
