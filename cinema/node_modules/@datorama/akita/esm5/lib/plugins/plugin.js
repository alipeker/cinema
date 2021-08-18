import { __assign } from "tslib";
import { filterNilValue } from '../filterNil';
import { toBoolean } from '../toBoolean';
import { getAkitaConfig } from '../config';
import { getValue } from '../getValueByString';
import { setValue } from '../setValueByString';
var AkitaPlugin = /** @class */ (function () {
    function AkitaPlugin(query, config) {
        this.query = query;
        if (config && config.resetFn) {
            if (getAkitaConfig().resettable) {
                this.onReset(config.resetFn);
            }
        }
    }
    /** This method is responsible for getting access to the query. */
    AkitaPlugin.prototype.getQuery = function () {
        return this.query;
    };
    /** This method is responsible for getting access to the store. */
    AkitaPlugin.prototype.getStore = function () {
        return this.getQuery().__store__;
    };
    /** This method is responsible tells whether the plugin is entityBased or not.  */
    AkitaPlugin.prototype.isEntityBased = function (entityId) {
        return toBoolean(entityId);
    };
    /** This method is responsible for selecting the source; it can be the whole store or one entity. */
    AkitaPlugin.prototype.selectSource = function (entityId, property) {
        var _this = this;
        if (this.isEntityBased(entityId)) {
            return this.getQuery().selectEntity(entityId).pipe(filterNilValue());
        }
        if (property) {
            return this.getQuery().select(function (state) { return getValue(state, _this.withStoreName(property)); });
        }
        return this.getQuery().select();
    };
    AkitaPlugin.prototype.getSource = function (entityId, property) {
        if (this.isEntityBased(entityId)) {
            return this.getQuery().getEntity(entityId);
        }
        var state = this.getQuery().getValue();
        if (property) {
            return getValue(state, this.withStoreName(property));
        }
        return state;
    };
    AkitaPlugin.prototype.withStoreName = function (prop) {
        return this.storeName + "." + prop;
    };
    Object.defineProperty(AkitaPlugin.prototype, "storeName", {
        get: function () {
            return this.getStore().storeName;
        },
        enumerable: false,
        configurable: true
    });
    /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
    AkitaPlugin.prototype.updateStore = function (newState, entityId, property, replace) {
        var _this = this;
        if (replace === void 0) { replace = false; }
        if (this.isEntityBased(entityId)) {
            var store = this.getStore();
            replace ? store.replace(entityId, newState) : store.update(entityId, newState);
        }
        else {
            if (property) {
                this.getStore()._setState(function (state) {
                    return setValue(state, _this.withStoreName(property), newState, true);
                });
                return;
            }
            var nextState = replace ? newState : function (state) { return (__assign(__assign({}, state), newState)); };
            this.getStore()._setState(nextState);
        }
    };
    /**
     * Function to invoke upon reset
     */
    AkitaPlugin.prototype.onReset = function (fn) {
        var _this = this;
        var original = this.getStore().reset;
        this.getStore().reset = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            /** It should run after the plugin destroy method */
            setTimeout(function () {
                original.apply(_this.getStore(), params);
                fn();
            });
        };
    };
    return AkitaPlugin;
}());
export { AkitaPlugin };
//# sourceMappingURL=plugin.js.map