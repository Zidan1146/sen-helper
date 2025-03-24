import * as vscode from 'vscode';
import { getLauncherLibraries, getLauncherPath, getSenGuiPath } from './senPaths';
import { spawn } from 'node:child_process';
import { showError, showInfo } from '../vscode';
import { loggerUtils } from '..';

export async function runSenAndExecute(args: string[]): Promise<void> {
	return vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.Notification,
			title: 'Running command...',
			cancellable: true,
		},
		async (_, token) => {
			return new Promise((resolve, reject) => {
				const launcherPath = getLauncherPath();

				if (!launcherPath) {
					reject(new ReferenceError('Launcher path is not valid'));
				}

				const launcherLibraries: string[] | null = getLauncherLibraries();

				if (!launcherLibraries) {
					reject(new ReferenceError('Launcher libraries are not valid!'));
				}

				const libraryArgument = [...<string[]>launcherLibraries];

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

export async function openSenGui(): Promise<void> {
	return new Promise(async (resolve, reject) => {
		const terminals = vscode.window.terminals;
		loggerUtils.log.info('calling terminals');
		let terminal = vscode.window.createTerminal();

		if (terminals.length > 0) {
			terminal = terminals[0];
		}
		loggerUtils.log.info('testing sen gui path');

		const senGuiPath = getSenGuiPath();

		if (!senGuiPath) {
			showError('Sen GUI not found!');
			reject();
			return;
		}
		loggerUtils.log.info('sending to sen gui');

		terminal.sendText(senGuiPath, true);

		const interval = setInterval(() => {
			if (terminal.exitStatus) {
				terminal.dispose();
				clearInterval(interval);
				resolve();
			}
		}, 1000);
	});
}
