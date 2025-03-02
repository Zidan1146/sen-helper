import { AnimationResolution, ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import { selectAndGetSplitLabel } from '@/utils/project';
import vscode from 'vscode';
import * as fs from 'fs';
import { MissingLibrary } from '@/error';

export function execute(context:vscode.ExtensionContext) {
    return async function (uri:vscode.Uri) {
        const pamPath = await fileUtils.validatePath(uri, ValidationPathType.file, ['.pam'], {
            fileNotFound: 'PAM not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .pam'
        });

        if(!pamPath) {
            return;
        }

        const isSplitLabel = await selectAndGetSplitLabel();

        const destinationPath = `${pamPath}.xfl`;

        try {
            await senUtils.runSenAndExecute([
                '-method',
                'popcap.animation.decode_and_to_flash',
                '-source',
                pamPath,
                '-destination',
                destinationPath,
                '-resolution',
                AnimationResolution.High,
                '-has_label',
                isSplitLabel
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