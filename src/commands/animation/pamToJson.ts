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

        await senUtils.executeSenCommand([
                '-method',
                'popcap.animation.decode',
                '-source',
                pamPath,
                '-destination',
                destinationPath
            ],
            null,
            null,
            'Failed to convert pam to json!'
        );
    };
}