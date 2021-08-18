import { __values } from "tslib";
import { isUndefined } from './isUndefined';
import { isString } from './isString';
// @internal
export function findEntityByPredicate(predicate, entities) {
    var e_1, _a;
    try {
        for (var _b = __values(Object.keys(entities)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var entityId = _c.value;
            if (predicate(entities[entityId]) === true) {
                return entityId;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return undefined;
}
// @internal
export function getEntity(id, project) {
    return function (entities) {
        var entity = entities[id];
        if (isUndefined(entity)) {
            return undefined;
        }
        if (!project) {
            return entity;
        }
        if (isString(project)) {
            return entity[project];
        }
        return project(entity);
    };
}
//# sourceMappingURL=getEntity.js.map