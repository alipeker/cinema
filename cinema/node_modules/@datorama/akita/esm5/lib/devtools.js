import { __assign, __rest } from "tslib";
import { setSkipAction } from './actions';
import { isDefined } from './isDefined';
import { $$addStore, $$deleteStore, $$updateStore } from './dispatchers';
import { __stores__ } from './stores';
import { capitalize } from './capitalize';
import { isNotBrowser } from './root';
var subs = [];
export function akitaDevtools(ngZoneOrOptions, options) {
    if (options === void 0) { options = {}; }
    if (isNotBrowser)
        return;
    if (!window.__REDUX_DEVTOOLS_EXTENSION__) {
        return;
    }
    subs.length &&
        subs.forEach(function (s) {
            if (s.unsubscribe) {
                s.unsubscribe();
            }
            else {
                s && s();
            }
        });
    var isAngular = ngZoneOrOptions && ngZoneOrOptions['run'];
    if (!isAngular) {
        ngZoneOrOptions = ngZoneOrOptions || {};
        ngZoneOrOptions.run = function (cb) { return cb(); };
        options = ngZoneOrOptions;
    }
    var defaultOptions = { name: 'Akita', shallow: true, storesWhitelist: [] };
    var merged = Object.assign({}, defaultOptions, options);
    var storesWhitelist = merged.storesWhitelist;
    var devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(merged);
    var appState = {};
    var isAllowed = function (storeName) {
        if (!storesWhitelist.length) {
            return true;
        }
        return storesWhitelist.indexOf(storeName) > -1;
    };
    subs.push($$addStore.subscribe(function (storeName) {
        var _a;
        if (isAllowed(storeName) === false)
            return;
        appState = __assign(__assign({}, appState), (_a = {}, _a[storeName] = __stores__[storeName]._value(), _a));
        devTools.send({ type: "[" + capitalize(storeName) + "] - @@INIT" }, appState);
    }));
    subs.push($$deleteStore.subscribe(function (storeName) {
        if (isAllowed(storeName) === false)
            return;
        delete appState[storeName];
        devTools.send({ type: "[" + storeName + "] - Delete Store" }, appState);
    }));
    subs.push($$updateStore.subscribe(function (_a) {
        var _b;
        var storeName = _a.storeName, action = _a.action;
        if (isAllowed(storeName) === false)
            return;
        var type = action.type, entityIds = action.entityIds, skip = action.skip, rest = __rest(action, ["type", "entityIds", "skip"]);
        var payload = rest.payload;
        if (skip) {
            setSkipAction(false);
            return;
        }
        var store = __stores__[storeName];
        if (!store) {
            return;
        }
        if (options.shallow === false && appState[storeName]) {
            var isEqual = JSON.stringify(store._value()) === JSON.stringify(appState[storeName]);
            if (isEqual)
                return;
        }
        appState = __assign(__assign({}, appState), (_b = {}, _b[storeName] = store._value(), _b));
        var normalize = capitalize(storeName);
        var msg = isDefined(entityIds) ? "[" + normalize + "] - " + type + " (ids: " + entityIds + ")" : "[" + normalize + "] - " + type;
        if (options.logTrace) {
            console.group(msg);
            console.trace();
            console.groupEnd();
        }
        if (options.sortAlphabetically) {
            var sortedAppState = Object.keys(appState)
                .sort()
                .reduce(function (acc, storeName) {
                acc[storeName] = appState[storeName];
                return acc;
            }, {});
            devTools.send(__assign({ type: msg }, payload), sortedAppState);
            return;
        }
        devTools.send(__assign({ type: msg }, payload), appState);
    }));
    subs.push(devTools.subscribe(function (message) {
        if (message.type === 'DISPATCH') {
            var payloadType = message.payload.type;
            if (payloadType === 'COMMIT') {
                devTools.init(appState);
                return;
            }
            if (message.state) {
                var rootState_1 = JSON.parse(message.state);
                var _loop_1 = function (i, keys) {
                    var storeName = keys[i];
                    if (__stores__[storeName]) {
                        ngZoneOrOptions.run(function () {
                            __stores__[storeName]._setState(function () { return rootState_1[storeName]; }, false);
                        });
                    }
                };
                for (var i = 0, keys = Object.keys(rootState_1); i < keys.length; i++) {
                    _loop_1(i, keys);
                }
            }
        }
    }));
}
//# sourceMappingURL=devtools.js.map