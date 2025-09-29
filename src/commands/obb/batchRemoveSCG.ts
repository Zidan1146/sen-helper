import { assert_if } from "@/error";
import { commandExecutor } from "@/functions/generic";
import { batchRemoveSCG } from "@/functions/obb";
import { isUrisEmpty } from "@/utils/extension";
import { showOpenDialog } from "@/utils/vscode";

export function execute() {
    return commandExecutor({
        functionHandler: batchRemoveSCG,
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

            assert_if(!isUrisEmpty(uris), "Input cannot be empty");
            batchRemoveSCG(uris![0]);
        },
        allowFile: true,
        allowFolder: false,
        fileFilter: {
            "Bundle folder": ['bundle']
        }
    });
}