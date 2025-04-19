import { commandExecutor } from '@/functions/generic';
import { flashToPam } from '@/functions/animation';

export function execute() {
	return commandExecutor({
		functionHandler: flashToPam,
		allowFolder: true,
		allowFile: false,
		fileFilter: {
			"XFL Folders": ['xfl']
		}
	});
}
