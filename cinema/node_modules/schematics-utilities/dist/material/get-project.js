"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_1 = require("../cdk");
/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
function getProjectFromWorkspace(workspace, projectName) {
    return cdk_1.getProjectFromWorkspace(workspace, projectName);
}
exports.getProjectFromWorkspace = getProjectFromWorkspace;
//# sourceMappingURL=get-project.js.map