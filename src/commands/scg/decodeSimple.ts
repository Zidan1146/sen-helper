import { ScgOptions, ValidationPathType } from '@/types';
import { senUtils } from '@/utils';
import { validatePath } from '@/utils/file';
import * as vscode from 'vscode';
import * as fs from 'fs';

export function execute(context: vscode.ExtensionContext) {
    return async (uri: vscode.Uri) => {
        const scgPath = await validatePath(uri, ValidationPathType.file, ['.scg'], {
            fileNotFound: 'SCG not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .scg'
        });

        if(!scgPath) {
            return;
        }

        const fileDestination = scgPath.replace('.scg', '.package');

        await senUtils.runSenAndExecute('Unpack SCG', [
            '-method',
            'pvz2.custom.scg.decode',
            '-source',
            scgPath,
            '-destination',
            fileDestination,
            '-generic',
            ScgOptions.Simple
        ])
        .catch((error) => {
            vscode.window.showErrorMessage(error);
        });

        if(!fs.existsSync(fileDestination)) {
            vscode.window.showErrorMessage('Failed to decode SCG!');
            return;
        }

        vscode.window.showInformationMessage('SCG decoded successfully!');
    };
}