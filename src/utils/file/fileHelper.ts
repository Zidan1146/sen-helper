import { unlink, mkdir, copyFile, rename, readFile, writeFile, stat } from 'node:fs';
import { promisify } from 'node:util';

const deleteFile = promisify(unlink);
const createDirectory = promisify(mkdir);
const copyFile2 = promisify(copyFile);
const rename2 = promisify(rename);
const readFile2 = promisify(readFile);
const writeFile2 = promisify(writeFile);
const stat2 = promisify(stat);

async function remove(path: string): Promise<void> {
	try {
		await deleteFile(path);
	} catch (_) {
		throw new ReferenceError(`File or directory not found: ${path}`);
	}
}

async function create_directory(path: string): Promise<void> {
	try {
		await createDirectory(path);
	} catch (_) {
		throw new Error(`Failed to create directory: ${path}`);
	}
}

async function copy_file(source: string, destination: string): Promise<void> {
	try {
		await copyFile2(source, destination);
	} catch (_) {
		throw new Error(`Failed to copy file: ${source} to ${destination}`);
	}
}

async function rename_link(source: string, destination: string): Promise<void> {
	try {
		await rename2(source, destination);
	} catch (_) {
		throw new Error(`Failed to rename: ${source} to ${destination}`);
	}
}

async function read_file(source: string): Promise<string> {
	try {
		const result = await readFile2(source, {
			encoding: 'utf-8',
		});
		return result;
	} catch (_) {
		throw new ReferenceError(`Failed to read file: ${source}`);
	}
}

async function write_file(source: string, value: string): Promise<void> {
	try {
		await writeFile2(source, value);
	} catch (_) {
		throw new ReferenceError(`Failed to write file: ${source}`);
	}
}

async function is_file(source: string): Promise<boolean> {
	return (await stat2(source)).isFile();
}

async function is_directory(source: string): Promise<boolean> {
	return (await stat2(source)).isDirectory();
}

export {
	remove,
	create_directory,
	copy_file,
	rename_link,
	read_file,
	write_file,
	is_file,
	is_directory,
};
