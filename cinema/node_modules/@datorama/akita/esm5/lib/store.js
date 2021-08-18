import { __assign } from "tslib";
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { currentAction, resetCustomAction, setAction } from './actions';
import { getAkitaConfig, getGlobalProducerFn } from './config';
import { deepFreeze } from './deepFreeze';
import { dispatchAdded, dispatchDeleted, dispatchUpdate } from './dispatchers';
import { isDev, __DEV__ } from './env';
import { assertStoreHasName } from './errors';
import { isDefined } from './isDefined';
import { isFunction } from './isFunction';
import { isPlainObject } from './isPlainObject';
import { isBrowser } from './root';
import { configKey } from './storeConfig';
import { __stores__ } from './stores';
import { commit, isTransactionInProcess } from './transaction';
/**
 *
 * Store for managing any type of data
 *
 * @example
 *
 * export interface SessionState {
 *   token: string;
 *   userDetails: UserDetails
 * }
 *
 * export function createInitialState(): SessionState {
 *  return {
 *    token: '',
 *    userDetails: null
 *  };
 * }
 *
 * @StoreConfig({ name: 'session' })
 * export class SessionStore extends Store<SessionState> {
 *   constructor() {
 *    super(createInitialState());
 *   }
 * }
 */
var Store = /** @class */ (function () {
    function Store(initialState, options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.inTransaction = false;
        this.cache = {
            active: new BehaviorSubject(false),
            ttl: null,
        };
        this.onInit(initialState);
    }
    /**
     *  Set the loading state
     *
     *  @example
     *
     *  store.setLoading(true)
     *
     */
    Store.prototype.setLoading = function (loading) {
        if (loading === void 0) { loading = false; }
        if (loading !== this._value().loading) {
            isDev() && setAction('Set Loading');
            this._setState(function (state) { return (__assign(__assign({}, state), { loading: loading })); });
        }
    };
    /**
     *
     * Set whether the data is cached
     *
     * @example
     *
     * store.setHasCache(true)
     * store.setHasCache(false)
     * store.setHasCache(true, { restartTTL: true })
     *
     */
    Store.prototype.setHasCache = function (hasCache, options) {
        var _this = this;
        if (options === void 0) { options = { restartTTL: false }; }
        if (hasCache !== this.cache.active.value) {
            this.cache.active.next(hasCache);
        }
        if (options.restartTTL) {
            var ttlConfig = this.getCacheTTL();
            if (ttlConfig) {
                if (this.cache.ttl !== null) {
                    clearTimeout(this.cache.ttl);
                }
                this.cache.ttl = setTimeout(function () { return _this.setHasCache(false); }, ttlConfig);
            }
        }
    };
    /**
     *
     * Sometimes we need to access the store value from a store
     *
     * @example middleware
     *
     */
    Store.prototype.getValue = function () {
        return this.storeValue;
    };
    /**
     *  Set the error state
     *
     *  @example
     *
     *  store.setError({text: 'unable to load data' })
     *
     */
    Store.prototype.setError = function (error) {
        if (error !== this._value().error) {
            isDev() && setAction('Set Error');
            this._setState(function (state) { return (__assign(__assign({}, state), { error: error })); });
        }
    };
    // @internal
    Store.prototype._select = function (project) {
        return this.store.asObservable().pipe(map(function (snapshot) { return project(snapshot.state); }), distinctUntilChanged());
    };
    // @internal
    Store.prototype._value = function () {
        return this.storeValue;
    };
    // @internal
    Store.prototype._cache = function () {
        return this.cache.active;
    };
    Object.defineProperty(Store.prototype, "config", {
        // @internal
        get: function () {
            return this.constructor[configKey] || {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "storeName", {
        // @internal
        get: function () {
            return this.config.storeName || this.options.storeName || this.options.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "deepFreeze", {
        // @internal
        get: function () {
            return this.config.deepFreezeFn || this.options.deepFreezeFn || deepFreeze;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "cacheConfig", {
        // @internal
        get: function () {
            return this.config.cache || this.options.cache;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "_producerFn", {
        get: function () {
            return this.config.producerFn || this.options.producerFn || getGlobalProducerFn();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "resettable", {
        // @internal
        get: function () {
            return isDefined(this.config.resettable) ? this.config.resettable : this.options.resettable;
        },
        enumerable: false,
        configurable: true
    });
    // @internal
    Store.prototype._setState = function (newState, _dispatchAction) {
        var _this = this;
        if (_dispatchAction === void 0) { _dispatchAction = true; }
        if (isFunction(newState)) {
            var _newState = newState(this._value());
            this.storeValue = __DEV__ ? this.deepFreeze(_newState) : _newState;
        }
        else {
            this.storeValue = newState;
        }
        if (!this.store) {
            this.store = new BehaviorSubject({ state: this.storeValue });
            if (isDev()) {
                this.store.subscribe(function (_a) {
                    var action = _a.action;
                    if (action) {
                        dispatchUpdate(_this.storeName, action);
                    }
                });
            }
            return;
        }
        if (isTransactionInProcess()) {
            this.handleTransaction();
            return;
        }
        this.dispatch(this.storeValue, _dispatchAction);
    };
    /**
     *
     * Reset the current store back to the initial value
     *
     * @example
     *
     * store.reset()
     *
     */
    Store.prototype.reset = function () {
        var _this = this;
        if (this.isResettable()) {
            isDev() && setAction('Reset');
            this._setState(function () { return Object.assign({}, _this._initialState); });
            this.setHasCache(false);
        }
        else {
            isDev() && console.warn("You need to enable the reset functionality");
        }
    };
    Store.prototype.update = function (stateOrCallback) {
        isDev() && setAction('Update');
        var newState;
        var currentState = this._value();
        if (isFunction(stateOrCallback)) {
            newState = isFunction(this._producerFn) ? this._producerFn(currentState, stateOrCallback) : stateOrCallback(currentState);
        }
        else {
            newState = stateOrCallback;
        }
        var withHook = this.akitaPreUpdate(currentState, __assign(__assign({}, currentState), newState));
        var resolved = isPlainObject(currentState) ? withHook : new currentState.constructor(withHook);
        this._setState(resolved);
    };
    Store.prototype.updateStoreConfig = function (newOptions) {
        this.options = __assign(__assign({}, this.options), newOptions);
    };
    // @internal
    Store.prototype.akitaPreUpdate = function (_, nextState) {
        return nextState;
    };
    /**
     *
     * @deprecated
     *
     * This method will be removed in v7
     *
     * Akita isn't coupled to Angular and should not use Angular
     * specific code
     *
     */
    Store.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    /**
     *
     * Destroy the store
     *
     * @example
     *
     * store.destroy()
     *
     */
    Store.prototype.destroy = function () {
        var hmrEnabled = isBrowser ? window.hmrEnabled : false;
        if (!hmrEnabled && this === __stores__[this.storeName]) {
            delete __stores__[this.storeName];
            dispatchDeleted(this.storeName);
            this.setHasCache(false);
            this.cache.active.complete();
            this.store.complete();
        }
    };
    Store.prototype.onInit = function (initialState) {
        __stores__[this.storeName] = this;
        this._setState(function () { return initialState; });
        dispatchAdded(this.storeName);
        if (this.isResettable()) {
            this._initialState = initialState;
        }
        isDev() && assertStoreHasName(this.storeName, this.constructor.name);
    };
    Store.prototype.dispatch = function (state, _dispatchAction) {
        if (_dispatchAction === void 0) { _dispatchAction = true; }
        var action = undefined;
        if (_dispatchAction) {
            action = currentAction;
            resetCustomAction();
        }
        this.store.next({ state: state, action: action });
    };
    Store.prototype.watchTransaction = function () {
        var _this = this;
        commit().subscribe(function () {
            _this.inTransaction = false;
            _this.dispatch(_this._value());
        });
    };
    Store.prototype.isResettable = function () {
        if (this.resettable === false) {
            return false;
        }
        return this.resettable || getAkitaConfig().resettable;
    };
    Store.prototype.handleTransaction = function () {
        if (!this.inTransaction) {
            this.watchTransaction();
            this.inTransaction = true;
        }
    };
    Store.prototype.getCacheTTL = function () {
        return (this.cacheConfig && this.cacheConfig.ttl) || getAkitaConfig().ttl;
    };
    return Store;
}());
export { Store };
//# sourceMappingURL=store.js.map