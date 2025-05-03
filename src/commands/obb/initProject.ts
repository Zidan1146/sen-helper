import { commandExecutor } from '@/functions/generic';
import { initProject } from '@/functions/obb';
import * as vscode from 'vscode';

// TODO: Brainstorm ideas for Sen Project structure and automation
export function execute(context: vscode.ExtensionContext) {
	const functionHandler = initProject(context);
	return commandExecutor({
		functionHandler: async (file) => functionHandler(file),
		fileFilter: {
			"OBB Files": ['obb', 'rsb']
		}
	});
}
