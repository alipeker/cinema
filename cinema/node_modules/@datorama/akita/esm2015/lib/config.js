let CONFIG = {
    resettable: false,
    ttl: null,
    producerFn: undefined
};
export function akitaConfig(config) {
    CONFIG = Object.assign(Object.assign({}, CONFIG), config);
}
// @internal
export function getAkitaConfig() {
    return CONFIG;
}
export function getGlobalProducerFn() {
    return CONFIG.producerFn;
}
//# sourceMappingURL=config.js.map