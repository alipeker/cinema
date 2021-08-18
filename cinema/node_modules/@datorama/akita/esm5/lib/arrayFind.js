import { __values } from "tslib";
import { distinctUntilChanged, map } from 'rxjs/operators';
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { isArray } from './isArray';
import { isEmpty } from './isEmpty';
import { isFunction } from './isFunction';
// @internal
export function find(collection, idsOrPredicate, idKey) {
    var e_1, _a, e_2, _b;
    var result = [];
    if (isFunction(idsOrPredicate)) {
        try {
            for (var collection_1 = __values(collection), collection_1_1 = collection_1.next(); !collection_1_1.done; collection_1_1 = collection_1.next()) {
                var entity = collection_1_1.value;
                if (idsOrPredicate(entity) === true) {
                    result.push(entity);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (collection_1_1 && !collection_1_1.done && (_a = collection_1.return)) _a.call(collection_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else {
        var toSet = coerceArray(idsOrPredicate).reduce(function (acc, current) { return acc.add(current); }, new Set());
        try {
            for (var collection_2 = __values(collection), collection_2_1 = collection_2.next(); !collection_2_1.done; collection_2_1 = collection_2.next()) {
                var entity = collection_2_1.value;
                if (toSet.has(entity[idKey])) {
                    result.push(entity);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (collection_2_1 && !collection_2_1.done && (_b = collection_2.return)) _b.call(collection_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    return result;
}
// @internal
export function distinctUntilArrayItemChanged() {
    return distinctUntilChanged(function (prevCollection, currentCollection) {
        if (prevCollection === currentCollection) {
            return true;
        }
        if (!isArray(prevCollection) || !isArray(currentCollection)) {
            return false;
        }
        if (isEmpty(prevCollection) && isEmpty(currentCollection)) {
            return true;
        }
        if (prevCollection.length !== currentCollection.length) {
            return false;
        }
        var isOneOfItemReferenceChanged = currentCollection.some(function (item, i) {
            return prevCollection[i] !== item;
        });
        // return false means there is a change and we want to call next()
        return isOneOfItemReferenceChanged === false;
    });
}
export function arrayFind(idsOrPredicate, idKey) {
    return function (source) {
        return source.pipe(map(function (collection) {
            // which means the user deleted the root entity or set the collection to nil
            if (isArray(collection) === false) {
                return collection;
            }
            return find(collection, idsOrPredicate, idKey || DEFAULT_ID_KEY);
        }), distinctUntilArrayItemChanged(), map(function (value) {
            if (isArray(value) === false) {
                return value;
            }
            if (isArray(idsOrPredicate) || isFunction(idsOrPredicate)) {
                return value;
            }
            return value[0];
        }));
    };
}
//# sourceMappingURL=arrayFind.js.map