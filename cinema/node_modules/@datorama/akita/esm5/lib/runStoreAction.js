var _a, _b;
import { AkitaError } from './errors';
import { isNil } from './isNil';
import { configKey } from './storeConfig';
import { __stores__ } from './stores';
export var StoreAction;
(function (StoreAction) {
    StoreAction["Update"] = "UPDATE";
})(StoreAction || (StoreAction = {}));
var StoreActionMapping = (_a = {},
    _a[StoreAction.Update] = 'update',
    _a);
export var EntityStoreAction;
(function (EntityStoreAction) {
    EntityStoreAction["Update"] = "UPDATE";
    EntityStoreAction["AddEntities"] = "ADD_ENTITIES";
    EntityStoreAction["SetEntities"] = "SET_ENTITIES";
    EntityStoreAction["UpdateEntities"] = "UPDATE_ENTITIES";
    EntityStoreAction["RemoveEntities"] = "REMOVE_ENTITIES";
    EntityStoreAction["UpsertEntities"] = "UPSERT_ENTITIES";
    EntityStoreAction["UpsertManyEntities"] = "UPSERT_MANY_ENTITIES";
})(EntityStoreAction || (EntityStoreAction = {}));
var EntityStoreActionMapping = (_b = {},
    _b[EntityStoreAction.Update] = 'update',
    _b[EntityStoreAction.AddEntities] = 'add',
    _b[EntityStoreAction.SetEntities] = 'set',
    _b[EntityStoreAction.UpdateEntities] = 'update',
    _b[EntityStoreAction.RemoveEntities] = 'remove',
    _b[EntityStoreAction.UpsertEntities] = 'upsert',
    _b[EntityStoreAction.UpsertManyEntities] = 'upsertMany',
    _b);
/**
 * Get a {@link Store} from the global store registry.
 * @param storeClass The {@link Store} class of the instance to be returned.
 */
export function getStore(storeClass) {
    return getStoreByName(storeClass[configKey]['storeName']);
}
/**
 * Get a {@link Store} from the global store registry.
 * @param storeName The {@link Store} name of the instance to be returned.
 */
export function getStoreByName(storeName) {
    var store = __stores__[storeName];
    if (isNil(store)) {
        throw new AkitaError(store.storeName + " doesn't exist");
    }
    return store;
}
/**
 * Get a {@link EntityStore} from the global store registry.
 * @param storeClass The {@link EntityStore} class of the instance to be returned.
 */
export function getEntityStore(storeClass) {
    return getStore(storeClass);
}
/**
 * Get a {@link EntityStore} from the global store registry.
 * @param storeName The {@link EntityStore} name of the instance to be returned.
 */
export function getEntityStoreByName(storeName) {
    return getStoreByName(storeName);
}
export function runStoreAction(storeClassOrName, action, operation) {
    var store = typeof storeClassOrName === 'string' ? getStoreByName(storeClassOrName) : getStore(storeClassOrName);
    operation(store[StoreActionMapping[action]].bind(store));
}
export function runEntityStoreAction(storeClassOrName, action, operation) {
    var store = typeof storeClassOrName === 'string' ? getEntityStoreByName(storeClassOrName) : getEntityStore(storeClassOrName);
    operation(store[EntityStoreActionMapping[action]].bind(store));
}
//# sourceMappingURL=runStoreAction.js.map