import { __assign, __read, __rest, __values } from "tslib";
import { isFunction } from './isFunction';
import { hasEntity } from './hasEntity';
import { isPlainObject } from './isPlainObject';
// @internal
export function updateEntities(_a) {
    var e_1, _b;
    var state = _a.state, ids = _a.ids, idKey = _a.idKey, newStateOrFn = _a.newStateOrFn, preUpdateEntity = _a.preUpdateEntity, producerFn = _a.producerFn, onEntityIdChanges = _a.onEntityIdChanges;
    var updatedEntities = {};
    var isUpdatingIdKey = false;
    var idToUpdate;
    try {
        for (var ids_1 = __values(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
            var id = ids_1_1.value;
            // if the entity doesn't exist don't do anything
            if (hasEntity(state.entities, id) === false) {
                continue;
            }
            var oldEntity = state.entities[id];
            var newState = void 0;
            if (isFunction(newStateOrFn)) {
                newState = isFunction(producerFn) ? producerFn(oldEntity, newStateOrFn) : newStateOrFn(oldEntity);
            }
            else {
                newState = newStateOrFn;
            }
            var isIdChanged = newState.hasOwnProperty(idKey) && newState[idKey] !== oldEntity[idKey];
            var newEntity = void 0;
            idToUpdate = id;
            if (isIdChanged) {
                isUpdatingIdKey = true;
                idToUpdate = newState[idKey];
            }
            var merged = __assign(__assign({}, oldEntity), newState);
            if (isPlainObject(oldEntity)) {
                newEntity = merged;
            }
            else {
                /**
                 * In case that new state is class of it's own, there's
                 * a possibility that it will be different than the old
                 * class.
                 * For example, Old state is an instance of animal class
                 * and new state is instance of person class.
                 * To avoid run over new person class with the old animal
                 * class we check if the new state is a class of it's own.
                 * If so, use it. Otherwise, use the old state class
                 */
                if (isPlainObject(newState)) {
                    newEntity = new oldEntity.constructor(merged);
                }
                else {
                    newEntity = new newState.constructor(merged);
                }
            }
            updatedEntities[idToUpdate] = preUpdateEntity(oldEntity, newEntity);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (ids_1_1 && !ids_1_1.done && (_b = ids_1.return)) _b.call(ids_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var updatedIds = state.ids;
    var stateEntities = state.entities;
    if (isUpdatingIdKey) {
        var _c = __read(ids, 1), id_1 = _c[0];
        var _d = state.entities, _e = id_1, deletedEntity = _d[_e], rest = __rest(_d, [typeof _e === "symbol" ? _e : _e + ""]);
        stateEntities = rest;
        updatedIds = state.ids.map(function (current) { return (current === id_1 ? idToUpdate : current); });
        onEntityIdChanges(id_1, idToUpdate);
    }
    return __assign(__assign({}, state), { entities: __assign(__assign({}, stateEntities), updatedEntities), ids: updatedIds });
}
//# sourceMappingURL=updateEntities.js.map