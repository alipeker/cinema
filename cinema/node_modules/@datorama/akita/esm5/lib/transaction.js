import { BehaviorSubject, of, Subject } from 'rxjs';
import { logAction } from './actions';
import { tap } from 'rxjs/operators';
// @internal
var transactionFinished = new Subject();
// @internal
var transactionInProcess = new BehaviorSubject(false);
// @internal
export var transactionManager = {
    activeTransactions: 0,
    batchTransaction: null
};
// @internal
export function startBatch() {
    if (!isTransactionInProcess()) {
        transactionManager.batchTransaction = new Subject();
    }
    transactionManager.activeTransactions++;
    transactionInProcess.next(true);
}
// @internal
export function endBatch() {
    if (--transactionManager.activeTransactions === 0) {
        transactionManager.batchTransaction.next(true);
        transactionManager.batchTransaction.complete();
        transactionInProcess.next(false);
        transactionFinished.next(true);
    }
}
// @internal
export function isTransactionInProcess() {
    return transactionManager.activeTransactions > 0;
}
// @internal
export function commit() {
    return transactionManager.batchTransaction ? transactionManager.batchTransaction.asObservable() : of(true);
}
/**
 *  A logical transaction.
 *  Use this transaction to optimize the dispatch of all the stores.
 *  The following code will update the store, BUT  emits only once
 *
 *  @example
 *  applyTransaction(() => {
 *    this.todosStore.add(new Todo(1, title));
 *    this.todosStore.add(new Todo(2, title));
 *  });
 *
 */
export function applyTransaction(action, thisArg) {
    if (thisArg === void 0) { thisArg = undefined; }
    startBatch();
    try {
        return action.apply(thisArg);
    }
    finally {
        logAction('@Transaction');
        endBatch();
    }
}
/**
 *  A logical transaction.
 *  Use this transaction to optimize the dispatch of all the stores.
 *
 *  The following code will update the store, BUT  emits only once.
 *
 *  @example
 *  @transaction
 *  addTodos() {
 *    this.todosStore.add(new Todo(1, title));
 *    this.todosStore.add(new Todo(2, title));
 *  }
 *
 *
 */
export function transaction() {
    return function (target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return applyTransaction(function () {
                return originalMethod.apply(_this, args);
            }, this);
        };
        return descriptor;
    };
}
/**
 *
 * RxJS custom operator that wraps the callback inside transaction
 *
 * @example
 *
 * return http.get().pipe(
 *    withTransaction(response > {
 *      store.setActive(1);
 *      store.update();
 *      store.updateEntity(1, {});
 *    })
 * )
 *
 */
export function withTransaction(next) {
    return function (source) {
        return source.pipe(tap(function (value) { return applyTransaction(function () { return next(value); }); }));
    };
}
//# sourceMappingURL=transaction.js.map