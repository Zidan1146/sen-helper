import { MissingLibrary } from '@/error';
import { ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import * as vscode from 'vscode';
import * as fs from 'fs';

export function execute(context:vscode.ExtensionContext) {
    return async function (uri:vscode.Uri) {
        const jsonPamPath = await fileUtils.validatePath(uri, ValidationPathType.file, ['.pam.json'], {
            fileNotFound: 'JSON PAM not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .pam.json'
        });

        if(!jsonPamPath) {
            return;
        }

        const destinationPath = jsonPamPath.replace('.json', '');

        try {
            await senUtils.runSenAndExecute([
                '-method',
                'popcap.animation.encode',
                '-source',
                jsonPamPath,
                '-destination',
                destinationPath
            ]);
        } catch (error) {
            if(
                error instanceof Error ||
                error instanceof MissingLibrary ||
                error instanceof vscode.CancellationError
            ) {
                vscode.window.showErrorMessage(error.message);
                return;
            }
        }

        if(!fs.existsSync(destinationPath)) {
            vscode.window.showErrorMessage('Failed to convert pam to xfl!');
            return;
        }
    };
}