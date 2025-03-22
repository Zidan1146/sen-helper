import * as vscode from 'vscode';
import { validateSen } from './utils/sen';
import { async_spawn_command } from './utils/vscode';

export async function updateContext(context:vscode.ExtensionContext) {
    const data = {
        isSenExists: validateSen()
    };
    
    for (const [contextKey, contextValue] of Object.entries(data)) {
        await context.globalState.update(contextKey, contextValue);
        await async_spawn_command('setContext', contextKey, contextValue);
    }
}