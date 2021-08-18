export var Order;
(function (Order) {
    Order["ASC"] = "asc";
    Order["DESC"] = "desc";
})(Order || (Order = {}));
// @internal
export function compareValues(key, order) {
    if (order === void 0) { order = Order.ASC; }
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }
        var varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
        var varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
        var comparison = 0;
        if (varA > varB) {
            comparison = 1;
        }
        else if (varA < varB) {
            comparison = -1;
        }
        return order == Order.DESC ? comparison * -1 : comparison;
    };
}
//# sourceMappingURL=sort.js.map