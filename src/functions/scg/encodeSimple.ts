import * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { showMessage } from '@/utils/vscode';
import { unlinkSync } from 'fs';
import { spawn_launcher } from '@/commands/command_wrapper';

export async function execute(uri: vscode.Uri) {
    const packagePath = await fileUtils.validatePath(
        uri,
        ValidationPathType.folder,
        /(\.package)$/i,
    );
    const fileDestination = packagePath.replace(/(\.package)?$/i, '.scg');
    await spawn_launcher({
        argument: {
            method: 'pvz2.custom.scg.encode',
            source: packagePath,
            generic: ScgOptions.Simple,
        },
        success() {
            showMessage('SCG encoded successfully!', 'info');
        },
        exception: () => unlinkSync(fileDestination),
    });
}
