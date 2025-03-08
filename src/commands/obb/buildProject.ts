import { ProjectConfig, textureCategory, ValidationPathType } from '@/types';
import { fileUtils, senUtils } from '@/utils';
import * as path from 'path';
import * as vscode from 'vscode';
import { initializeProjectConfig, selectAndGetTextureCategory, selectObbBundleFolder } from '@/utils/project';

export function execute(context: vscode.ExtensionContext) {
    return async (uri:vscode.Uri) => {
        const allowedExtensions = ['.senproj', '.bundle'];

        const projectPath = uri ?
            await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions, {
                fileNotFound: 'Project not found!',
                invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions.join(', ')}`
            })
            : await fileUtils.validateWorkspacePath(allowedExtensions);

        if(!projectPath) {
            return;
        }
        
        let obbPath:string = projectPath;
        let textureCategoryOption:textureCategory;

        if(projectPath.endsWith('.senproj')) {
            const configFileName = "config.json";
            const configPath = path.join(projectPath, configFileName);

            const configData:ProjectConfig = fileUtils.readJson(configPath, false);

            if(!configData) {
                vscode.window.showInformationMessage("Configuration missing. Please choose an option.");
                const projectObbPath = await selectObbBundleFolder(projectPath);

                if(!projectObbPath) {
                    return;
                }

                obbPath = projectObbPath;

                const obbFile = projectObbPath.split('\\').at(-1)?.replace('.bundle', '');
                textureCategoryOption = await selectAndGetTextureCategory();

                const projectName = projectPath.split('\\').at(-1)?.replace('.senproj', '');
                initializeProjectConfig(context, projectName!, projectPath, obbFile!);
            } else {
                obbPath = path.join(projectPath, `${configData.obbName}.bundle`);
                textureCategoryOption = configData.option.textureCategory;
            }
        } else {
            textureCategoryOption = await selectAndGetTextureCategory();
        }

        const destinationPath = obbPath.replace('.bundle', '');

        await senUtils.executeSenCommand([
                '-method',
                'popcap.rsb.build_project',
                '-source',
                obbPath,
                '-destination',
                destinationPath,
                '-generic',
                textureCategoryOption
            ],
            null,
            `Project built successfully!\nLocated at ${destinationPath}`,
            'Failed to build project!'
        );
    };
}