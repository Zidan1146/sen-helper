import { ExpandMethod, ResGroupType, textureCategory } from "./enums";


export interface DataJsonCategory {
    "resolution": number[],
    "format": number
}

export interface DataJsonSubGroup {
    [key: string]: DataJsonSubGroupData
}

export interface DataJsonSubGroupData {
    "category": DataJsonSubGroupDataCategory,
    "resource": DataJsonSubGroupDataResource
}

export interface DataJsonSubGroupDataCategory {
    "common_type": boolean,
    "locale": null,
    "compression": number
}

export interface DataJsonSubGroupDataResource {
    [key: string]: DataJsonSubGroupDataResourceData
}

export interface DataJsonSubGroupDataResourceDataAdditional {
    "x"?: number,
    "y"?: number
}

export interface DataJsonSubGroupDataResourceData {
    "type": ResGroupType,
    "path": string,
    "additional"?: DataJsonSubGroupDataResourceDataAdditional | null
}

export interface DataJson {
    "#split_label": boolean,
    "#expand_method": ExpandMethod,
    "version": string,
    "texture_format_category": number,
    "composite":  boolean,
    "category": DataJsonCategory | null,
    "resource": DataJsonSubGroup
}

export interface ProjectConfig {
    projectName:string,
    obbName: string,
    option: ProjectConfigOption
}

export interface ProjectConfigOption {
    textureCategory: textureCategory
}

// NOTE: future reference, might be removed
// export namespace ProjectConfig {
//     export interface Structure {
//         projectName: string,
//         obbName: string,
//         organizedWorkspace: boolean,
//         alwaysBackup: boolean,
//         backupExcludeList: number
//     }
// }