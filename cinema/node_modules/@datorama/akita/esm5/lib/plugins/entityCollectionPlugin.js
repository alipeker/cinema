import { isUndefined } from '../isUndefined';
import { coerceArray } from '../coerceArray';
import { toBoolean } from '../toBoolean';
import { isFunction } from '../isFunction';
/**
 * Each plugin that wants to add support for entities should extend this interface.
 */
var EntityCollectionPlugin = /** @class */ (function () {
    function EntityCollectionPlugin(query, entityIds) {
        this.query = query;
        this.entityIds = entityIds;
        this.entities = new Map();
    }
    /**
     * Get the entity plugin instance.
     */
    EntityCollectionPlugin.prototype.getEntity = function (id) {
        return this.entities.get(id);
    };
    /**
     * Whether the entity plugin exist.
     */
    EntityCollectionPlugin.prototype.hasEntity = function (id) {
        return this.entities.has(id);
    };
    /**
     * Remove the entity plugin instance.
     */
    EntityCollectionPlugin.prototype.removeEntity = function (id) {
        this.destroy(id);
        return this.entities.delete(id);
    };
    /**
     * Set the entity plugin instance.
     */
    EntityCollectionPlugin.prototype.createEntity = function (id, plugin) {
        return this.entities.set(id, plugin);
    };
    /**
     * If the user passes `entityIds` we take them; otherwise, we take all.
     */
    EntityCollectionPlugin.prototype.getIds = function () {
        return isUndefined(this.entityIds) ? this.query.getValue().ids : coerceArray(this.entityIds);
    };
    /**
     * When you call one of the plugin methods, you can pass id/ids or undefined which means all.
     */
    EntityCollectionPlugin.prototype.resolvedIds = function (ids) {
        return isUndefined(ids) ? this.getIds() : coerceArray(ids);
    };
    /**
     * Call this method when you want to activate the plugin on init or when you need to listen to add/remove of entities dynamically.
     *
     * For example in your plugin you may do the following:
     *
     * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
     */
    EntityCollectionPlugin.prototype.rebase = function (ids, actions) {
        var _this = this;
        if (actions === void 0) { actions = {}; }
        /**
         *
         * If the user passes `entityIds` & we have new ids check if we need to add/remove instances.
         *
         * This phase will be called only upon update.
         */
        if (toBoolean(ids)) {
            /**
             * Which means all
             */
            if (isUndefined(this.entityIds)) {
                for (var i = 0, len = ids.length; i < len; i++) {
                    var entityId = ids[i];
                    if (this.hasEntity(entityId) === false) {
                        isFunction(actions.beforeAdd) && actions.beforeAdd(entityId);
                        var plugin = this.instantiatePlugin(entityId);
                        this.entities.set(entityId, plugin);
                        isFunction(actions.afterAdd) && actions.afterAdd(plugin);
                    }
                }
                this.entities.forEach(function (plugin, entityId) {
                    if (ids.indexOf(entityId) === -1) {
                        isFunction(actions.beforeRemove) && actions.beforeRemove(plugin);
                        _this.removeEntity(entityId);
                    }
                });
            }
            else {
                /**
                 * Which means the user passes specific ids
                 */
                var _ids = coerceArray(this.entityIds);
                for (var i = 0, len = _ids.length; i < len; i++) {
                    var entityId = _ids[i];
                    /** The Entity in current ids and doesn't exist, add it. */
                    if (ids.indexOf(entityId) > -1 && this.hasEntity(entityId) === false) {
                        isFunction(actions.beforeAdd) && actions.beforeAdd(entityId);
                        var plugin = this.instantiatePlugin(entityId);
                        this.entities.set(entityId, plugin);
                        isFunction(actions.afterAdd) && actions.afterAdd(plugin);
                    }
                    else {
                        this.entities.forEach(function (plugin, entityId) {
                            /** The Entity not in current ids and exists, remove it. */
                            if (ids.indexOf(entityId) === -1 && _this.hasEntity(entityId) === true) {
                                isFunction(actions.beforeRemove) && actions.beforeRemove(plugin);
                                _this.removeEntity(entityId);
                            }
                        });
                    }
                }
            }
        }
        else {
            /**
             * Otherwise, start with the provided ids or all.
             */
            this.getIds().forEach(function (id) {
                if (!_this.hasEntity(id))
                    _this.createEntity(id, _this.instantiatePlugin(id));
            });
        }
    };
    /**
     * Listen for add/remove entities.
     */
    EntityCollectionPlugin.prototype.selectIds = function () {
        return this.query.select(function (state) { return state.ids; });
    };
    /**
     * Base method for activation, you can override it if you need to.
     */
    EntityCollectionPlugin.prototype.activate = function (ids) {
        this.rebase(ids);
    };
    /**
     * Loop over each id and invoke the plugin method.
     */
    EntityCollectionPlugin.prototype.forEachId = function (ids, cb) {
        var _ids = this.resolvedIds(ids);
        for (var i = 0, len = _ids.length; i < len; i++) {
            var id = _ids[i];
            if (this.hasEntity(id)) {
                cb(this.getEntity(id));
            }
        }
    };
    return EntityCollectionPlugin;
}());
export { EntityCollectionPlugin };
//# sourceMappingURL=entityCollectionPlugin.js.map