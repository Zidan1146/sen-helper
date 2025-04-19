import { commandExecutor } from '@/functions/generic';
import { pamToJson } from '@/functions/animation';

export function execute() {
	return commandExecutor({
		functionHandler: pamToJson,
		fileFilter: {
			'PAM Files': ['pam']
		}
	});
}
