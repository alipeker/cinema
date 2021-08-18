import { __values } from "tslib";
import { __stores__ } from './stores';
import { applyTransaction } from './transaction';
/**
 * Reset stores back to their initial state
 *
 * @example
 *
 * resetStores()
 * resetStores({
 *   exclude: ['auth']
 * })
 */
export function resetStores(options) {
    var defaults = {
        exclude: []
    };
    options = Object.assign({}, defaults, options);
    var stores = Object.keys(__stores__);
    applyTransaction(function () {
        var e_1, _a;
        try {
            for (var stores_1 = __values(stores), stores_1_1 = stores_1.next(); !stores_1_1.done; stores_1_1 = stores_1.next()) {
                var store = stores_1_1.value;
                var s = __stores__[store];
                if (!options.exclude) {
                    s.reset();
                }
                else {
                    if (options.exclude.indexOf(s.storeName) === -1) {
                        s.reset();
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stores_1_1 && !stores_1_1.done && (_a = stores_1.return)) _a.call(stores_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
//# sourceMappingURL=resetStores.js.map