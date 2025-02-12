import * as vscode from 'vscode';
import { PathType, readJson, readJsonFromConfig, validatePath, validateWorkspacePath, writeJsonFromConfig } from '../utils/fileUtils';
import * as fs from 'fs';
import { runSenAndExecute } from '../utils/senUtils';
import path from 'path';
import { ProjectConfig } from '../interfaces/ProjectConfig';

enum ActionOption {
    YES = "yes",
    NO = "no"
}

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

            const backupPath = path.join(projectPath, 'backup');


            fs.mkdirSync(backupPath);

            const outputPath = path.join(projectPath, 'output');

            fs.mkdirSync(outputPath);
            
            const configFileName = "android-obb.init-project.json";

            const configData = readJsonFromConfig(context, configFileName);

            if(!configData) {
                vscode.window.showErrorMessage(`Internal error! Missing file: ${configFileName} in config!`);
                return;
            }

            configData.projectName = projectName;
            configData.obbName = obbFile;

            const configPathClient = path.join(projectPath, "config.json");


            writeJsonFromConfig(configPathClient, configData);
    
            if(!fs.existsSync(projectPath)) {
                vscode.window.showErrorMessage('Failed to create project folder!');
                return;
            }
    
            projectFullPath = path.join(projectPath, obbFile);
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
        
            ActionOption.YES.toString(),
            ActionOption.NO.toString()
        ).then((val) => {
            if(val === ActionOption.YES.toString()) {
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

    const androidBuildProject = vscode.commands.registerCommand('sen-helper.android-obb.build-project', async (uri: vscode.Uri) => {
        const allowedExtensions = ['.senproj', '.bundle'];

        const projectPath = uri ?
            await validatePath(uri, PathType.folder, allowedExtensions, {
                fileNotFound: 'Project not found!',
                invalidFileType: `Unsupported file type! Supported file type: ${allowedExtensions.join(', ')}`
            })
            : await validateWorkspacePath(allowedExtensions);

        if(!projectPath) {
            return;
        }

        const configFileName = "config.json";
        const configPath = path.join(projectPath, configFileName);

        const configData:ProjectConfig = readJson(configPath, false);

        if(!configData) {
            vscode.window.showInformationMessage(`Missing config file, proceeds to pack the project without backup.`);
        }

        let obbPath = projectPath;

        const isBackupEnabled = configData && fs.existsSync(path.join(projectPath, `${configData.obbName}.bundle`)) && configData.backupObb;
        let isBackupCompleted =  false;

        if(isBackupEnabled) {
            obbPath = path.join(projectPath, `${configData.obbName}.bundle`);
            
            isBackupCompleted = createBackup(configData, projectPath);
        }

        const destinationPath = obbPath.replace('.bundle', '');

        // TODO: deprecate obb backup, we're moving to .scg backup
        // TODO: use xxhash for faster workspace scan
        // TODO: pack everything inside output folder and put it inside packets folder

        await runSenAndExecute('Sen: Build Project', [
            '-method',
            'popcap.rsb.build_project',
            '-source',
            obbPath,
            '-destination',
            destinationPath,
            '-generic',
            '0n'
        ]);

        if(!fs.existsSync(destinationPath)) {
            vscode.window.showErrorMessage('Failed to build project!');
            return;
        }

        if(isBackupEnabled && !isBackupCompleted) {
            createBackup(configData, projectPath);
        }

        vscode.window.showInformationMessage(`Project built successfully!\nLocated at ${destinationPath}`);

        if(isBackupCompleted) {
            vscode.window.showInformationMessage('OBB backup completed successfully!');
        }
    });

    return [
        androidInitProject,
        androidBuildProject
    ];
}

function createBackup(config:ProjectConfig, projectPath:string) {
    const backupPath = path.join(projectPath, 'backup');
    if(!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }

    const obbPath = path.join(projectPath, config.obbName);

    if(!fs.existsSync(obbPath)) {
        return false;
    }

    const now = new Date();

    const formattedDate = `${now.getFullYear()}_${(now.getMonth() + 1)
        .toString().padStart(2, '0')}_${now.getDate().toString().padStart(2, '0')}_${now.getTime()}`;

    const datePath = path.join(backupPath, formattedDate);

    if(!fs.existsSync(datePath)) {
        fs.mkdirSync(datePath);
    }

    const backupDestinationPath = path.join(datePath, config.obbName);

    fs.copyFileSync(obbPath, backupDestinationPath);
    return true;
}