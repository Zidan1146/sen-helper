import { commandExecutor } from '@/functions/generic';
import { encodeAdvanced } from '@/functions/scg';

export function execute() {
	return commandExecutor({
		functionHandler: encodeAdvanced,
		allowFolder: true,
		allowFile: false,
		fileFilter: {
			"Package Folders": ['package']
		}
	});
}
