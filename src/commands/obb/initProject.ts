import { MissingDirectory, MissingLibrary } from '@/error';
import { MessageOptions, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { initializeProjectConfig, selectAndGetTextureCategory } from '@/utils/project';
import { executeSenCommand, runSenAndExecute } from '@/utils/sen';
import * as fs from 'fs';
import * as vscode from 'vscode';

export function execute(context: vscode.ExtensionContext) {
    return async (uri: vscode.Uri) => {
        const obbPath = await fileUtils.validatePath(uri, ValidationPathType.file, ['.obb'], {
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

        const textureCategoryOption = await selectAndGetTextureCategory();

        const isProjectNameNotEmpty = projectName && projectName !== '.';

        if(isProjectNameNotEmpty) {
            // Create {ProjectName}.senproj folder for better organization
            const pathParts = obbPath.split('\\');
            const obbFile = pathParts.pop();

            if(!obbFile) {
                vscode.window.showErrorMessage(`Input OBB doesn't exists!`);
                return;
            }
            pathParts.push(`${projectName}.senproj`);

            projectPath = pathParts.join('\\');
            fs.mkdirSync(projectPath);

            initializeProjectConfig(context, projectName, projectPath, obbFile);

            pathParts.push(`${obbFile}.bundle`);

            projectFullPath = pathParts.join('\\');
        }

        await executeSenCommand([
                '-method',
                'popcap.rsb.init_project',
                '-source',
                obbPath,
                '-destination',
                projectFullPath,
                '-generic',
                textureCategoryOption
            ],
            async () => {
                if(isProjectNameNotEmpty && !fs.existsSync(projectFullPath)) {
                    fs.rm(
                        projectFullPath, 
                        {
                            recursive: true,
                            force: true
                        },
                        () => null
                    );
                }
                
                await vscode.window.showInformationMessage(
                    'Initialized project successfully! Open the resulting folder?',
                
                    MessageOptions.Yes.toString(),
                    MessageOptions.No.toString()
                ).then((val) => {
                    if(val === MessageOptions.Yes.toString()) {
                        vscode.commands.executeCommand(
                            'vscode.openFolder', 
                            vscode.Uri.file(projectPath), 
                            {
                                forceReuseWindow: true
                            }
                        );
                    }
                });
            },
            null,
            'Failed to init project!'
        );
    };
}