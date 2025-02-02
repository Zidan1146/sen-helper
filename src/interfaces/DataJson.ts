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

export enum ResGroupType {
    File = 'File',
    Image = 'Image',
    PopAnim = 'PopAnim',
    Data = 'Data',
    SoundBank = 'SoundBank',
    DecodedSoundBank = 'DecodedSoundBank',
    Primefont = 'Primefont',
    RenderEffect = 'RenderEffect',
    ImageData = 'ImageData'
}

export interface DataJsonSubGroupDataResourceData {
    "type": ResGroupType,
    "path": string,
    "additional"?: DataJsonSubGroupDataResourceDataAdditional
}

export enum ExpandMethod {
    advanced = 'advanced',
    simple = 'simple'
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