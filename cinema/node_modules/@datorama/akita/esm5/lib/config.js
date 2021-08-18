import { __assign } from "tslib";
var CONFIG = {
    resettable: false,
    ttl: null,
    producerFn: undefined
};
export function akitaConfig(config) {
    CONFIG = __assign(__assign({}, CONFIG), config);
}
// @internal
export function getAkitaConfig() {
    return CONFIG;
}
export function getGlobalProducerFn() {
    return CONFIG.producerFn;
}
//# sourceMappingURL=config.js.map