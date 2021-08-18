import { Rule, Tree } from '@angular-devkit/schematics';
import { AppConfig as OriginalAppConfig, CliConfig as OriginalCliConfig } from '@schematics/angular/utility/config';
import { ProjectType, WorkspaceProject, WorkspaceSchema } from './workspace-models';
export interface AppConfig extends OriginalAppConfig {
}
export interface CliConfig extends OriginalCliConfig {
}
export declare function getWorkspacePath(host: Tree): string;
export declare function getWorkspace(host: Tree): WorkspaceSchema;
export declare function addProjectToWorkspace<TProjectType extends ProjectType = ProjectType.Application>(workspace: WorkspaceSchema, name: string, project: WorkspaceProject<TProjectType>): Rule;
export declare function updateWorkspace(workspace: WorkspaceSchema): Rule;
export declare const configPath = "/.angular-cli.json";
export declare function getConfig(host: Tree): CliConfig;
export declare function getAppFromConfig(config: CliConfig, appIndexOrName: string): AppConfig | null;
