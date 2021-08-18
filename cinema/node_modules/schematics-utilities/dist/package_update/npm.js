"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_1 = require("@schematics/update/update/npm");
/**
 * Get the NPM repository's package.json for a package. This is p
 * @param {string} packageName The package name to fetch.
 * @param {string} registryUrl The NPM Registry URL to use.
 * @param {LoggerApi} logger A logger instance to log debug information.
 * @returns An observable that will put the pacakge.json content.
 */
function getNpmPackageJson(packageName, logger, options) {
    return npm_1.getNpmPackageJson(packageName, logger, options);
}
exports.getNpmPackageJson = getNpmPackageJson;
//# sourceMappingURL=npm.js.map