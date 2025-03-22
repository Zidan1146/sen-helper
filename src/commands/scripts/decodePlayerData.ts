import { ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { rtonToJson as getRtonToJsonCommand } from '@/commands/json';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { showWarning, uriOf } from '@/utils/vscode';

export function execute() {
    return async function(uri: vscode.Uri) {
        showWarning("Disclaimer: this command is intended for mod testing purposes only, beyond that's up to the user responsibility.");

        const source_path = await fileUtils.validatePath(uri, ValidationPathType.file, /pp\.dat$/i);
        if(!source_path) {
            return;
        }

        const tempSource = source_path.replace(/(\.dat)?$/i, '.rton');
        const tempSourceUri = uriOf(tempSource);

        fs.copyFileSync(source_path, tempSource);

        const command = getRtonToJsonCommand();
        await command(tempSourceUri);

        fs.unlinkSync(tempSource);
    };
}