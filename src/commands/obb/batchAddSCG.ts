import { commandExecutor } from "@/functions/generic";
import { batchAddSCG } from "@/functions/obb";
import { isUrisEmpty } from "@/utils/extension";
import { showOpenDialog } from "@/utils/vscode";

export function execute() {
    return commandExecutor({
        functionHandler: batchAddSCG,
        handleMultipleOverride: async () => {
            const uris = await showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                filters: {
                    "Bundle folder": ['bundle']
                },
                title: "Select base bundle (.bundle)"
            });
        
            if(isUrisEmpty(uris)) {
                return;
            }
            batchAddSCG(uris![0]);
        },

    });
}