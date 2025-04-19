import { commandExecutor } from '@/functions/generic';
import { pamToFlash } from '@/functions/animation';

export function execute() {
	return commandExecutor({
		functionHandler: pamToFlash,
		fileFilter: {
			"PAM Files": ['pam']
		}
	});
}
