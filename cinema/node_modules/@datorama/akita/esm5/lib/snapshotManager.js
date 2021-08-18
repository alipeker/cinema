import { __assign } from "tslib";
import { __stores__ } from './stores';
import { isString } from './isString';
import { setSkipStorageUpdate } from './persistState';
import { $$addStore } from './dispatchers';
import { filter, take } from 'rxjs/operators';
var SnapshotManager = /** @class */ (function () {
    function SnapshotManager() {
    }
    /**
     * Get a snapshot of the whole state or a specific stores
     * Use it ONLY for things such as saving the state in the server
     */
    SnapshotManager.prototype.getStoresSnapshot = function (stores) {
        if (stores === void 0) { stores = []; }
        var acc = {};
        var hasInclude = stores.length > 0;
        var keys = hasInclude ? stores : Object.keys(__stores__);
        for (var i = 0; i < keys.length; i++) {
            var storeName = keys[i];
            if (storeName !== 'router') {
                acc[storeName] = __stores__[storeName]._value();
            }
        }
        return acc;
    };
    SnapshotManager.prototype.setStoresSnapshot = function (stores, options) {
        var mergedOptions = __assign({ skipStorageUpdate: false, lazy: false }, options);
        mergedOptions.skipStorageUpdate && setSkipStorageUpdate(true);
        var normalizedStores = stores;
        if (isString(stores)) {
            normalizedStores = JSON.parse(normalizedStores);
        }
        var size = Object.keys(normalizedStores).length;
        if (mergedOptions.lazy) {
            $$addStore
                .pipe(filter(function (name) { return normalizedStores.hasOwnProperty(name); }), take(size))
                .subscribe(function (name) { return __stores__[name]._setState(function () { return normalizedStores[name]; }); });
        }
        else {
            var _loop_1 = function (i, keys) {
                var storeName = keys[i];
                if (__stores__[storeName]) {
                    __stores__[storeName]._setState(function () { return normalizedStores[storeName]; });
                }
            };
            for (var i = 0, keys = Object.keys(normalizedStores); i < keys.length; i++) {
                _loop_1(i, keys);
            }
        }
        mergedOptions.skipStorageUpdate && setSkipStorageUpdate(false);
    };
    return SnapshotManager;
}());
export { SnapshotManager };
export var snapshotManager = new SnapshotManager();
//# sourceMappingURL=snapshotManager.js.map