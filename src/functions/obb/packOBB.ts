import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import {
    selectAndGetTextureCategory,
} from '@/utils/project';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
    const allowedExtensions = /(\.(bundle))$/i;
    const projectPath = await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions);
    const textureCategoryOption = await selectAndGetTextureCategory();

    await spawn_launcher({
        argument: {
            method: 'popcap.rsb.build_project',
            source: projectPath,
            generic: textureCategoryOption,
        }
    });
}
