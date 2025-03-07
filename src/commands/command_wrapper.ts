import { MissingLibrary } from '@/error';
import { senUtils } from '@/utils';
import { showMessage } from '@/utils/vscode';
import vscode from 'vscode';

export interface Parameter {
	argument: Array<string>;
	success?: () => void;
	exception?: () => void;
}

export async function spawn_launcher({ argument, success, exception }: Parameter): Promise<void> {
	try {
		await senUtils.runSenAndExecute(argument);
		if (success !== undefined) {
			success();
		}
	} catch (error) {
		if (
			error instanceof Error ||
			error instanceof MissingLibrary ||
			error instanceof vscode.CancellationError
		) {
			showMessage(error.message, 'error');
		}
		if (exception !== undefined) {
			exception();
		}
	}
}
