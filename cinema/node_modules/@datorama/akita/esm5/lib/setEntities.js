import { __assign, __values } from "tslib";
import { toEntitiesObject } from './toEntitiesObject';
import { isArray } from './isArray';
import { hasActiveState, resolveActiveEntity } from './activeState';
// @internal
export function isEntityState(state) {
    return state.entities && state.ids;
}
// @internal
function applyMiddleware(entities, preAddEntity) {
    var e_1, _a;
    var mapped = {};
    try {
        for (var _b = __values(Object.keys(entities)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var id = _c.value;
            mapped[id] = preAddEntity(entities[id]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return mapped;
}
// @internal
export function setEntities(_a) {
    var state = _a.state, entities = _a.entities, idKey = _a.idKey, preAddEntity = _a.preAddEntity, isNativePreAdd = _a.isNativePreAdd;
    var newEntities;
    var newIds;
    if (isArray(entities)) {
        var resolve = toEntitiesObject(entities, idKey, preAddEntity);
        newEntities = resolve.entities;
        newIds = resolve.ids;
    }
    else if (isEntityState(entities)) {
        newEntities = isNativePreAdd ? entities.entities : applyMiddleware(entities.entities, preAddEntity);
        newIds = entities.ids;
    }
    else {
        // it's an object
        newEntities = isNativePreAdd ? entities : applyMiddleware(entities, preAddEntity);
        newIds = Object.keys(newEntities).map(function (id) { return (isNaN(id) ? id : Number(id)); });
    }
    var newState = __assign(__assign({}, state), { entities: newEntities, ids: newIds, loading: false });
    if (hasActiveState(state)) {
        newState.active = resolveActiveEntity(newState);
    }
    return newState;
}
//# sourceMappingURL=setEntities.js.map