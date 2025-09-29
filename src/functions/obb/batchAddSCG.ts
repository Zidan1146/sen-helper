import { assert_if } from '@/error';
import { DataJson, RSBDataJson, ValidationPathType } from '@/types';
import { fileUtils } from '@/utils';
import { isUrisEmpty } from '@/utils/extension';
import { readJson, writeJson } from '@/utils/file';
import { copyUris, deleteFile, getFileNames, showError, showInfo, showOpenDialog, showWarning, uriOf } from '@/utils/vscode';
import path from 'path';
import * as vscode from 'vscode';
import { internalDecodeAdvanced, internalEncodeAdvanced } from '../scg';
import { existsSync } from 'fs';

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

  assert_if(!isUrisEmpty(scgs), "Input Cannot be empty");

  const success = await copyUris(scgs!, sourceUri =>
    vscode.Uri.joinPath(
      uriOf(bundlePath),
      "packet",
      sourceUri.path.split('/').pop() || ''
    ));

  if (!success) {
    showError("scg copy failed");
    return;
  }

  await convertToInternational(scgs!, bundlePath, false);

  const rsbDataPath = path.join(bundlePath, "data.json");
  const rsbData = await readJson<RSBDataJson>(rsbDataPath);

  const combinedDataJson = rsbData.packet.concat(getFileNames(scgs!));
  rsbData.packet = [...new Set(combinedDataJson)];
  await writeJson<RSBDataJson>(rsbDataPath, rsbData);

  showInfo("SCG Batch add completed successfully");
}

async function convertToInternational(scgs: vscode.Uri[], bundlePath: string, silent: boolean = true) {
  for (const scg of scgs) {
    const sourcePath = path.join(bundlePath, "packet", scg.path.split('/').pop() || '');
    if (!existsSync(sourcePath)) {
      if (!silent) {
        showWarning(`${sourcePath} missing, did you accidentally delete it?`);
      }
      continue;
    }

    await internalDecodeAdvanced({
      source: sourcePath,
      isSplitLabel: 'true',
      silent: true
    });

    const packagePath = sourcePath.replace(/(\.scg)?$/i, '.package');
    const dataJsonPath = path.join(packagePath, 'data.json');

    const dataJson = await readJson<DataJson>(dataJsonPath);

    dataJson.texture_format_category = 0;
    if (dataJson.composite && dataJson.category !== null) {
      dataJson.category.format = 0;
    }

    for (const [_, value] of Object.entries(dataJson.subgroup)) {
      value.category.compression = 3;
    }
    await writeJson(dataJsonPath, dataJson);

    await internalEncodeAdvanced({
      source: packagePath,
      isSplitLabel: 'true',
      silent: true
    });

    await deleteFile(uriOf(packagePath), { recursive: true, useTrash: true });
  }
}