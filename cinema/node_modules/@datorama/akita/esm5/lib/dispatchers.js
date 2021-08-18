import { ReplaySubject, Subject } from 'rxjs';
// @internal
export var $$deleteStore = new Subject();
// @internal
export var $$addStore = new ReplaySubject(50, 5000);
// @internal
export var $$updateStore = new Subject();
// @internal
export function dispatchDeleted(storeName) {
    $$deleteStore.next(storeName);
}
// @internal
export function dispatchAdded(storeName) {
    $$addStore.next(storeName);
}
// @internal
export function dispatchUpdate(storeName, action) {
    $$updateStore.next({ storeName: storeName, action: action });
}
//# sourceMappingURL=dispatchers.js.map