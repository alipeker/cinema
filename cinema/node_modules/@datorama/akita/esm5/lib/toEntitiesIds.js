import { __values } from "tslib";
import { DEFAULT_ID_KEY } from './defaultIDKey';
// @internal
export function toEntitiesIds(entities, idKey) {
    var e_1, _a;
    if (idKey === void 0) { idKey = DEFAULT_ID_KEY; }
    var ids = [];
    try {
        for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
            var entity = entities_1_1.value;
            ids.push(entity[idKey]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return ids;
}
//# sourceMappingURL=toEntitiesIds.js.map