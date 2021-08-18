import { __assign, __decorate, __extends, __metadata } from "tslib";
import { BehaviorSubject, from, isObservable } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';
import { action, logAction } from '../../actions';
import { isNil } from '../../isNil';
import { isUndefined } from '../../isUndefined';
import { applyTransaction } from '../../transaction';
import { AkitaPlugin } from '../plugin';
var paginatorDefaults = {
    pagesControls: false,
    range: false,
    startWith: 1,
    cacheTimeout: undefined,
    clearStoreWithCache: true,
};
var PaginatorPlugin = /** @class */ (function (_super) {
    __extends(PaginatorPlugin, _super);
    function PaginatorPlugin(query, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, query, {
            resetFn: function () {
                _this.initial = false;
                _this.destroy({ clearCache: true, currentPage: 1 });
            },
        }) || this;
        _this.query = query;
        _this.config = config;
        /** Save current filters, sorting, etc. in cache */
        _this.metadata = new Map();
        _this.pages = new Map();
        _this.pagination = {
            currentPage: 1,
            perPage: 0,
            total: 0,
            lastPage: 0,
            data: [],
        };
        /**
         * When the user navigates to a different page and return
         * we don't want to call `clearCache` on first time.
         */
        _this.initial = true;
        /**
         * Proxy to the query loading
         */
        _this.isLoading$ = _this.query.selectLoading().pipe(delay(0));
        _this.config = __assign(__assign({}, paginatorDefaults), config);
        var _a = _this.config, startWith = _a.startWith, cacheTimeout = _a.cacheTimeout;
        _this.page = new BehaviorSubject(startWith);
        if (isObservable(cacheTimeout)) {
            _this.clearCacheSubscription = cacheTimeout.subscribe(function () { return _this.clearCache(); });
        }
        return _this;
    }
    Object.defineProperty(PaginatorPlugin.prototype, "pageChanges", {
        /**
         * Listen to page changes
         */
        get: function () {
            return this.page.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PaginatorPlugin.prototype, "currentPage", {
        /**
         * Get the current page number
         */
        get: function () {
            return this.pagination.currentPage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PaginatorPlugin.prototype, "isFirst", {
        /**
         * Check if current page is the first one
         */
        get: function () {
            return this.currentPage === 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PaginatorPlugin.prototype, "isLast", {
        /**
         * Check if current page is the last one
         */
        get: function () {
            return this.currentPage === this.pagination.lastPage;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Whether to generate an array of pages for *ngFor
     * [1, 2, 3, 4]
     */
    PaginatorPlugin.prototype.withControls = function () {
        this.config.pagesControls = true;
        return this;
    };
    /**
     * Whether to generate the `from` and `to` keys
     * [1, 2, 3, 4]
     */
    PaginatorPlugin.prototype.withRange = function () {
        this.config.range = true;
        return this;
    };
    /**
     * Set the loading state
     */
    PaginatorPlugin.prototype.setLoading = function (value) {
        if (value === void 0) { value = true; }
        this.getStore().setLoading(value);
    };
    /**
     * Update the pagination object and add the page
     */
    PaginatorPlugin.prototype.update = function (response) {
        this.pagination = response;
        this.addPage(response.data);
    };
    /**
     *
     * Set the ids and add the page to store
     */
    PaginatorPlugin.prototype.addPage = function (data) {
        var _this = this;
        this.pages.set(this.currentPage, { ids: data.map(function (entity) { return entity[_this.getStore().idKey]; }) });
        this.getStore().upsertMany(data);
    };
    /**
     * Clear the cache.
     */
    PaginatorPlugin.prototype.clearCache = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.initial) {
            logAction('@Pagination - Clear Cache');
            if (options.clearStore !== false && (this.config.clearStoreWithCache || options.clearStore)) {
                this.getStore().remove();
            }
            this.pages = new Map();
            this.metadata = new Map();
        }
        this.initial = false;
    };
    PaginatorPlugin.prototype.clearPage = function (page) {
        this.pages.delete(page);
    };
    /**
     * Clear the cache timeout and optionally the pages
     */
    PaginatorPlugin.prototype.destroy = function (_a) {
        var _b = _a === void 0 ? {} : _a, clearCache = _b.clearCache, currentPage = _b.currentPage;
        if (this.clearCacheSubscription) {
            this.clearCacheSubscription.unsubscribe();
        }
        if (clearCache) {
            this.clearCache();
        }
        if (!isUndefined(currentPage)) {
            this.setPage(currentPage);
        }
        this.initial = true;
    };
    /**
     * Whether the provided page is active
     */
    PaginatorPlugin.prototype.isPageActive = function (page) {
        return this.currentPage === page;
    };
    /**
     * Set the current page
     */
    PaginatorPlugin.prototype.setPage = function (page) {
        if (page !== this.currentPage || !this.hasPage(page)) {
            this.page.next((this.pagination.currentPage = page));
        }
    };
    /**
     * Increment current page
     */
    PaginatorPlugin.prototype.nextPage = function () {
        if (this.currentPage !== this.pagination.lastPage) {
            this.setPage(this.pagination.currentPage + 1);
        }
    };
    /**
     * Decrement current page
     */
    PaginatorPlugin.prototype.prevPage = function () {
        if (this.pagination.currentPage > 1) {
            this.setPage(this.pagination.currentPage - 1);
        }
    };
    /**
     * Set current page to last
     */
    PaginatorPlugin.prototype.setLastPage = function () {
        this.setPage(this.pagination.lastPage);
    };
    /**
     * Set current page to first
     */
    PaginatorPlugin.prototype.setFirstPage = function () {
        this.setPage(1);
    };
    /**
     * Check if page exists in cache
     */
    PaginatorPlugin.prototype.hasPage = function (page) {
        return this.pages.has(page);
    };
    /**
     * Get the current page if it's in cache, otherwise invoke the request
     */
    PaginatorPlugin.prototype.getPage = function (req) {
        var _this = this;
        var page = this.pagination.currentPage;
        if (this.hasPage(page)) {
            return this.selectPage(page);
        }
        else {
            this.setLoading(true);
            return from(req()).pipe(switchMap(function (config) {
                page = config.currentPage;
                applyTransaction(function () {
                    _this.setLoading(false);
                    _this.update(config);
                });
                return _this.selectPage(page);
            }));
        }
    };
    PaginatorPlugin.prototype.getQuery = function () {
        return this.query;
    };
    PaginatorPlugin.prototype.refreshCurrentPage = function () {
        if (isNil(this.currentPage) === false) {
            this.clearPage(this.currentPage);
            this.setPage(this.currentPage);
        }
    };
    PaginatorPlugin.prototype.getFrom = function () {
        if (this.isFirst) {
            return 1;
        }
        return (this.currentPage - 1) * this.pagination.perPage + 1;
    };
    PaginatorPlugin.prototype.getTo = function () {
        if (this.isLast) {
            return this.pagination.total;
        }
        return this.currentPage * this.pagination.perPage;
    };
    /**
     * Select the page
     */
    PaginatorPlugin.prototype.selectPage = function (page) {
        var _this = this;
        return this.query.selectAll({ asObject: true }).pipe(take(1), map(function (entities) {
            var response = __assign(__assign({}, _this.pagination), { data: _this.pages.get(page).ids.map(function (id) { return entities[id]; }) });
            var _a = _this.config, range = _a.range, pagesControls = _a.pagesControls;
            /** If no total - calc it */
            if (isNaN(_this.pagination.total)) {
                if (response.lastPage === 1) {
                    response.total = response.data ? response.data.length : 0;
                }
                else {
                    response.total = response.perPage * response.lastPage;
                }
                _this.pagination.total = response.total;
            }
            if (range) {
                response.from = _this.getFrom();
                response.to = _this.getTo();
            }
            if (pagesControls) {
                response.pageControls = generatePages(_this.pagination.total, _this.pagination.perPage);
            }
            return response;
        }));
    };
    __decorate([
        action('@Pagination - New Page'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], PaginatorPlugin.prototype, "update", null);
    return PaginatorPlugin;
}(AkitaPlugin));
export { PaginatorPlugin };
/**
 * Generate an array so we can ngFor them to navigate between pages
 */
function generatePages(total, perPage) {
    var len = Math.ceil(total / perPage);
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(i + 1);
    }
    return arr;
}
/** backward compatibility */
export var Paginator = PaginatorPlugin;
//# sourceMappingURL=paginatorPlugin.js.map