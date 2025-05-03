import { commandExecutor } from '@/functions/generic';
import { buildProject } from '@/functions/obb';
import * as vscode from 'vscode';

// TODO: Brainstorm ideas for Sen Project structure and automation
export function execute(context: vscode.ExtensionContext) {
	const functionHandler = buildProject(context);
	return commandExecutor({
		functionHandler: async (file) => (await functionHandler)(file),
		allowFile: false,
		allowFolder: true,
		fileFilter: {
			"Sen Project": ['senproj']
		}
	});
}
