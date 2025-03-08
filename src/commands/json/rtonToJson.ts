import { RTON_EXT } from '@/constants';
import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as vscode from 'vscode';
import { spawn_launcher } from '../command_wrapper';

export function execute() {
    return async function (uri:vscode.Uri) {
        const rtonPath = await fileUtils.validatePath(
            uri,
            ValidationPathType.file, 
            RTON_EXT, 
            {
                fileNotFound: 'RTON not found!',
				invalidFileType: 'Unsupported file type! Supported file type: .rton',
            }
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
    };
}