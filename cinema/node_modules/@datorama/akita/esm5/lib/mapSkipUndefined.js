// @internal
export function mapSkipUndefined(arr, callbackFn) {
    return arr.reduce(function (result, value, index, array) {
        var val = callbackFn(value, index, array);
        if (val !== undefined) {
            result.push(val);
        }
        return result;
    }, []);
}
//# sourceMappingURL=mapSkipUndefined.js.map