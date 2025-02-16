import { MessageOptions, ScgOptions, ValidationPathType } from "@/types";
import { senUtils } from "@/utils";
import { validatePath, writeSplitLabelIntoJson } from "@/utils/file";
import * as vscode from 'vscode';
import * as path from 'path';
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

        const isSplitLabel = await vscode.window.showQuickPick([
            MessageOptions.Yes,
            MessageOptions.No
        ], {
            title: 'Split animation label?',
            placeHolder: 'Split animation label? (Default: Yes)'
        })
        .then((val) => !val ? MessageOptions.Yes : val)
        .then((val) => (val && val === MessageOptions.Yes).toString());

        const fileDestination = scgPath.replace('.scg', '.package');

        await senUtils.runSenAndExecute('Unpack SCG', [
            '-method',
            'pvz2.custom.scg.decode',
            '-source',
            scgPath,
            '-destination',
            fileDestination,
            '-generic',
            ScgOptions.Advanced,
            '-animation_split_label',
            isSplitLabel
        ])
        .catch((error) => {
            vscode.window.showErrorMessage(error);
        });

        if(!fs.existsSync(fileDestination)) {
            vscode.window.showErrorMessage('Failed to decode SCG!');
            return;
        }

        vscode.window.showInformationMessage('SCG decoded successfully!');

        const dataJsonPath = path.join(fileDestination, 'data.json');

        if(!fs.existsSync(dataJsonPath)) {
            vscode.window.showErrorMessage(`${dataJsonPath} not found!`);
            return;
        }

        writeSplitLabelIntoJson(context, fileDestination, isSplitLabel === 'true');
    };
}