import { commandExecutor } from '@/functions/generic';
import { rtonToJson } from '@/functions/json';

export function execute() {
    return commandExecutor({
        functionHandler: rtonToJson,
        fileFilter: {
            'RTON Files': ['rton']
        }
    });
}