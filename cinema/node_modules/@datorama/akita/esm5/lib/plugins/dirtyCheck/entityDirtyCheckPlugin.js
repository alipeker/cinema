import { __assign, __extends, __values } from "tslib";
import { dirtyCheckDefaultParams, DirtyCheckPlugin, getNestedPath } from './dirtyCheckPlugin';
import { EntityCollectionPlugin } from '../entityCollectionPlugin';
import { auditTime, map, skip } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';
import { coerceArray } from '../../coerceArray';
var EntityDirtyCheckPlugin = /** @class */ (function (_super) {
    __extends(EntityDirtyCheckPlugin, _super);
    function EntityDirtyCheckPlugin(query, params) {
        if (params === void 0) { params = {}; }
        var _this = _super.call(this, query, params.entityIds) || this;
        _this.query = query;
        _this.params = params;
        _this._someDirty = new Subject();
        _this.someDirty$ = merge(_this.query.select(function (state) { return state.entities; }), _this._someDirty.asObservable()).pipe(auditTime(0), map(function () { return _this.checkSomeDirty(); }));
        _this.params = __assign(__assign({}, dirtyCheckDefaultParams), params);
        // TODO lazy activate?
        _this.activate();
        _this.selectIds()
            .pipe(skip(1))
            .subscribe(function (ids) {
            _super.prototype.rebase.call(_this, ids, { afterAdd: function (plugin) { return plugin.setHead(); } });
        });
        return _this;
    }
    EntityDirtyCheckPlugin.prototype.setHead = function (ids) {
        if (this.params.entityIds && ids) {
            var toArray_1 = coerceArray(ids);
            var someAreWatched = coerceArray(this.params.entityIds).some(function (id) { return toArray_1.indexOf(id) > -1; });
            if (someAreWatched === false) {
                return this;
            }
        }
        this.forEachId(ids, function (e) { return e.setHead(); });
        this._someDirty.next();
        return this;
    };
    EntityDirtyCheckPlugin.prototype.hasHead = function (id) {
        if (this.entities.has(id)) {
            var entity = this.getEntity(id);
            return entity.hasHead();
        }
        return false;
    };
    EntityDirtyCheckPlugin.prototype.reset = function (ids, params) {
        if (params === void 0) { params = {}; }
        this.forEachId(ids, function (e) { return e.reset(params); });
    };
    EntityDirtyCheckPlugin.prototype.isDirty = function (id, asObservable) {
        if (asObservable === void 0) { asObservable = true; }
        if (this.entities.has(id)) {
            var entity = this.getEntity(id);
            return asObservable ? entity.isDirty$ : entity.isDirty();
        }
        return false;
    };
    EntityDirtyCheckPlugin.prototype.someDirty = function () {
        return this.checkSomeDirty();
    };
    EntityDirtyCheckPlugin.prototype.isPathDirty = function (id, path) {
        if (this.entities.has(id)) {
            var head = this.getEntity(id).getHead();
            var current = this.query.getEntity(id);
            var currentPathValue = getNestedPath(current, path);
            var headPathValue = getNestedPath(head, path);
            return this.params.comparator(currentPathValue, headPathValue);
        }
        return null;
    };
    EntityDirtyCheckPlugin.prototype.destroy = function (ids) {
        this.forEachId(ids, function (e) { return e.destroy(); });
        /** complete only when the plugin destroys */
        if (!ids) {
            this._someDirty.complete();
        }
    };
    EntityDirtyCheckPlugin.prototype.instantiatePlugin = function (id) {
        return new DirtyCheckPlugin(this.query, this.params, id);
    };
    EntityDirtyCheckPlugin.prototype.checkSomeDirty = function () {
        var e_1, _a;
        var entitiesIds = this.resolvedIds();
        try {
            for (var entitiesIds_1 = __values(entitiesIds), entitiesIds_1_1 = entitiesIds_1.next(); !entitiesIds_1_1.done; entitiesIds_1_1 = entitiesIds_1.next()) {
                var id = entitiesIds_1_1.value;
                if (this.getEntity(id).isDirty()) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (entitiesIds_1_1 && !entitiesIds_1_1.done && (_a = entitiesIds_1.return)) _a.call(entitiesIds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    return EntityDirtyCheckPlugin;
}(EntityCollectionPlugin));
export { EntityDirtyCheckPlugin };
//# sourceMappingURL=entityDirtyCheckPlugin.js.map