import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
    return async function (uri: vscode.Uri) {
        const jsonPath = await fileUtils.validatePath(uri, ValidationPathType.file, /(\.json)$/i);

        if(!jsonPath) {
            return;
        }

        await spawn_launcher({
            argument: {
                method: 'popcap.rton.encode',
                source: jsonPath
            }
        });
    };
}