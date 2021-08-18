export var queryConfigKey = 'akitaQueryConfig';
export function QueryConfig(metadata) {
    return function (constructor) {
        constructor[queryConfigKey] = {};
        for (var i = 0, keys = Object.keys(metadata); i < keys.length; i++) {
            var key = keys[i];
            constructor[queryConfigKey][key] = metadata[key];
        }
    };
}
//# sourceMappingURL=queryConfig.js.map