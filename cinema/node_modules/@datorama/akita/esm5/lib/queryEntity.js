import { __extends } from "tslib";
import { of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { distinctUntilArrayItemChanged } from './arrayFind';
import { coerceArray } from './coerceArray';
import { entitiesToArray } from './entitiesToArray';
import { entitiesToMap } from './entitiesToMap';
import { findEntityByPredicate, getEntity } from './getEntity';
import { isArray } from './isArray';
import { isDefined } from './isDefined';
import { isFunction } from './isFunction';
import { isNil } from './isNil';
import { mapSkipUndefined } from './mapSkipUndefined';
import { Query } from './query';
import { sortByOptions } from './sortByOptions';
import { toBoolean } from './toBoolean';
/**
 *
 *  The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.
 *
 *  class WidgetsQuery extends QueryEntity<WidgetsState> {
 *     constructor(protected store: WidgetsStore) {
 *       super(store);
 *     }
 *  }
 *
 *
 *
 */
var QueryEntity = /** @class */ (function (_super) {
    __extends(QueryEntity, _super);
    function QueryEntity(store, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, store) || this;
        _this.options = options;
        _this.__store__ = store;
        return _this;
    }
    QueryEntity.prototype.selectAll = function (options) {
        var _this = this;
        if (options === void 0) { options = {
            asObject: false,
        }; }
        return this.select(function (state) { return state.entities; }).pipe(map(function () { return _this.getAll(options); }));
    };
    QueryEntity.prototype.getAll = function (options) {
        if (options === void 0) { options = { asObject: false, filterBy: undefined, limitTo: undefined }; }
        if (options.asObject) {
            return entitiesToMap(this.getValue(), options);
        }
        sortByOptions(options, this.config || this.options);
        return entitiesToArray(this.getValue(), options);
    };
    QueryEntity.prototype.selectMany = function (ids, project) {
        if (!ids || !ids.length)
            return of([]);
        return this.select(function (state) { return state.entities; }).pipe(map(function (entities) { return mapSkipUndefined(ids, function (id) { return getEntity(id, project)(entities); }); }), distinctUntilArrayItemChanged());
    };
    QueryEntity.prototype.selectEntity = function (idOrPredicate, project) {
        var id = idOrPredicate;
        if (isFunction(idOrPredicate)) {
            // For performance reason we expect the entity to be in the store
            id = findEntityByPredicate(idOrPredicate, this.getValue().entities);
        }
        return this.select(function (state) { return state.entities; }).pipe(map(getEntity(id, project)), distinctUntilChanged());
    };
    /**
     * Get an entity by id
     *
     * @example
     *
     * this.query.getEntity(1);
     */
    QueryEntity.prototype.getEntity = function (id) {
        return this.getValue().entities[id];
    };
    /**
     * Select the active entity's id
     *
     * @example
     *
     * this.query.selectActiveId()
     */
    QueryEntity.prototype.selectActiveId = function () {
        return this.select(function (state) { return state.active; });
    };
    /**
     * Get the active id
     *
     * @example
     *
     * this.query.getActiveId()
     */
    QueryEntity.prototype.getActiveId = function () {
        return this.getValue().active;
    };
    QueryEntity.prototype.selectActive = function (project) {
        var _this = this;
        if (isArray(this.getActive())) {
            return this.selectActiveId().pipe(switchMap(function (ids) { return _this.selectMany(ids, project); }));
        }
        return this.selectActiveId().pipe(switchMap(function (ids) { return _this.selectEntity(ids, project); }));
    };
    QueryEntity.prototype.getActive = function () {
        var _this = this;
        var activeId = this.getActiveId();
        if (isArray(activeId)) {
            return activeId.map(function (id) { return _this.getValue().entities[id]; });
        }
        return toBoolean(activeId) ? this.getEntity(activeId) : undefined;
    };
    /**
     * Select the store's entity collection length
     *
     * @example
     *
     * this.query.selectCount()
     * this.query.selectCount(entity => entity.completed)
     */
    QueryEntity.prototype.selectCount = function (predicate) {
        var _this = this;
        return this.select(function (state) { return state.entities; }).pipe(map(function () { return _this.getCount(predicate); }));
    };
    /**
     * Get the store's entity collection length
     *
     * @example
     *
     * this.query.getCount()
     * this.query.getCount(entity => entity.completed)
     */
    QueryEntity.prototype.getCount = function (predicate) {
        if (isFunction(predicate)) {
            return this.getAll().filter(predicate).length;
        }
        return this.getValue().ids.length;
    };
    QueryEntity.prototype.selectLast = function (project) {
        return this.selectAt(function (ids) { return ids[ids.length - 1]; }, project);
    };
    QueryEntity.prototype.selectFirst = function (project) {
        return this.selectAt(function (ids) { return ids[0]; }, project);
    };
    QueryEntity.prototype.selectEntityAction = function (actionOrActions) {
        if (isNil(actionOrActions)) {
            return this.store.selectEntityAction$;
        }
        var project = isArray(actionOrActions) ? function (action) { return action; } : function (_a) {
            var ids = _a.ids;
            return ids;
        };
        var actions = coerceArray(actionOrActions);
        return this.store.selectEntityAction$.pipe(filter(function (_a) {
            var type = _a.type;
            return actions.includes(type);
        }), map(function (action) { return project(action); }));
    };
    QueryEntity.prototype.hasEntity = function (projectOrIds) {
        var _this = this;
        if (isNil(projectOrIds)) {
            return this.getValue().ids.length > 0;
        }
        if (isFunction(projectOrIds)) {
            return this.getAll().some(projectOrIds);
        }
        if (isArray(projectOrIds)) {
            return projectOrIds.every(function (id) { return id in _this.getValue().entities; });
        }
        return projectOrIds in this.getValue().entities;
    };
    /**
     * Returns whether entity store has an active entity
     *
     * @example
     *
     * this.query.hasActive()
     * this.query.hasActive(3)
     *
     */
    QueryEntity.prototype.hasActive = function (id) {
        var active = this.getValue().active;
        var isIdProvided = isDefined(id);
        if (Array.isArray(active)) {
            if (isIdProvided) {
                return active.includes(id);
            }
            return active.length > 0;
        }
        return isIdProvided ? active === id : isDefined(active);
    };
    /**
     *
     * Create sub UI query for querying Entity's UI state
     *
     * @example
     *
     *
     * export class ProductsQuery extends QueryEntity<ProductsState> {
     *   ui: EntityUIQuery<ProductsUIState>;
     *
     *   constructor(protected store: ProductsStore) {
     *     super(store);
     *     this.createUIQuery();
     *   }
     *
     * }
     */
    QueryEntity.prototype.createUIQuery = function () {
        this.ui = new EntityUIQuery(this.__store__.ui);
    };
    QueryEntity.prototype.selectAt = function (mapFn, project) {
        var _this = this;
        return this.select(function (state) { return state.ids; }).pipe(map(mapFn), distinctUntilChanged(), switchMap(function (id) { return _this.selectEntity(id, project); }));
    };
    return QueryEntity;
}(Query));
export { QueryEntity };
// @internal
var EntityUIQuery = /** @class */ (function (_super) {
    __extends(EntityUIQuery, _super);
    function EntityUIQuery(store) {
        return _super.call(this, store) || this;
    }
    return EntityUIQuery;
}(QueryEntity));
export { EntityUIQuery };
//# sourceMappingURL=queryEntity.js.map