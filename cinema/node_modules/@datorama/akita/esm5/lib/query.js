import { queryConfigKey } from './queryConfig';
import { isString } from './isString';
import { isFunction } from './isFunction';
import { isDev } from './env';
import { __queries__ } from './stores';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { compareKeys } from './compareKeys';
var Query = /** @class */ (function () {
    function Query(store) {
        this.store = store;
        this.__store__ = store;
        if (isDev()) {
            // @internal
            __queries__[store.storeName] = this;
        }
    }
    Query.prototype.select = function (project) {
        var mapFn;
        if (isFunction(project)) {
            mapFn = project;
        }
        else if (isString(project)) {
            mapFn = function (state) { return state[project]; };
        }
        else if (Array.isArray(project)) {
            return this.store
                ._select(function (state) { return state; })
                .pipe(distinctUntilChanged(compareKeys(project)), map(function (state) {
                if (isFunction(project[0])) {
                    return project.map(function (func) { return func(state); });
                }
                return project.reduce(function (acc, k) {
                    acc[k] = state[k];
                    return acc;
                }, {});
            }));
        }
        else {
            mapFn = function (state) { return state; };
        }
        return this.store._select(mapFn);
    };
    /**
     * Select the loading state
     *
     * @example
     *
     * this.query.selectLoading().subscribe(isLoading => {})
     */
    Query.prototype.selectLoading = function () {
        return this.select(function (state) { return state.loading; });
    };
    /**
     * Select the error state
     *
     * @example
     *
     * this.query.selectError().subscribe(error => {})
     */
    Query.prototype.selectError = function () {
        return this.select(function (state) { return state.error; });
    };
    /**
     * Get the store's value
     *
     * @example
     *
     * this.query.getValue()
     *
     */
    Query.prototype.getValue = function () {
        return this.store._value();
    };
    /**
     * Select the cache state
     *
     * @example
     *
     * this.query.selectHasCache().pipe(
     *   switchMap(hasCache => {
     *     return hasCache ? of() : http().pipe(res => store.set(res))
     *   })
     * )
     */
    Query.prototype.selectHasCache = function () {
        return this.store._cache().asObservable();
    };
    /**
     * Whether we've cached data
     *
     * @example
     *
     * this.query.getHasCache()
     *
     */
    Query.prototype.getHasCache = function () {
        return this.store._cache().value;
    };
    Object.defineProperty(Query.prototype, "config", {
        // @internal
        get: function () {
            return this.constructor[queryConfigKey];
        },
        enumerable: false,
        configurable: true
    });
    return Query;
}());
export { Query };
//# sourceMappingURL=query.js.map