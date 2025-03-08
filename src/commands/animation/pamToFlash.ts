import { AnimationResolution, ValidationPathType } from '@/types';
import { selectAndGetSplitLabel } from '@/utils/project';
import vscode from 'vscode';
import * as fs from 'fs';
import { executeSenCommand } from '@/utils/sen';
import { validatePath } from '@/utils/file';

export function execute(context:vscode.ExtensionContext) {
    return async function (uri:vscode.Uri) {
        const pamPath = await validatePath(uri, ValidationPathType.file, ['.pam'], {
            fileNotFound: 'PAM not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .pam'
        });

        if(!pamPath) {
            return;
        }

        const isSplitLabel = await selectAndGetSplitLabel();

        const destinationPath = `${pamPath}.xfl`;

        await executeSenCommand([
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
            ],
            null,
            null,
            'Failed to convert pam to xfl!'
        );
    };
}