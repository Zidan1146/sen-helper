import { getSenPath } from "@/utils/sen";
import vscode from 'vscode';

export function execute() {
    return async() => {
        const senPath = getSenPath();
        const terminals = vscode.window.terminals;
        let terminal;

        if(terminals.length > 0) {
            terminal = terminals[0];
        } else {
            terminal = vscode.window.createTerminal();
        }

        terminal.sendText(`start "${senPath}"`, true);
    };
}