import { execute as rtonToJson } from '@/functions/json/rtonToJson';
import { commandExecutor } from '@/functions/generic';

export function execute() {
    return commandExecutor({
        functionHandler: rtonToJson,
        fileFilter: {
            'RTON Files': ['rton']
        }
    });
}