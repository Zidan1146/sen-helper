import { showInfo, showOpenDialog, updateConfiguration } from "@/utils/vscode";
import { ConfigurationTarget } from "vscode";

export function execute() {
    return async () => {
        await showOpenDialog({
            title: "Select sen directory",
            canSelectMany: false,
            canSelectFiles: false,
            canSelectFolders: true
        })
        .then((value) => {
            if(!value) {
                showInfo('Directory selection cancelled.');
                return;
            }
            updateConfiguration<string>('senPath', value[0].fsPath, ConfigurationTarget.Global);
        });
    };
}