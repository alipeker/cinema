export var configKey = 'akitaConfig';
export function StoreConfig(metadata) {
    return function (constructor) {
        constructor[configKey] = { idKey: 'id' };
        for (var i = 0, keys = Object.keys(metadata); i < keys.length; i++) {
            var key = keys[i];
            /* name is preserved read only key */
            if (key === 'name') {
                constructor[configKey]['storeName'] = metadata[key];
            }
            else {
                constructor[configKey][key] = metadata[key];
            }
        }
    };
}
//# sourceMappingURL=storeConfig.js.map