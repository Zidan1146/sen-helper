import { RSBDataJson, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { isUrisEmpty } from '@/utils/extension';
import { readJson, writeJson } from '@/utils/file';
import { copyUris, getFileNames, showError, showInfo, showOpenDialog, uriOf } from '@/utils/vscode';
import path from 'path';
import * as vscode from 'vscode';

export async function execute(uri: vscode.Uri) {
  const allowedExtensions = /(\.(bundle))$/i;
  const bundlePath = await fileUtils.validatePath(uri, ValidationPathType.folder, allowedExtensions, "Please select \".bundle\" folders.");

  const scgs = await showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: true,
    filters: {
      "SCG File": ['scg']
    },
    title: "Select SCGs to add onto the bundle"
  });

  if(isUrisEmpty(scgs)) {
    return;
  }

  const success = await copyUris(scgs!, sourceUri => 
    vscode.Uri.joinPath(
      uriOf(bundlePath),
      "packet",
      sourceUri.path.split('/').pop() || ''
  ));

  if(!success) {
    showError("scg copy failed");
  }

  const rsbDataPath = path.join(bundlePath, "data.json");
  const rsbData = await readJson<RSBDataJson>(rsbDataPath);

  const combinedDataJson = rsbData.packet.concat(getFileNames(scgs!));
  rsbData.packet = [...new Set(combinedDataJson)];
  await writeJson<RSBDataJson>(rsbDataPath, rsbData);

  showInfo("SCG Batch add completed successfully");
}