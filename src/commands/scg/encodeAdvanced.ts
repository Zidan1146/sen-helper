import  * as vscode from 'vscode';
import { ScgOptions, ValidationPathType } from "@/types";
import { fileUtils, senUtils } from "@/utils";

export function execute(context: vscode.ExtensionContext) {
    return async (uri: vscode.Uri) => {
        const packagePath = await fileUtils.validatePath(uri, ValidationPathType.folder, ['.package'], {
            fileNotFound: 'Package not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .package'
        });
    
        if(!packagePath) {
            return;
        }
    
        const isSplitLabel = fileUtils.isEncodeWithSplitLabel(packagePath).toString();
        
        const fileDestination = packagePath.replace('.package', '.scg');
    
        await senUtils.runSenAndExecute('Pack SCG', [
            '-method',
            'pvz2.custom.scg.encode',
            '-source',
            packagePath,
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
    
        vscode.window.showInformationMessage('SCG encoded successfully!');
    };
}