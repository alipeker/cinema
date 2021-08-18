import { __assign } from "tslib";
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { isFunction } from './isFunction';
import { isObject } from './isObject';
/**
 * Update item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpdate(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export function arrayUpdate(arr, predicateOrIds, obj, idKey) {
    if (idKey === void 0) { idKey = DEFAULT_ID_KEY; }
    var condition;
    if (isFunction(predicateOrIds)) {
        condition = predicateOrIds;
    }
    else {
        var ids_1 = coerceArray(predicateOrIds);
        condition = function (item) { return ids_1.includes(isObject(item) ? item[idKey] : item) === true; };
    }
    var updateFn = function (state) {
        return state.map(function (entity, index) {
            if (condition(entity, index) === true) {
                return isObject(entity)
                    ? __assign(__assign({}, entity), obj) : obj;
            }
            return entity;
        });
    };
    return updateFn(arr);
}
//# sourceMappingURL=arrayUpdate.js.map