import { commandExecutor } from "@/functions/generic";
import { unpackOBB } from "@/functions/obb";

export function execute() {
    return commandExecutor({
        functionHandler: unpackOBB,
        fileFilter: {
            "OBB/RSB Files": ['obb', 'rsb']
        }
    });
}