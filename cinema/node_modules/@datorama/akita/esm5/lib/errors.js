import { __extends } from "tslib";
// @internal
var AkitaError = /** @class */ (function (_super) {
    __extends(AkitaError, _super);
    function AkitaError(message) {
        return _super.call(this, message) || this;
    }
    return AkitaError;
}(Error));
export { AkitaError };
// @internal
export function assertStoreHasName(name, className) {
    if (!name) {
        console.error("@StoreConfig({ name }) is missing in " + className);
    }
}
//# sourceMappingURL=errors.js.map