import { __read, __spread } from "tslib";
/**
 * Create an array value comparator for a specific key of the value.
 * @param prop The property of the value to be compared.
 */
export function byKey(prop) {
    return function (a, b) { return a[prop] === b[prop]; };
}
/**
 * Create an array value comparator for the id field of an array value.
 */
export function byId() {
    return byKey('id');
}
/**
 * Adds or removes a value from an array by comparing its values. If a matching value exists it is removed, otherwise
 * it is added to the array.
 *
 * @param array The array to modify.
 * @param newValue The new value to toggle.
 * @param compare A compare function to determine equality of array values. Default is an equality test by object identity.
 */
export function arrayToggle(array, newValue, compare) {
    if (compare === void 0) { compare = function (a, b) { return a === b; }; }
    var index = array.findIndex(function (oldValue) { return compare(newValue, oldValue); });
    return !!~index ? __spread(array.slice(0, index), array.slice(index + 1)) : __spread(array, [newValue]);
}
//# sourceMappingURL=arrayToggle.js.map