import { __assign, __read, __spread, __values } from "tslib";
import { hasEntity } from './hasEntity';
// @internal
export function addEntities(_a) {
    var e_1, _b;
    var state = _a.state, entities = _a.entities, idKey = _a.idKey, _c = _a.options, options = _c === void 0 ? {} : _c, preAddEntity = _a.preAddEntity;
    var newEntities = {};
    var newIds = [];
    var hasNewEntities = false;
    try {
        for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
            var entity = entities_1_1.value;
            if (hasEntity(state.entities, entity[idKey]) === false) {
                // evaluate the middleware first to support dynamic ids
                var current = preAddEntity(entity);
                var entityId = current[idKey];
                newEntities[entityId] = current;
                if (options.prepend)
                    newIds.unshift(entityId);
                else
                    newIds.push(entityId);
                hasNewEntities = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (entities_1_1 && !entities_1_1.done && (_b = entities_1.return)) _b.call(entities_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return hasNewEntities
        ? {
            newState: __assign(__assign({}, state), { entities: __assign(__assign({}, state.entities), newEntities), ids: options.prepend ? __spread(newIds, state.ids) : __spread(state.ids, newIds) }),
            newIds: newIds
        }
        : null;
}
//# sourceMappingURL=addEntities.js.map