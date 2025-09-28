import { RSBDataJson, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import * as fs from "fs";
import { deleteFile, showMessage, showOpenDialog, showWarning, uriOf } from '@/utils/vscode';
import path from 'path';
import * as vscode from 'vscode';
import { isUrisEmpty } from '@/utils/extension';
import { checkSelectionInFolder, getFileNameWithoutExt, readJson, writeJson } from '@/utils/file';
import { assert_if } from '@/error';
import { filterEntries } from '@/utils/string';

export async function execute(uri: vscode.Uri) {
    const allowedExtensions = /(\.(bundle))$/i;
    const bundlePath = await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions, "Please select \".bundle\" folders.");

    const defaultPath = path.join(bundlePath, "packet");
    assert_if(fs.existsSync(defaultPath), "invalid bundle, packet folder is missing, did you rename or delete it by accident?");
    const scgs = await showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: true,
        filters: {
            "SCG File": ['scg']
        },
        title: "Select SCGs to remove from the bundle",
        defaultUri: uriOf(bundlePath)
    });

    assert_if(!isUrisEmpty(scgs), "Input Cannot be empty");

    const checkResult = await checkSelectionInFolder(scgs!, defaultPath);

    deleteValidScgs(bundlePath, checkResult.valid);
    showMessage("Batch remove completed", 'info');
}

async function deleteValidScgs(bundlePath: string, scgs: vscode.Uri[]) {
    const rsbDataPath = path.join(bundlePath, "data.json");
    const rsbData = await readJson<RSBDataJson>(rsbDataPath);
    const resgroupToDelete: string[] = [];

    for (const scg of scgs) {
        const ok = await deleteFile(scg, { useTrash: true });
        if (ok) {
            const resgroup = getFileNameWithoutExt(scg);
            resgroupToDelete.push(resgroup);
            showMessage(`Removing ${resgroup}...`, 'info');
        }
    }

    rsbData.packet = unregisterScgGroups(rsbData, resgroupToDelete);
    await writeJson<RSBDataJson>(rsbDataPath, rsbData);
}

function unregisterScgGroups(rsbData: RSBDataJson, resgroupToDelete: string[]) {
    return filterEntries(rsbData.packet, resgroupToDelete, true);
}