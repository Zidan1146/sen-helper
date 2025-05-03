import fs from 'fs';
import { AssertionError } from './AssertationError';

export function assert_if(conditional: boolean, message: string): asserts conditional {
	if (!conditional) {
		const [_, call] = getCallsite();
		const file = call.getFileName();
		const lineno = call.getLineNumber();
		const line = fs.readFileSync(file!, 'utf8').split('\n')[lineno! - 1];
		const exprMatch = line.match(/assert_if\((.*)\)/);
		const expr = exprMatch?.[1];

		const error = new AssertionError(message);
		error.stack = error.stack?.substring(error.stack.indexOf('\n') + 1);
		console.error(`${message}\nExpression: ${expr ?? '<unavailable>'}\n${error.stack}`);
		throw error;
	}
}

function getCallsite(): NodeJS.CallSite[] {
	const orig = Error.prepareStackTrace;
	Error.prepareStackTrace = (_, stack) => stack;
	const err = new Error();
	Error.captureStackTrace(err, getCallsite);
	const stack = err.stack as unknown as NodeJS.CallSite[];
	Error.prepareStackTrace = orig;
	return stack;
}