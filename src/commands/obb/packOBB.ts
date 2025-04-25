import { commandExecutor } from "@/functions/generic";
import { packOBB } from "@/functions/obb";

export function execute() {
    return commandExecutor({
        functionHandler: packOBB,
        allowFolder: true,
        allowFile: false,
        fileFilter: {
            "Bundle Folders": ['bundle']
        }
    });
}