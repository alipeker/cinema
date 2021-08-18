"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_targets_1 = require("@schematics/angular/utility/project-targets");
const project_1 = require("./project");
function getProjectTargets(projectOrHost, projectName = '') {
    const project = project_1.isWorkspaceProject(projectOrHost) ? projectOrHost : project_1.getProject(projectOrHost, projectName);
    const projectTargets = project.targets || project.architect;
    if (!projectTargets) {
        throw new Error('Project target not found.');
    }
    return projectTargets;
}
exports.getProjectTargets = getProjectTargets;
function targetBuildNotFoundError() {
    return project_targets_1.targetBuildNotFoundError();
}
exports.targetBuildNotFoundError = targetBuildNotFoundError;
//# sourceMappingURL=project-targets.js.map