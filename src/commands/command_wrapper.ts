import { senUtils } from '@/utils';
import { showMessage } from '@/utils/vscode';

type Argument<T = any> = { [key: string]: T } & { length?: never };

export interface Parameter {
	argument: Argument<any>;
	success?: () => void;
	exception?: () => void;
}

function construct_argument(argument: Argument<any>): Array<string> {
	const result = [] as Array<string>;
	for (let [key, value] of Object.entries(argument)) {
		result.push(`-${key}`, value);
	}
	return result;
}

export async function spawn_launcher({ argument, success, exception }: Parameter): Promise<void> {
	try {
		await senUtils.runSenAndExecute(construct_argument(argument));
		if (success !== undefined) {
			success();
		}
	} catch (error) {
		showMessage((error as Error).message, 'error');
		if (exception !== undefined) {
			exception();
		}
	}
}
