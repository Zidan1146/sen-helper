import { runSenAndExecute } from "../utils/senUtils";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { isEncodeWithSplitLabel, PathType, validatePath, writeSplitLabelIntoJson } from "../utils/fileUtils";

export function getScgCommands(context: vscode.ExtensionContext) {
    const decodeScg = vscode.commands.registerCommand('sen-helper.scg.decode', async (uri: vscode.Uri) => {
        const scgPath = await validatePath(uri, PathType.file, ['.scg'], {
            fileNotFound: 'SCG not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .scg'
        });
    
        if(!scgPath) {
            return;
        }
    
        const isSplitLabel = await vscode.window.showQuickPick(['Yes', 'No'], {
            title: 'Split animation label?',
            placeHolder: 'Split animation label? (Default: Yes)'
        })
        .then((val) => !val ? 'Yes' : val)
        .then((val) => (val && val === 'Yes').toString());
    
        const fileDestination = scgPath.replace('.scg', '.package');
    
        await runSenAndExecute('Unpack SCG', [
            '-method',
            'pvz2.custom.scg.decode',
            '-source',
            scgPath,
            '-destination',
            fileDestination,
            '-generic',
            '1n',
            '-animation_split_label',
            isSplitLabel,
            '-enable_debug',
            'false'
        ]);
    
        if(!fs.existsSync(fileDestination)) {
            vscode.window.showErrorMessage('Failed to decode SCG!');
            return;
        }
    
        vscode.window.showInformationMessage('SCG decoded successfully!');
    
        const dataJsonPath = `${fileDestination}\\data.json`;
    
        if(!fs.existsSync(dataJsonPath)) {
            vscode.window.showErrorMessage(`${dataJsonPath} not found!`);
            return;
        }
    
        writeSplitLabelIntoJson(context, fileDestination, isSplitLabel === 'true');
    });
    
    const encodeScg = vscode.commands.registerCommand('sen-helper.scg.encode', async (uri: vscode.Uri) => {
        const packagePath = await validatePath(uri, PathType.folder, ['.package'], {
            fileNotFound: 'Package not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .package'
        });
    
        if(!packagePath) {
            return;
        }
    
        const isSplitLabel = isEncodeWithSplitLabel(context, packagePath).toString();
        
        const fileDestination = packagePath.replace('.package', '.scg');
    
        await runSenAndExecute('Pack SCG', [
            '-method',
            'pvz2.custom.scg.encode',
            '-source',
            packagePath,
            '-destination',
            fileDestination,
            '-generic',
            '1n',
            '-animation_split_label',
            isSplitLabel,
            '-enable_debug',
            'false'
        ]);
    
        vscode.window.showInformationMessage('SCG encoded successfully!');
    });

    return [
        decodeScg,
        encodeScg
    ];
}