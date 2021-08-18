"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@schematics/angular/utility/config");
function getWorkspacePath(host) {
    return config_1.getWorkspacePath(host);
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    return config_1.getWorkspace(host);
}
exports.getWorkspace = getWorkspace;
function addProjectToWorkspace(workspace, name, project) {
    return (host, context) => {
        if (workspace.projects[name]) {
            throw new Error(`Project '${name}' already exists in workspace.`);
        }
        // Add project to workspace.
        workspace.projects[name] = project;
        if (!workspace.defaultProject && Object.keys(workspace.projects).length === 1) {
            // Make the new project the default one.
            workspace.defaultProject = name;
        }
        return updateWorkspace(workspace);
    };
}
exports.addProjectToWorkspace = addProjectToWorkspace;
function updateWorkspace(workspace) {
    return config_1.updateWorkspace(workspace);
}
exports.updateWorkspace = updateWorkspace;
exports.configPath = config_1.configPath;
function getConfig(host) {
    return config_1.getConfig(host);
}
exports.getConfig = getConfig;
function getAppFromConfig(config, appIndexOrName) {
    return config_1.getAppFromConfig(config, appIndexOrName);
}
exports.getAppFromConfig = getAppFromConfig;
//# sourceMappingURL=config.js.map