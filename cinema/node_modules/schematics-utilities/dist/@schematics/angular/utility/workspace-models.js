"use strict";
// Copied from https://github.com/angular/angular-cli/blob/9.1.x/packages/schematics/angular/utility/workspace-models.ts for Angular 10 compatibility.
Object.defineProperty(exports, "__esModule", { value: true });
var ProjectType;
(function (ProjectType) {
    ProjectType["Application"] = "application";
    ProjectType["Library"] = "library";
})(ProjectType = exports.ProjectType || (exports.ProjectType = {}));
var Builders;
(function (Builders) {
    Builders["AppShell"] = "@angular-devkit/build-angular:app-shell";
    Builders["Server"] = "@angular-devkit/build-angular:server";
    Builders["Browser"] = "@angular-devkit/build-angular:browser";
    Builders["Karma"] = "@angular-devkit/build-angular:karma";
    Builders["TsLint"] = "@angular-devkit/build-angular:tslint";
    Builders["NgPackagr"] = "@angular-devkit/build-ng-packagr:build";
    Builders["DevServer"] = "@angular-devkit/build-angular:dev-server";
    Builders["ExtractI18n"] = "@angular-devkit/build-angular:extract-i18n";
    Builders["Protractor"] = "@angular-devkit/build-angular:protractor";
})(Builders = exports.Builders || (exports.Builders = {}));
//# sourceMappingURL=workspace-models.js.map