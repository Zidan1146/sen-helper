import { ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import { isXflHasLabel } from '@/utils/project';
import vscode from 'vscode';
import * as fs from 'fs';
import { MissingLibrary } from '@/error';

export function execute(context:vscode.ExtensionContext) {
    return async function (uri:vscode.Uri) {
        const xflPath = await fileUtils.validatePath(uri, ValidationPathType.folder, ['.xfl'], {
            fileNotFound: 'XFL not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .xfl'
        });

        if(!xflPath) {
            return;
        }

        const isSplitLabelBool = await isXflHasLabel(xflPath);

        if(isSplitLabelBool === undefined) {
            return;
        }
        vscode.window.showInformationMessage(
            isSplitLabelBool ? 
                "Label folder found! Proceeds to convert with split label"
                :
                "Label folder is missing, proceeds to convert without split label"
        );

        const isSplitLabel = isSplitLabelBool.toString();
        const destinationPath = xflPath.replace('.xfl', '');

        await senUtils.executeSenCommand([
                '-method',
                'popcap.animation.from_flash_and_encode',
                '-source',
                xflPath,
                '-destination',
                destinationPath,
                '-has_label',
                isSplitLabel
            ],
            null,
            null,
            'Failed to convert pam to xfl!'
        );
    };
}