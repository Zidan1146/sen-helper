import { commandExecutor } from '@/functions/generic';
import { jsonToPam } from '@/functions/animation';

export function execute() {
	return commandExecutor({
		functionHandler: jsonToPam,
		fileFilter: {
			'JSON Files': ['json']
		}
	});
}
