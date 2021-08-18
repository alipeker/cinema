import { isBrowser } from './root';
// @internal
export var __stores__ = {};
// @internal
export var __queries__ = {};
if (isBrowser) {
    window.$$stores = __stores__;
    window.$$queries = __queries__;
}
//# sourceMappingURL=stores.js.map