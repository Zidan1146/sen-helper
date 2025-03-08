import { ScgOptions, ValidationPathType } from "@/types";
import { senUtils } from "@/utils";
import { validatePath, writeSplitLabelIntoJson } from "@/utils/file";
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { selectAndGetSplitLabel } from "@/utils/project";

export function execute(context: vscode.ExtensionContext) {
    return async (uri: vscode.Uri) => {
        const scgPath = await validatePath(uri, ValidationPathType.file, ['.scg'], {
            fileNotFound: 'SCG not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .scg'
        });

        if(!scgPath) {
            return;
        }

        const isSplitLabel = await selectAndGetSplitLabel();

        const fileDestination = scgPath.replace('.scg', '.package');

        await senUtils.executeSenCommand([
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
            ],
            () => {
                const dataJsonPath = path.join(fileDestination, 'data.json');

                if(!fs.existsSync(dataJsonPath)) {
                    vscode.window.showErrorMessage(`${dataJsonPath} not found!`);
                    return;
                }

                writeSplitLabelIntoJson(fileDestination, isSplitLabel === 'true');
            },
            'SCG decoded successfully!',
            'Failed to decode SCG!'
        );
    };
}