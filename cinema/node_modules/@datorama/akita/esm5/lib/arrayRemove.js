import { DEFAULT_ID_KEY } from './defaultIDKey';
import { coerceArray } from './coerceArray';
import { isObject } from './isObject';
import { isFunction } from './isFunction';
import { not } from './not';
/**
 * Remove item from collection
 *
 * @example
 *
 *
 * store.update(state => ({
 *   names: arrayRemove(state.names, ['one', 'second'])
 * }))
 */
export function arrayRemove(arr, identifier, idKey) {
    if (idKey === void 0) { idKey = DEFAULT_ID_KEY; }
    var identifiers;
    var filterFn;
    if (isFunction(identifier)) {
        filterFn = not(identifier);
    }
    else {
        identifiers = coerceArray(identifier);
        filterFn = function (current) {
            return identifiers.includes(isObject(current) ? current[idKey] : current) === false;
        };
    }
    if (Array.isArray(arr)) {
        return arr.filter(filterFn);
    }
}
//# sourceMappingURL=arrayRemove.js.map