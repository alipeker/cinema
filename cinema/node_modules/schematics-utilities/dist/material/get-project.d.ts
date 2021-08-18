import { WorkspaceSchema } from '../angular';
/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
export declare function getProjectFromWorkspace(workspace: WorkspaceSchema, projectName?: string): import("@angular-devkit/core/src/experimental/workspace").WorkspaceProject;
