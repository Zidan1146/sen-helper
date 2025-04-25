import { AtlasData, AtlasPacketDimension, DataJson, ResGroupType } from "@/types";
import { showQuickPick, showQuickPickItems } from "../vscode";
import { assert_if } from "@/error";

export async function getSelectedAtlas(dataJson:DataJson) {
    const atlases = getAtlases(dataJson);

    assert_if(
        atlases.length !== 0,
        "Atlases not found, abort operation"
    );

    const selection = await showQuickPick(atlases, {
        title: "Select atlas to split",
        placeHolder: "Select atlas to split"
    });

    return selection;
}

export function getFirstDimension(atlasData:AtlasData): AtlasPacketDimension {
    const packets = atlasData.packet;
    const firstPacket = Object.values(packets)[0];
    return firstPacket?.dimension;
}

function getAtlases(dataJson:DataJson):showQuickPickItems[] {
    const atlases:showQuickPickItems[] = [];
    for (const [subgroupKey, subgroupValue] of Object.entries(dataJson.subgroup)) {
        console.log(`Processing subgroup: ${subgroupKey}`);

        if ("resource" in subgroupValue) {
            for (const [resourceKey, resourceValue] of Object.entries(subgroupValue.resource)) {

                if (resourceValue.type === ResGroupType.ImageData) {
                    atlases.push({
                        label: subgroupKey,
                        description: resourceValue.path
                    });
                }
            }
        }
    }
    return atlases;
}