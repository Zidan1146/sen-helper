import { MissingLibrary } from '@/error';
import { ValidationPathType } from '@/types';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { executeSenCommand } from '@/utils/sen';
import { validatePath } from '@/utils/file';

export function execute(context:vscode.ExtensionContext) {
    return async function (uri:vscode.Uri) {
        const jsonPamPath = await validatePath(uri, ValidationPathType.file, ['.pam.json'], {
            fileNotFound: 'JSON PAM not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .pam.json'
        });

        if(!jsonPamPath) {
            return;
        }

        const destinationPath = jsonPamPath.replace('.json', '');

        await executeSenCommand([
                '-method',
                'popcap.animation.encode',
                '-source',
                jsonPamPath,
                '-destination',
                destinationPath
            ],
            null,
            null,
            'Failed to convert json to pam!'
        );
    };
}