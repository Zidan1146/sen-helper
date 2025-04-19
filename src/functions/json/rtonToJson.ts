import { spawn_launcher } from '@/commands/command_wrapper';
import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';

export async function execute(uri:vscode.Uri) {
    const rtonPath = await fileUtils.validatePath(
        uri,
        ValidationPathType.file, 
        /(\.rton)$/i
    );

    if(!rtonPath) {
        return;
    }

    await spawn_launcher({
        argument: {
            method: 'popcap.rton.decode',
            source: rtonPath
        }
    });
}