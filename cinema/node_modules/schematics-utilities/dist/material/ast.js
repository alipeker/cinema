"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_1 = require("../cdk");
/** Reads file given path and returns TypeScript source file. */
function getSourceFile(host, path) {
    return cdk_1.getSourceFile(host, path);
}
exports.getSourceFile = getSourceFile;
/** Import and add module to root app module. */
function addModuleImportToRootModule(host, moduleName, src, project) {
    return cdk_1.addModuleImportToRootModule(host, moduleName, src, project);
}
exports.addModuleImportToRootModule = addModuleImportToRootModule;
/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
function addModuleImportToModule(host, modulePath, moduleName, src) {
    return cdk_1.addModuleImportToModule(host, modulePath, moduleName, src);
}
exports.addModuleImportToModule = addModuleImportToModule;
//# sourceMappingURL=ast.js.map