import callsite from 'callsite';
import fs from 'fs';
import { AssertionError } from './AssertationError';

export function assert_if(conditional: boolean, message: string): asserts conditional {
	if (!conditional) {
		let stack = callsite();
		let call = stack[1];
		let file = call.getFileName();
		let lineno = call.getLineNumber();
		let error = new AssertionError('');
		let src = fs.readFileSync(file, 'utf8');
		let line = src.split('\n')[lineno - 1];
		src = line.match(/assert_if\((.*)\)/)![1];
		error.message = `${message}\n, Expression: ${src}`;
		error.stack = error.stack?.substring(error.stack.indexOf('\n') + 1);
		throw error;
	}
}
