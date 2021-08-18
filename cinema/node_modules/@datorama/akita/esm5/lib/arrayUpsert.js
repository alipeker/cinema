import { __assign } from "tslib";
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { arrayAdd } from './arrayAdd';
import { arrayUpdate } from './arrayUpdate';
import { isObject } from './isObject';
/**
 * Upsert item in a collection
 *
 * @example
 *
 *
 * store.update(1, entity => ({
 *   comments: arrayUpsert(entity.comments, 1, { name: 'newComment' })
 * }))
 */
export function arrayUpsert(arr, id, obj, idKey) {
    var _a;
    if (idKey === void 0) { idKey = DEFAULT_ID_KEY; }
    var entityIsObject = isObject(obj);
    var entityExists = arr.some(function (entity) { return (entityIsObject ? entity[idKey] === id : entity === id); });
    if (entityExists) {
        return arrayUpdate(arr, id, obj, idKey);
    }
    else {
        return arrayAdd(arr, entityIsObject ? __assign(__assign({}, obj), (_a = {}, _a[idKey] = id, _a)) : obj);
    }
}
//# sourceMappingURL=arrayUpsert.js.map