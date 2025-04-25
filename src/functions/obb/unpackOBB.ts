import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { selectAndGetTextureCategory } from '@/utils/project';
import * as vscode from 'vscode';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
        const source_file = await fileUtils.validatePath(
            uri,
            ValidationPathType.file,
            /(\.(rsb|obb))$/i,
        );

        const textureCategoryOption = await selectAndGetTextureCategory();
        await spawn_launcher({
            argument: {
                method: 'popcap.rsb.init_project',
                source: source_file,
                generic: textureCategoryOption,
            }
        });
}