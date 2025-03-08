import * as SenUtils from '@/utils/sen';
import { showError } from '@/utils/vscode';

export function execute() {
	return async () => {
		await SenUtils.openSenGui().catch((error) => {
			showError(error);
		});
	};
}
