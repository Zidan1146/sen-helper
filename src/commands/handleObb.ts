import * as vscode from 'vscode';
import { PathType, readJsonFromConfig, validatePath, writeJsonFromConfig } from '../utils/fileUtils';
import * as fs from 'fs';
import { runSenAndExecute } from '../utils/senUtils';

export function getObbCommands(context: vscode.ExtensionContext) {
    const androidInitProject = vscode.commands.registerCommand('sen-helper.android-obb.init-project', async (uri: vscode.Uri) => {
        const obbPath = await validatePath(uri, PathType.file, ['.obb'], {
            fileNotFound: 'OBB not found!',
            invalidFileType: 'Unsupported file type! Supported file type: .obb'
        });
    
        if(!obbPath) {
            return;
        }
        
        const projectName = await vscode.window.showInputBox({
            prompt: 'Project name',
            placeHolder: `Input your project name (insert '.' for current directory)`
        });
    
        let projectFullPath = obbPath;
        let projectPath = obbPath;
    
    
        if(projectName && projectName !== '.') {
            const pathParts = obbPath.split('\\');
        
            const obbFile = pathParts.pop();
    
            pathParts.push(`${projectName}.senproj`);
    
            if(!obbFile) {
                vscode.window.showErrorMessage('Failed to get OBB file name!');
                return;
            }
    
            projectPath = pathParts.join('\\');
            fs.mkdirSync(projectPath);

            const backupPath = `${projectPath}\\backup`;

            fs.mkdirSync(backupPath);

            const outputPath = `${projectPath}\\output`;

            fs.mkdirSync(outputPath);
            
            const configFileName = "android-obb.init-project.json";

            const configData = readJsonFromConfig(context, configFileName);

            if(!configData) {
                vscode.window.showErrorMessage(`Internal error! Missing file: ${configFileName} in config!`);
                return;
            }

            configData.projectName = projectName;
            configData.obbName = obbFile;

            const configPathClient = `${projectPath}\\${configFileName}`;

            writeJsonFromConfig(configPathClient, configData);
    
            if(!fs.existsSync(projectPath)) {
                vscode.window.showErrorMessage('Failed to create project folder!');
                return;
            }
    
            projectFullPath = `${projectPath}\\${obbFile}`;
        }
    
        const destinationPath = `${projectFullPath}.bundle`;
    
        await runSenAndExecute('Sen: Init Project', [
            '-method',
            'popcap.rsb.init_project',
            '-source',
            obbPath,
            '-destination',
            destinationPath,
            '-generic',
            '0n'
        ]);
    
        if(!fs.existsSync(destinationPath)) {
            vscode.window.showErrorMessage('Failed to Initialize project!');
            return;
        }
        
        await vscode.window.showInformationMessage(
            'Initialized project successfully! Open the resulting folder?',
        
            'Yes',
            'No'
        ).then((val) => {
            if(val === 'Yes') {
                vscode.commands.executeCommand(
                    'vscode.openFolder', 
                    vscode.Uri.file(projectPath), 
                    {
                        forceReuseWindow: true
                    }
                );
            }
        });
    });

    return [
        androidInitProject
    ];
}