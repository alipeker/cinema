import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema, WorkspaceTargets } from './workspace-models';
export declare function getProjectTargets(project: WorkspaceProject): WorkspaceTargets;
export declare function getProjectTargets(workspaceOrHost: WorkspaceSchema | Tree, projectName: string): WorkspaceTargets;
export declare function targetBuildNotFoundError(): SchematicsException;
