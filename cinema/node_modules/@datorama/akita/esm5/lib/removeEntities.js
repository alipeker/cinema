import { __assign, __values } from "tslib";
import { isNil } from './isNil';
import { hasActiveState, isMultiActiveState, resolveActiveEntity } from './activeState';
// @internal
export function removeEntities(_a) {
    var e_1, _b;
    var state = _a.state, ids = _a.ids;
    if (isNil(ids))
        return removeAllEntities(state);
    var entities = state.entities;
    var newEntities = {};
    try {
        for (var _c = __values(state.ids), _d = _c.next(); !_d.done; _d = _c.next()) {
            var id = _d.value;
            if (ids.includes(id) === false) {
                newEntities[id] = entities[id];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var newState = __assign(__assign({}, state), { entities: newEntities, ids: state.ids.filter(function (current) { return ids.includes(current) === false; }) });
    if (hasActiveState(state)) {
        newState.active = resolveActiveEntity(newState);
    }
    return newState;
}
// @internal
export function removeAllEntities(state) {
    return __assign(__assign({}, state), { entities: {}, ids: [], active: isMultiActiveState(state.active) ? [] : null });
}
//# sourceMappingURL=removeEntities.js.map