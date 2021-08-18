import { isFunction } from './isFunction';
import { compareValues } from './sort';
import { coerceArray } from './coerceArray';
// @internal
export function entitiesToArray(state, options) {
    var arr = [];
    var ids = state.ids, entities = state.entities;
    var filterBy = options.filterBy, limitTo = options.limitTo, sortBy = options.sortBy, sortByOrder = options.sortByOrder;
    var _loop_1 = function (i) {
        var entity = entities[ids[i]];
        if (!filterBy) {
            arr.push(entity);
            return "continue";
        }
        var toArray = coerceArray(filterBy);
        var allPass = toArray.every(function (fn) { return fn(entity, i); });
        if (allPass) {
            arr.push(entity);
        }
    };
    for (var i = 0; i < ids.length; i++) {
        _loop_1(i);
    }
    if (sortBy) {
        var _sortBy_1 = isFunction(sortBy) ? sortBy : compareValues(sortBy, sortByOrder);
        arr = arr.sort(function (a, b) { return _sortBy_1(a, b, state); });
    }
    var length = Math.min(limitTo || arr.length, arr.length);
    return length === arr.length ? arr : arr.slice(0, length);
}
//# sourceMappingURL=entitiesToArray.js.map