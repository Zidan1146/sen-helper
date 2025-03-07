export * from './MissingLibrary';
export * from './MissingDirectory';

export function assert_if(conditional: boolean, message: string): asserts conditional {
	if (!conditional) {
		let error = new Error(message);
		error.name = 'AssertError';
		throw error;
	}
}
