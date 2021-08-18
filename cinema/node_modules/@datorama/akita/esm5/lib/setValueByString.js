import { __assign } from "tslib";
import { isObject } from './isObject';
/**
 * @internal
 *
 * @example
 * setValue(state, 'todos.ui', { filter: {} })
 */
export function setValue(obj, prop, val, replace) {
    if (replace === void 0) { replace = false; }
    var split = prop.split('.');
    if (split.length === 1) {
        return __assign(__assign({}, obj), val);
    }
    obj = __assign({}, obj);
    var lastIndex = split.length - 2;
    var removeStoreName = prop.split('.').slice(1);
    removeStoreName.reduce(function (acc, part, index) {
        if (index !== lastIndex) {
            acc[part] = __assign({}, acc[part]);
            return acc && acc[part];
        }
        acc[part] = replace || Array.isArray(acc[part]) || !isObject(acc[part]) ? val : __assign(__assign({}, acc[part]), val);
        return acc && acc[part];
    }, obj);
    return obj;
}
//# sourceMappingURL=setValueByString.js.map