import { __extends, __read, __spread } from "tslib";
import { pairwise, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AkitaPlugin } from '../plugin';
import { logAction } from '../../actions';
import { isFunction } from '../../isFunction';
var StateHistoryPlugin = /** @class */ (function (_super) {
    __extends(StateHistoryPlugin, _super);
    function StateHistoryPlugin(query, params, _entityId) {
        if (params === void 0) { params = {}; }
        var _this = _super.call(this, query, {
            resetFn: function () { return _this.clear(); },
        }) || this;
        _this.query = query;
        _this.params = params;
        _this._entityId = _entityId;
        /** Allow skipping an update from outside */
        _this.skip = false;
        _this.history = {
            past: [],
            present: null,
            future: [],
        };
        /** Skip the update when redo/undo */
        _this.skipUpdate = false;
        params.maxAge = !!params.maxAge ? params.maxAge : 10;
        params.comparator = params.comparator || (function () { return true; });
        _this.activate();
        return _this;
    }
    Object.defineProperty(StateHistoryPlugin.prototype, "hasPast$", {
        /**
         * Observable stream representing whether the history plugin has an available past
         *
         */
        get: function () {
            return this._hasPast$;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateHistoryPlugin.prototype, "hasFuture$", {
        /**
         * Observable stream representing whether the history plugin has an available future
         *
         */
        get: function () {
            return this._hasFuture$;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateHistoryPlugin.prototype, "hasPast", {
        get: function () {
            return this.history.past.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateHistoryPlugin.prototype, "hasFuture", {
        get: function () {
            return this.history.future.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StateHistoryPlugin.prototype, "property", {
        get: function () {
            return this.params.watchProperty;
        },
        enumerable: false,
        configurable: true
    });
    /* Updates the hasPast$ hasFuture$ observables*/
    StateHistoryPlugin.prototype.updateHasHistory = function () {
        this.hasFutureSubject.next(this.hasFuture);
        this.hasPastSubject.next(this.hasPast);
    };
    StateHistoryPlugin.prototype.activate = function () {
        var _this = this;
        this.hasPastSubject = new BehaviorSubject(false);
        this._hasPast$ = this.hasPastSubject.asObservable().pipe(distinctUntilChanged());
        this.hasFutureSubject = new BehaviorSubject(false);
        this._hasFuture$ = this.hasFutureSubject.asObservable().pipe(distinctUntilChanged());
        this.history.present = this.getSource(this._entityId, this.property);
        this.subscription = this
            .selectSource(this._entityId, this.property)
            .pipe(pairwise())
            .subscribe(function (_a) {
            var _b = __read(_a, 2), past = _b[0], present = _b[1];
            if (_this.skip) {
                _this.skip = false;
                return;
            }
            /**
             *  comparator: (prev, current) => isEqual(prev, current) === false
             */
            var shouldUpdate = _this.params.comparator(past, present);
            if (!_this.skipUpdate && shouldUpdate) {
                if (_this.history.past.length === _this.params.maxAge) {
                    _this.history.past = _this.history.past.slice(1);
                }
                _this.history.past = __spread(_this.history.past, [past]);
                _this.history.present = present;
                _this.updateHasHistory();
            }
        });
    };
    StateHistoryPlugin.prototype.undo = function () {
        if (this.history.past.length > 0) {
            var _a = this.history, past = _a.past, present = _a.present;
            var previous = past[past.length - 1];
            this.history.past = past.slice(0, past.length - 1);
            this.history.present = previous;
            this.history.future = __spread([present], this.history.future);
            this.update();
        }
    };
    StateHistoryPlugin.prototype.redo = function () {
        if (this.history.future.length > 0) {
            var _a = this.history, past = _a.past, present = _a.present;
            var next = this.history.future[0];
            var newFuture = this.history.future.slice(1);
            this.history.past = __spread(past, [present]);
            this.history.present = next;
            this.history.future = newFuture;
            this.update('Redo');
        }
    };
    StateHistoryPlugin.prototype.jumpToPast = function (index) {
        if (index < 0 || index >= this.history.past.length)
            return;
        var _a = this.history, past = _a.past, future = _a.future, present = _a.present;
        /**
         *
         * const past = [1, 2, 3, 4, 5];
         * const present = 6;
         * const future = [7, 8, 9];
         * const index = 2;
         *
         * newPast = past.slice(0, index) = [1, 2];
         * newPresent = past[index] = 3;
         * newFuture = [...past.slice(index + 1),present, ...future] = [4, 5, 6, 7, 8, 9];
         *
         */
        var newPast = past.slice(0, index);
        var newFuture = __spread(past.slice(index + 1), [present], future);
        var newPresent = past[index];
        this.history.past = newPast;
        this.history.present = newPresent;
        this.history.future = newFuture;
        this.update();
    };
    StateHistoryPlugin.prototype.jumpToFuture = function (index) {
        if (index < 0 || index >= this.history.future.length)
            return;
        var _a = this.history, past = _a.past, future = _a.future, present = _a.present;
        /**
         *
         * const past = [1, 2, 3, 4, 5];
         * const present = 6;
         * const future = [7, 8, 9, 10]
         * const index = 1
         *
         * newPast = [...past, present, ...future.slice(0, index) = [1, 2, 3, 4, 5, 6, 7];
         * newPresent = future[index] = 8;
         * newFuture = futrue.slice(index+1) = [9, 10];
         *
         */
        var newPast = __spread(past, [present], future.slice(0, index));
        var newPresent = future[index];
        var newFuture = future.slice(index + 1);
        this.history.past = newPast;
        this.history.present = newPresent;
        this.history.future = newFuture;
        this.update('Redo');
    };
    /**
     *
     * jump n steps in the past or forward
     *
     */
    StateHistoryPlugin.prototype.jump = function (n) {
        if (n > 0)
            return this.jumpToFuture(n - 1);
        if (n < 0)
            return this.jumpToPast(this.history.past.length + n);
    };
    /**
     * Clear the history
     *
     * @param customUpdateFn Callback function for only clearing part of the history
     *
     * @example
     *
     * stateHistory.clear((history) => {
     *  return {
     *    past: history.past,
     *    present: history.present,
     *    future: []
     *  };
     * });
     */
    StateHistoryPlugin.prototype.clear = function (customUpdateFn) {
        this.history = isFunction(customUpdateFn)
            ? customUpdateFn(this.history)
            : {
                past: [],
                present: null,
                future: [],
            };
        this.updateHasHistory();
    };
    StateHistoryPlugin.prototype.destroy = function (clearHistory) {
        if (clearHistory === void 0) { clearHistory = false; }
        if (clearHistory) {
            this.clear();
        }
        this.subscription.unsubscribe();
    };
    StateHistoryPlugin.prototype.ignoreNext = function () {
        this.skip = true;
    };
    StateHistoryPlugin.prototype.update = function (action) {
        if (action === void 0) { action = 'Undo'; }
        this.skipUpdate = true;
        logAction("@StateHistory - " + action);
        this.updateStore(this.history.present, this._entityId, this.property, true);
        this.updateHasHistory();
        this.skipUpdate = false;
    };
    return StateHistoryPlugin;
}(AkitaPlugin));
export { StateHistoryPlugin };
//# sourceMappingURL=stateHistoryPlugin.js.map