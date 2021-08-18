"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ng_module_imports_1 = require("../ast/ng-module-imports");
/**
 * Whether the Angular module in the given path imports the specified module class name.
 */
function hasNgModuleImport(tree, modulePath, className) {
    return ng_module_imports_1.hasNgModuleImport(tree, modulePath, className);
}
exports.hasNgModuleImport = hasNgModuleImport;
//# sourceMappingURL=ng-module-imports.js.map