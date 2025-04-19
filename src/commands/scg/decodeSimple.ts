import { commandExecutor } from '@/functions/generic';
import { decodeSimple } from '@/functions/scg';

export function execute() {
	return commandExecutor({
		functionHandler: decodeSimple,
		fileFilter: {
			'SCG Files': ['scg']
		}
	});
}
