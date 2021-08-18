import { __assign, __decorate, __extends, __metadata, __read, __spread, __values } from "tslib";
import { Subject } from 'rxjs';
import { logAction, setAction } from './actions';
import { addEntities } from './addEntities';
import { coerceArray } from './coerceArray';
import { DEFAULT_ID_KEY } from './defaultIDKey';
import { EntityActions } from './entityActions';
import { isDev } from './env';
import { getActiveEntities } from './getActiveEntities';
import { getInitialEntitiesState } from './getInitialEntitiesState';
import { hasEntity } from './hasEntity';
import { isDefined } from './isDefined';
import { isEmpty } from './isEmpty';
import { isFunction } from './isFunction';
import { isNil } from './isNil';
import { isUndefined } from './isUndefined';
import { removeEntities } from './removeEntities';
import { setEntities } from './setEntities';
import { Store } from './store';
import { transaction } from './transaction';
import { updateEntities } from './updateEntities';
/**
 *
 * Store for managing a collection of entities
 *
 * @example
 *
 * export interface WidgetsState extends EntityState<Widget> { }
 *
 * @StoreConfig({ name: 'widgets' })
 *  export class WidgetsStore extends EntityStore<WidgetsState> {
 *   constructor() {
 *     super();
 *   }
 * }
 *
 *
 */
