import { jsonToRton } from '@/functions/json';
import { commandExecutor } from '@/functions/generic/commandWrapper';

export function execute() {
    return commandExecutor({
        functionHandler: jsonToRton,
        fileFilter: {
            'JSON Files': ['json']
        }
    });
}