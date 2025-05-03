import * as vscode from 'vscode';
import { getLauncherLibraries, getLauncherPath, getSenGuiPath } from './senPaths';
import { spawn } from 'node:child_process';
import { showError, showInfo } from '../vscode';
import { loggerUtils } from '..';
import { assert_if } from '@/error';

export async function runSenAndExecute(args: string[]): Promise<void> {
	return vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Running command...',
			cancellable: true,
		},
		async (_, token) => {
			return new Promise(async (resolve, reject) => {
				const launcherPath = getLauncherPath();

				if (!launcherPath) {
					reject(new ReferenceError('Launcher path is not valid'));
				}

				const launcherLibraries: string[] | null = await getLauncherLibraries();

				if (!launcherLibraries) {
					reject(new ReferenceError('Launcher libraries are not valid!'));
				}

				const libraryArgument = [...(<string[]>launcherLibraries)];

				const childArgs = [...libraryArgument, ...args];

				const child = spawn(launcherPath!, childArgs);
				let hasError = false;
				let errorMessage: string;
				let errorStackTrace: string;

				child.stdout.on('data', (data) => {
					loggerUtils.log.info(`Output: ${data.toString()}`);

					const messages: string[] = data
						.toString()
						.split('●')
						.map((msg: string) => msg.trim())
						.filter((msg: string) => msg);

					messages.forEach((message) => {
						if (message.includes('Error')) {
							errorMessage = message;
							hasError = true;
						}
						if (/^Stack for traceback error/i.test(message)) {
							errorStackTrace = message;
							hasError = true;
						}
					});
				});

				child.stderr.on('data', (data) => {
					loggerUtils.log.error(`Error Output: ${data.toString()}`);
				});

				child.on('close', (code) => {
					if (code === 0 && !hasError) {
						showInfo('Command completed successfully');
						resolve();
					} else if (hasError) {
						showError(errorMessage);
						showError('Command reported success but errors were found!');
						reject(new Error(errorStackTrace));
					} else {
						showError(`Command failed with code ${code}`);
						reject(new Error(`Command exited with code ${code}`));
					}
				});

				child.on('error', (err) => {
					showError(`Failed to run command: ${err.message}`);
					reject(err);
				});

				token.onCancellationRequested(() => {
					showInfo('Cancelling process...');
					child.kill('SIGTERM');
					reject(new vscode.CancellationError());
				});
			});
		},
	);
}

export function openSenGui() {
	const senGuiPath = getSenGuiPath();

	assert_if(!!senGuiPath, 'Sen GUI not found!');
	spawn(senGuiPath);
}