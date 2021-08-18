import { __read, __spread } from "tslib";
import { coerceArray } from './coerceArray';
/**
 * Add item to a collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   comments: arrayAdd(state.comments, { id: 2 })
 * }))
 *
 */
export function arrayAdd(arr, newEntity, options) {
    if (options === void 0) { options = {}; }
    var newEntities = coerceArray(newEntity);
    var toArr = arr || [];
    return options.prepend ? __spread(newEntities, toArr) : __spread(toArr, newEntities);
}
//# sourceMappingURL=arrayAdd.js.map