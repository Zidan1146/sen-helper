import { commandExecutor } from '@/functions/generic';
import { encodeSimple } from '@/functions/scg';

export function execute() {
	return commandExecutor({
		functionHandler: encodeSimple,
		allowFile: false,
		allowFolder: true,
		fileFilter: {
			'Package Folders': ['package']
		}
	});
}
