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
        
        const fileDestination = packagePath.replace('.package', '.scg');
    

        await senUtils.executeSenCommand([
                '-method',
                'pvz2.custom.scg.encode',
                '-source',
                packagePath,
                '-destination',
                fileDestination,
                '-generic',
                ScgOptions.Simple
            ],
            null,
            'SCG encoded successfully!',
            'Failed to decode SCG!'
        );
    };
}