import * as scg from './scg';
import * as sen from './sen';
import * as obb from './obb';

export default {
    "sen-helper.scg.decodeAdvanced": scg.decodeAdvanced,
    "sen-helper.scg.encodeAdvanced": scg.encodeAdvanced,
    "sen-helper.scg.decodeSimple": scg.decodeSimple,
    "sen-helper.scg.encodeSimple": scg.encodeSimple,

    "sen-helper.sen.openGUI": sen.openGUI,

    "sen-helper.obb.initProject": obb.initProject,
    "sen-helper.obb.buildProject": obb.buildProject
};