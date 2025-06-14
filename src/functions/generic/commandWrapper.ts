import { assert_if } from '@/error';
import { showError, showOpenDialog } from '@/utils/vscode';
import vscode from 'vscode';


type FunctionHandler = (file: vscode.Uri) => Promise<void>;

interface CommandOptions {
    fileFilter?: Record<string, string[]>;
    functionHandler: FunctionHandler;
    allowFile?: boolean;
    allowFolder?: boolean;
    fileDialogLabel?: string;
    onError?: (error:unknown) => Promise<void>,
    handleSingleOverride?: () => Promise<void>;
    handleMultipleOverride?: () => Promise<void>;
}

export function commandExecutor(options: CommandOptions) {
    return async (uri?: vscode.Uri) => {
        try {
            await commandHandler(options, uri);
        } catch (error) {
            if(options.onError) {
                await options.onError(error);
                return;
            }
            if(error instanceof Error) {
                showError(error.message);
                return;
            }
            showError('Something went wrong.');
        }
    };
}

async function commandHandler(options: CommandOptions, uri?:vscode.Uri) {
    if(options.handleSingleOverride) {
        await options.handleSingleOverride();
        return;
    }

    if (uri) {
        await options.functionHandler(uri);
        return;
    }

    if(options.handleMultipleOverride) {
        await options.handleMultipleOverride();
        return;
    }

    const files = await showOpenDialog({
        canSelectMany: true,
        canSelectFiles: options.allowFile,
        canSelectFolders: options.allowFolder,
        openLabel: options.fileDialogLabel || "Select",
        filters: options.fileFilter
    });

    assert_if(
        !(!files || files.length === 0),
        "No files selected!"
    );

    for (const file of files) {
        await options.functionHandler(file);
    }
}