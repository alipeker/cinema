import { __read, __spread } from "tslib";
// @internal
export function not(pred) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return !pred.apply(void 0, __spread(args));
    };
}
//# sourceMappingURL=not.js.map