var EntityStore = /** @class */ (function (_super) {
    __extends(EntityStore, _super);
    function EntityStore(initialState, options) {
        if (initialState === void 0) { initialState = {}; }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, __assign(__assign({}, getInitialEntitiesState()), initialState), options) || this;
        _this.options = options;
        _this.entityActions = new Subject();
        _this.entityIdChanges = new Subject();
        return _this;
    }
    Object.defineProperty(EntityStore.prototype, "selectEntityAction$", {
        // @internal
        get: function () {
            return this.entityActions.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EntityStore.prototype, "selectEntityIdChanges$", {
        // @internal
        get: function () {
            return this.entityIdChanges.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EntityStore.prototype, "idKey", {
        // @internal
        get: function () {
            return this.config.idKey || this.options.idKey || DEFAULT_ID_KEY;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * Replace current collection with provided collection
     *
     * @example
     *
     * this.store.set([Entity, Entity])
     * this.store.set({ids: [], entities: {}})
     * this.store.set({ 1: {}, 2: {}})
     *
     */
    EntityStore.prototype.set = function (entities, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (isNil(entities))
            return;
        isDev() && setAction('Set Entity');
        var isNativePreAdd = this.akitaPreAddEntity === EntityStore.prototype.akitaPreAddEntity;
        this.setHasCache(true, { restartTTL: true });
        this._setState(function (state) {
            var newState = setEntities({
                state: state,
                entities: entities,
                idKey: _this.idKey,
                preAddEntity: _this.akitaPreAddEntity,
                isNativePreAdd: isNativePreAdd,
            });
            if (isUndefined(options.activeId) === false) {
                newState.active = options.activeId;
            }
            return newState;
        });
        if (this.hasInitialUIState()) {
            this.handleUICreation();
        }
        this.entityActions.next({ type: EntityActions.Set, ids: this.ids });
    };
    /**
     * Add entities
     *
     * @example
     *
     * this.store.add([Entity, Entity])
     * this.store.add(Entity)
     * this.store.add(Entity, { prepend: true })
     *
     * this.store.add(Entity, { loading: false })
     */
    EntityStore.prototype.add = function (entities, options) {
        if (options === void 0) { options = { loading: false }; }
        var collection = coerceArray(entities);
        if (isEmpty(collection))
            return;
        var data = addEntities({
            state: this._value(),
            preAddEntity: this.akitaPreAddEntity,
            entities: collection,
            idKey: this.idKey,
            options: options,
        });
        if (data) {
            isDev() && setAction('Add Entity');
            data.newState.loading = options.loading;
            this._setState(function () { return data.newState; });
            if (this.hasInitialUIState()) {
                this.handleUICreation(true);
            }
            this.entityActions.next({ type: EntityActions.Add, ids: data.newIds });
        }
    };
    EntityStore.prototype.update = function (idsOrFnOrState, newStateOrFn) {
        var _this = this;
        if (isUndefined(newStateOrFn)) {
            _super.prototype.update.call(this, idsOrFnOrState);
            return;
        }
        var ids = [];
        if (isFunction(idsOrFnOrState)) {
            // We need to filter according the predicate function
            ids = this.ids.filter(function (id) { return idsOrFnOrState(_this.entities[id]); });
        }
        else {
            // If it's nil we want all of them
            ids = isNil(idsOrFnOrState) ? this.ids : coerceArray(idsOrFnOrState);
        }
        if (isEmpty(ids))
            return;
        isDev() && setAction('Update Entity', ids);
        var entityIdChanged;
        this._setState(function (state) {
            return updateEntities({
                idKey: _this.idKey,
                ids: ids,
                preUpdateEntity: _this.akitaPreUpdateEntity,
                state: state,
                newStateOrFn: newStateOrFn,
                producerFn: _this._producerFn,
                onEntityIdChanges: function (oldId, newId) {
                    entityIdChanged = { oldId: oldId, newId: newId };
                    _this.entityIdChanges.next(__assign(__assign({}, entityIdChanged), { pending: true }));
                },
            });
        });
        if (entityIdChanged) {
            this.entityIdChanges.next(__assign(__assign({}, entityIdChanged), { pending: false }));
        }
        this.entityActions.next({ type: EntityActions.Update, ids: ids });
    };
    EntityStore.prototype.upsert = function (ids, newState, onCreate, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var toArray = coerceArray(ids);
        var predicate = function (isUpdate) { return function (id) { return hasEntity(_this.entities, id) === isUpdate; }; };
        var baseClass = isFunction(onCreate) ? options.baseClass : onCreate ? onCreate.baseClass : undefined;
        var isClassBased = isFunction(baseClass);
        var updateIds = toArray.filter(predicate(true));
        var newEntities = toArray.filter(predicate(false)).map(function (id) {
            var _a;
            var newStateObj = typeof newState === 'function' ? newState({}) : newState;
            var entity = isFunction(onCreate) ? onCreate(id, newStateObj) : newStateObj;
            var withId = __assign(__assign({}, entity), (_a = {}, _a[_this.idKey] = id, _a));
            if (isClassBased) {
                return new baseClass(withId);
            }
            return withId;
        });
        // it can be any of the three types
        this.update(updateIds, newState);
        this.add(newEntities);
        isDev() && logAction('Upsert Entity');
    };
    /**
     *
     * Upsert entity collection (idKey must be present)
     *
     * @example
     *
     * store.upsertMany([ { id: 1 }, { id: 2 }]);
     *
     * store.upsertMany([ { id: 1 }, { id: 2 }], { loading: true  });
     * store.upsertMany([ { id: 1 }, { id: 2 }], { baseClass: Todo  });
     *
     */
    EntityStore.prototype.upsertMany = function (entities, options) {
        var e_1, _a;
        if (options === void 0) { options = {}; }
        var addedIds = [];
        var updatedIds = [];
        var updatedEntities = {};
        try {
            // Update the state directly to optimize performance
            for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
                var entity = entities_1_1.value;
                var withPreCheckHook = this.akitaPreCheckEntity(entity);
                var id = withPreCheckHook[this.idKey];
                if (hasEntity(this.entities, id)) {
                    var prev = this._value().entities[id];
                    var merged = __assign(__assign({}, this._value().entities[id]), withPreCheckHook);
                    var next = options.baseClass ? new options.baseClass(merged) : merged;
                    var withHook = this.akitaPreUpdateEntity(prev, next);
                    var nextId = withHook[this.idKey];
                    updatedEntities[nextId] = withHook;
                    updatedIds.push(nextId);
                }
                else {
                    var newEntity = options.baseClass ? new options.baseClass(withPreCheckHook) : withPreCheckHook;
                    var withHook = this.akitaPreAddEntity(newEntity);
                    var nextId = withHook[this.idKey];
                    addedIds.push(nextId);
                    updatedEntities[nextId] = withHook;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        isDev() && logAction('Upsert Many');
        this._setState(function (state) { return (__assign(__assign({}, state), { ids: addedIds.length ? __spread(state.ids, addedIds) : state.ids, entities: __assign(__assign({}, state.entities), updatedEntities), loading: !!options.loading })); });
        updatedIds.length && this.entityActions.next({ type: EntityActions.Update, ids: updatedIds });
        addedIds.length && this.entityActions.next({ type: EntityActions.Add, ids: addedIds });
        if (addedIds.length && this.hasUIStore()) {
            this.handleUICreation(true);
        }
    };
    /**
     *
     * Replace one or more entities (except the id property)
     *
     *
     * @example
     *
     * this.store.replace(5, newEntity)
     * this.store.replace([1,2,3], newEntity)
     */
    EntityStore.prototype.replace = function (ids, newState) {
        var e_2, _a, _b;
        var toArray = coerceArray(ids);
        if (isEmpty(toArray))
            return;
        var replaced = {};
        try {
            for (var toArray_1 = __values(toArray), toArray_1_1 = toArray_1.next(); !toArray_1_1.done; toArray_1_1 = toArray_1.next()) {
                var id = toArray_1_1.value;
                replaced[id] = __assign(__assign({}, newState), (_b = {}, _b[this.idKey] = id, _b));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (toArray_1_1 && !toArray_1_1.done && (_a = toArray_1.return)) _a.call(toArray_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        isDev() && setAction('Replace Entity', ids);
        this._setState(function (state) { return (__assign(__assign({}, state), { entities: __assign(__assign({}, state.entities), replaced) })); });
    };
    /**
     *
     * Move entity inside the collection
     *
     *
     * @example
     *
     * this.store.move(fromIndex, toIndex)
     */
    EntityStore.prototype.move = function (from, to) {
        var ids = this.ids.slice();
        ids.splice(to < 0 ? ids.length + to : to, 0, ids.splice(from, 1)[0]);
        isDev() && setAction('Move Entity');
        this._setState(function (state) { return (__assign(__assign({}, state), { 
            // Change the entities reference so that selectAll emit
            entities: __assign({}, state.entities), ids: ids })); });
    };
    EntityStore.prototype.remove = function (idsOrFn) {
        var _this = this;
        if (isEmpty(this.ids))
            return;
        var idPassed = isDefined(idsOrFn);
        // null means remove all
        var ids = [];
        if (isFunction(idsOrFn)) {
            ids = this.ids.filter(function (entityId) { return idsOrFn(_this.entities[entityId]); });
        }
        else {
            ids = idPassed ? coerceArray(idsOrFn) : this.ids;
        }
        if (isEmpty(ids))
            return;
        isDev() && setAction('Remove Entity', ids);
        this._setState(function (state) { return removeEntities({ state: state, ids: ids }); });
        if (!idPassed) {
            this.setHasCache(false);
        }
        this.handleUIRemove(ids);
        this.entityActions.next({ type: EntityActions.Remove, ids: ids });
    };
    /**
     *
     * Update the active entity
     *
     * @example
     *
     * this.store.updateActive({ completed: true })
     * this.store.updateActive(active => {
     *   return {
     *     config: {
     *      ..active.config,
     *      date
     *     }
     *   }
     * })
     */
    EntityStore.prototype.updateActive = function (newStateOrCallback) {
        var ids = coerceArray(this.active);
        isDev() && setAction('Update Active', ids);
        this.update(ids, newStateOrCallback);
    };
    EntityStore.prototype.setActive = function (idOrOptions) {
        var active = getActiveEntities(idOrOptions, this.ids, this.active);
        if (active === undefined) {
            return;
        }
        isDev() && setAction('Set Active', active);
        this._setActive(active);
    };
    /**
     * Add active entities
     *
     * @example
     *
     * store.addActive(2);
     * store.addActive([3, 4, 5]);
     */
    EntityStore.prototype.addActive = function (ids) {
        var _this = this;
        var toArray = coerceArray(ids);
        if (isEmpty(toArray))
            return;
        var everyExist = toArray.every(function (id) { return _this.active.indexOf(id) > -1; });
        if (everyExist)
            return;
        isDev() && setAction('Add Active', ids);
        this._setState(function (state) {
            /** Protect against case that one of the items in the array exist */
            var uniques = Array.from(new Set(__spread(state.active, toArray)));
            return __assign(__assign({}, state), { active: uniques });
        });
    };
    /**
     * Remove active entities
     *
     * @example
     *
     * store.removeActive(2)
     * store.removeActive([3, 4, 5])
     */
    EntityStore.prototype.removeActive = function (ids) {
        var _this = this;
        var toArray = coerceArray(ids);
        if (isEmpty(toArray))
            return;
        var someExist = toArray.some(function (id) { return _this.active.indexOf(id) > -1; });
        if (!someExist)
            return;
        isDev() && setAction('Remove Active', ids);
        this._setState(function (state) {
            return __assign(__assign({}, state), { active: Array.isArray(state.active) ? state.active.filter(function (currentId) { return toArray.indexOf(currentId) === -1; }) : null });
        });
    };
    /**
     * Toggle active entities
     *
     * @example
     *
     * store.toggle(2)
     * store.toggle([3, 4, 5])
     */
    EntityStore.prototype.toggleActive = function (ids) {
        var _this = this;
        var toArray = coerceArray(ids);
        var filterExists = function (remove) { return function (id) { return _this.active.includes(id) === remove; }; };
        var remove = toArray.filter(filterExists(true));
        var add = toArray.filter(filterExists(false));
        this.removeActive(remove);
        this.addActive(add);
        isDev() && logAction('Toggle Active');
    };
    /**
     *
     * Create sub UI store for managing Entity's UI state
     *
     * @example
     *
     * export type ProductUI = {
     *   isLoading: boolean;
     *   isOpen: boolean
     * }
     *
     * interface ProductsUIState extends EntityState<ProductUI> {}
     *
     * export class ProductsStore EntityStore<ProductsState, Product> {
     *   ui: EntityUIStore<ProductsUIState, ProductUI>;
     *
     *   constructor() {
     *     super();
     *     this.createUIStore();
     *   }
     *
     * }
     */
    EntityStore.prototype.createUIStore = function (initialState, storeConfig) {
        if (initialState === void 0) { initialState = {}; }
        if (storeConfig === void 0) { storeConfig = {}; }
        var defaults = { name: "UI/" + this.storeName, idKey: this.idKey };
        this.ui = new EntityUIStore(initialState, __assign(__assign({}, defaults), storeConfig));
        return this.ui;
    };
    // @internal
    EntityStore.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.ui instanceof EntityStore) {
            this.ui.destroy();
        }
        this.entityActions.complete();
    };
    // @internal
    EntityStore.prototype.akitaPreUpdateEntity = function (_, nextEntity) {
        return nextEntity;
    };
    // @internal
    EntityStore.prototype.akitaPreAddEntity = function (newEntity) {
        return newEntity;
    };
    // @internal
    EntityStore.prototype.akitaPreCheckEntity = function (newEntity) {
        return newEntity;
    };
    Object.defineProperty(EntityStore.prototype, "ids", {
        get: function () {
            return this._value().ids;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EntityStore.prototype, "entities", {
        get: function () {
            return this._value().entities;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EntityStore.prototype, "active", {
        get: function () {
            return this._value().active;
        },
        enumerable: false,
        configurable: true
    });
    EntityStore.prototype._setActive = function (ids) {
        this._setState(function (state) {
            return __assign(__assign({}, state), { active: ids });
        });
    };
    EntityStore.prototype.handleUICreation = function (add) {
        var _this = this;
        if (add === void 0) { add = false; }
        var ids = this.ids;
        var isFunc = isFunction(this.ui._akitaCreateEntityFn);
        var uiEntities;
        var createFn = function (id) {
            var _a;
            var current = _this.entities[id];
            var ui = isFunc ? _this.ui._akitaCreateEntityFn(current) : _this.ui._akitaCreateEntityFn;
            return __assign((_a = {}, _a[_this.idKey] = current[_this.idKey], _a), ui);
        };
        if (add) {
            uiEntities = this.ids.filter(function (id) { return isUndefined(_this.ui.entities[id]); }).map(createFn);
        }
        else {
            uiEntities = ids.map(createFn);
        }
        add ? this.ui.add(uiEntities) : this.ui.set(uiEntities);
    };
    EntityStore.prototype.hasInitialUIState = function () {
        return this.hasUIStore() && isUndefined(this.ui._akitaCreateEntityFn) === false;
    };
    EntityStore.prototype.handleUIRemove = function (ids) {
        if (this.hasUIStore()) {
            this.ui.remove(ids);
        }
    };
    EntityStore.prototype.hasUIStore = function () {
        return this.ui instanceof EntityUIStore;
    };
    var _a, _b;
    __decorate([
        transaction(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object, Object]),
        __metadata("design:returntype", void 0)
    ], EntityStore.prototype, "upsert", null);
    __decorate([
        transaction(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object]),
        __metadata("design:returntype", void 0)
    ], EntityStore.prototype, "toggleActive", null);
    return EntityStore;
}(Store));
export { EntityStore };
// @internal
var EntityUIStore = /** @class */ (function (_super) {
    __extends(EntityUIStore, _super);
    function EntityUIStore(initialState, storeConfig) {
        if (initialState === void 0) { initialState = {}; }
        if (storeConfig === void 0) { storeConfig = {}; }
        return _super.call(this, initialState, storeConfig) || this;
    }
    /**
     *
     * Set the initial UI entity state. This function will determine the entity's
     * initial state when we call `set()` or `add()`.
     *
     * @example
     *
     * constructor() {
     *   super();
     *   this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
     *   this.createUIStore().setInitialEntityState({ isLoading: false, isOpen: true });
     * }
     *
     */
    EntityUIStore.prototype.setInitialEntityState = function (createFn) {
        this._akitaCreateEntityFn = createFn;
    };
    return EntityUIStore;
}(EntityStore));
export { EntityUIStore };
//# sourceMappingURL=entityStore.js.map