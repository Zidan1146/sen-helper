export enum ValidationPathType {
    folder = 'folder',
    file = 'file',
    unknown = 'unknown'
}

export enum MessageOptions {
    Ok = 'Ok',
    Cancel = 'Cancel',
    Yes = 'Yes',
    No = 'No',
    Retry = 'Retry',
    Ignore =  'Ignore',
    Abort = 'Abort',
    OpenSettings = 'Open Settings',
    SelectPath = "Select Path"
}

export enum ScgOptions {
    Simple = "0n",
    Advanced = "1n"
}

export enum SplitResInfoOptions {
    Id = 'id',
    Path = 'path'
}

export enum textureCategory {
    Android = "0n",
    IOS = "1n",
    AndroidChina = "2n"
}

export enum ExpandMethod {
    advanced = 'advanced',
    simple = 'simple'
}

export enum AnimationResolution {
    High = "1536n",
    Medium = "768n",
    Low = "384n",
    AndroidChina = "1200",
    AndroidPvZFree = "640"
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

export type ConfigSCGForModding = "AlwaysAsk" | "AlwaysSplit" | "NeverSplit";
export type ConfigFlashToPAM = "Automatic" | "AlwaysAsk";
export type ConfigOBBFunction = "AlwaysAsk" | "AlwaysAndroid" | "AlwaysIOS" | "AlwaysAndroidChina";