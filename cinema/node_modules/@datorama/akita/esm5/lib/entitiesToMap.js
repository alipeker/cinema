import { isNil } from './isNil';
import { coerceArray } from './coerceArray';
// @internal
export function entitiesToMap(state, options) {
    var map = {};
    var filterBy = options.filterBy, limitTo = options.limitTo;
    var ids = state.ids, entities = state.entities;
    if (!filterBy && !limitTo) {
        return entities;
    }
    var hasLimit = isNil(limitTo) === false;
    if (filterBy && hasLimit) {
        var count = 0;
        var _loop_1 = function (i, length_1) {
            if (count === limitTo)
                return "break";
            var id = ids[i];
            var entity = entities[id];
            var allPass = coerceArray(filterBy).every(function (fn) { return fn(entity, i); });
            if (allPass) {
                map[id] = entity;
                count++;
            }
        };
        for (var i = 0, length_1 = ids.length; i < length_1; i++) {
            var state_1 = _loop_1(i, length_1);
            if (state_1 === "break")
                break;
        }
    }
    else {
        var finalLength = Math.min(limitTo || ids.length, ids.length);
        var _loop_2 = function (i) {
            var id = ids[i];
            var entity = entities[id];
            if (!filterBy) {
                map[id] = entity;
                return "continue";
            }
            var allPass = coerceArray(filterBy).every(function (fn) { return fn(entity, i); });
            if (allPass) {
                map[id] = entity;
            }
        };
        for (var i = 0; i < finalLength; i++) {
            _loop_2(i);
        }
    }
    return map;
}
//# sourceMappingURL=entitiesToMap.js.map