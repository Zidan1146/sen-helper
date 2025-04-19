import { spawn_launcher } from "@/commands/command_wrapper";
import { ValidationPathType } from "@/types";
import { fileUtils } from "@/utils";
import * as vscode from 'vscode';

export async function execute(uri: vscode.Uri) {
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
}