import { commandExecutor } from '@/functions/generic';
import { decodeAdvanced } from '@/functions/scg';

export function execute() {
	return commandExecutor({
		functionHandler: decodeAdvanced,
		fileFilter: {
			'SCG Files': ['scg']
		}
	});
}
