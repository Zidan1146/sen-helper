import { MissingLibrary } from '@/error';
import { ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import * as vscode from 'vscode';
import * as fs from 'fs';

export function execute(context:vscode.ExtensionContext) {
    return async function (uri:vscode.Uri) {
        const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, ['.pam'], {
            fileNotFound: 'PAM not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .pam'
        });

        if(!pamPath) {
            return;
        }

        const destinationPath = `${pamPath}.json`;

        try {
            await senUtils.runSenAndExecute([
                '-method',
                'popcap.animation.decode',
                '-source',
                pamPath,
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