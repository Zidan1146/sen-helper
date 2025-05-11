import * as scg from './scg';
import * as obb from './obb';
import * as animation from './animation';
import * as json from './json';
import * as extension from './extension';

// Register commands here
export default {
    "sen-helper.scg.decodeAdvanced": scg.decodeAdvanced,
    "sen-helper.scg.encodeAdvanced": scg.encodeAdvanced,
    "sen-helper.scg.decodeSimple": scg.decodeSimple,
    "sen-helper.scg.encodeSimple": scg.encodeSimple,

    // TODO: Brainstorm ideas for Sen Project structure and automation
    // "sen-helper.obb.initProject": obb.initProject,
    // "sen-helper.obb.buildProject": obb.buildProject,
    "sen-helper.obb.unpackOBB": obb.unpackOBB,
    "sen-helper.obb.packOBB": obb.packOBB,

    "sen-helper.animation.pamToFlash": animation.pamToFlash,
    "sen-helper.animation.flashToPam": animation.flashToPam,
    "sen-helper.animation.pamToJson": animation.pamToJson,
    "sen-helper.animation.jsonToPam": animation.jsonToPam,

    "sen-helper.json.jsonToRton": json.jsonToRton,
    "sen-helper.json.rtonToJson": json.rtonToJson,

    "sen-helper.extension.senSenPath": extension.setSenPath,
    "sen-helper.extension.openGUI": extension.openGUI,
    "sen-helper.extension.openSenFolder": extension.openSenFolder,
};