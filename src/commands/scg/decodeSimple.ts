import { ValidationPathType } from '@/types';
import { validatePath } from '@/utils/file';
import * as vscode from 'vscode';

export function execute(context: vscode.ExtensionContext) {
    return async (uri: vscode.Uri) => {
        const scgPath = await validatePath(uri, ValidationPathType.file, ['.scg'], {
            fileNotFound: 'SCG not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .scg'
        });

        if(!scgPath) {
            return;
        }

        
    };
}