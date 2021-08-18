import { __values } from "tslib";
// @internal
export function toEntitiesObject(entities, idKey, preAddEntity) {
    var e_1, _a;
    var acc = {
        entities: {},
        ids: []
    };
    try {
        for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
            var entity = entities_1_1.value;
            // evaluate the middleware first to support dynamic ids
            var current = preAddEntity(entity);
            acc.entities[current[idKey]] = current;
            acc.ids.push(current[idKey]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return acc;
}
//# sourceMappingURL=toEntitiesObject.js.map