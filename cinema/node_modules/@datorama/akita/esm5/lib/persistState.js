import { __assign } from "tslib";
import { from, isObservable, of, ReplaySubject } from 'rxjs';
import { filter, map, skip } from 'rxjs/operators';
import { setAction } from './actions';
import { $$addStore, $$deleteStore } from './dispatchers';
import { getValue } from './getValueByString';
import { isFunction } from './isFunction';
import { isNil } from './isNil';
import { isObject } from './isObject';
import { hasLocalStorage, hasSessionStorage, isNotBrowser } from './root';
import { setValue } from './setValueByString';
import { __stores__ } from './stores';
var skipStorageUpdate = false;
var _persistStateInit = new ReplaySubject(1);
export function selectPersistStateInit() {
    return _persistStateInit.asObservable();
}
export function setSkipStorageUpdate(skip) {
    skipStorageUpdate = skip;
}
export function getSkipStorageUpdate() {
    return skipStorageUpdate;
}
function isPromise(v) {
    return v && isFunction(v.then);
}
function observify(asyncOrValue) {
    if (isPromise(asyncOrValue) || isObservable(asyncOrValue)) {
        return from(asyncOrValue);
    }
    return of(asyncOrValue);
}
export function persistState(params) {
    var defaults = {
        key: 'AkitaStores',
        enableInNonBrowser: false,
        storage: !hasLocalStorage() ? params.storage : localStorage,
        deserialize: JSON.parse,
        serialize: JSON.stringify,
        include: [],
        select: [],
        persistOnDestroy: false,
        preStorageUpdate: function (storeName, state) {
            return state;
        },
        preStoreUpdate: function (storeName, state) {
            return state;
        },
        skipStorageUpdate: getSkipStorageUpdate,
        preStorageUpdateOperator: function () { return function (source) { return source; }; },
    };
    var _a = Object.assign({}, defaults, params), storage = _a.storage, enableInNonBrowser = _a.enableInNonBrowser, deserialize = _a.deserialize, serialize = _a.serialize, include = _a.include, select = _a.select, key = _a.key, preStorageUpdate = _a.preStorageUpdate, persistOnDestroy = _a.persistOnDestroy, preStorageUpdateOperator = _a.preStorageUpdateOperator, preStoreUpdate = _a.preStoreUpdate, skipStorageUpdate = _a.skipStorageUpdate;
    if ((isNotBrowser && !enableInNonBrowser) || !storage)
        return;
    var hasInclude = include.length > 0;
    var hasSelect = select.length > 0;
    var includeStores;
    var selectStores;
    if (hasInclude) {
        includeStores = include.reduce(function (acc, path) {
            if (isFunction(path)) {
                acc.fns.push(path);
            }
            else {
                var storeName = path.split('.')[0];
                acc[storeName] = path;
            }
            return acc;
        }, { fns: [] });
    }
    if (hasSelect) {
        selectStores = select.reduce(function (acc, selectFn) {
            acc[selectFn.storeName] = selectFn;
            return acc;
        }, {});
    }
    var stores = {};
    var acc = {};
    var subscriptions = [];
    var buffer = [];
    function _save(v) {
        observify(v).subscribe(function () {
            var next = buffer.shift();
            next && _save(next);
        });
    }
    // when we use the local/session storage we perform the serialize, otherwise we let the passed storage implementation to do it
    var isLocalStorage = (hasLocalStorage() && storage === localStorage) || (hasSessionStorage() && storage === sessionStorage);
    observify(storage.getItem(key)).subscribe(function (value) {
        var storageState = isObject(value) ? value : deserialize(value || '{}');
        function save(storeCache) {
            storageState['$cache'] = __assign(__assign({}, (storageState['$cache'] || {})), storeCache);
            storageState = Object.assign({}, storageState, acc);
            buffer.push(storage.setItem(key, isLocalStorage ? serialize(storageState) : storageState));
            _save(buffer.shift());
        }
        function subscribe(storeName, path) {
            stores[storeName] = __stores__[storeName]
                ._select(function (state) { return getValue(state, path); })
                .pipe(skip(1), map(function (store) {
                if (hasSelect && selectStores[storeName]) {
                    return selectStores[storeName](store);
                }
                return store;
            }), filter(function () { return skipStorageUpdate() === false; }), preStorageUpdateOperator())
                .subscribe(function (data) {
                acc[storeName] = preStorageUpdate(storeName, data);
                Promise.resolve().then(function () {
                    var _a;
                    return save((_a = {}, _a[storeName] = __stores__[storeName]._cache().getValue(), _a));
                });
            });
        }
        function setInitial(storeName, store, path) {
            if (storeName in storageState) {
                setAction('@PersistState');
                store._setState(function (state) {
                    return setValue(state, path, preStoreUpdate(storeName, storageState[storeName], state));
                });
                var hasCache = storageState['$cache'] ? storageState['$cache'][storeName] : false;
                __stores__[storeName].setHasCache(hasCache, { restartTTL: true });
            }
        }
        subscriptions.push($$deleteStore.subscribe(function (storeName) {
            var _a;
            if (stores[storeName]) {
                if (persistOnDestroy === false) {
                    save((_a = {}, _a[storeName] = false, _a));
                }
                stores[storeName].unsubscribe();
                delete stores[storeName];
            }
        }));
        subscriptions.push($$addStore.subscribe(function (storeName) {
            if (storeName === 'router') {
                return;
            }
            var store = __stores__[storeName];
            if (hasInclude) {
                var path = includeStores[storeName];
                if (!path) {
                    var passPredicate = includeStores.fns.some(function (fn) { return fn(storeName); });
                    if (passPredicate) {
                        path = storeName;
                    }
                    else {
                        return;
                    }
                }
                setInitial(storeName, store, path);
                subscribe(storeName, path);
            }
            else {
                setInitial(storeName, store, storeName);
                subscribe(storeName, storeName);
            }
        }));
        _persistStateInit.next();
    });
    return {
        destroy: function () {
            subscriptions.forEach(function (s) { return s.unsubscribe(); });
            for (var i = 0, keys = Object.keys(stores); i < keys.length; i++) {
                var storeName = keys[i];
                stores[storeName].unsubscribe();
            }
            stores = {};
        },
        clear: function () {
            storage.clear();
        },
        clearStore: function (storeName) {
            if (isNil(storeName)) {
                var value_1 = observify(storage.setItem(key, '{}'));
                value_1.subscribe();
                return;
            }
            var value = storage.getItem(key);
            observify(value).subscribe(function (v) {
                var storageState = deserialize(v || '{}');
                if (storageState[storeName]) {
                    delete storageState[storeName];
                    var value_2 = observify(storage.setItem(key, serialize(storageState)));
                    value_2.subscribe();
                }
            });
        },
    };
}
//# sourceMappingURL=persistState.js.map