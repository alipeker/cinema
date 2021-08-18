"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk_1 = require("../cdk");
/** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
function appendHtmlElementToHead(host, htmlFilePath, elementHtml) {
    return cdk_1.appendHtmlElementToHead(host, htmlFilePath, elementHtml);
}
exports.appendHtmlElementToHead = appendHtmlElementToHead;
/** Parses the given HTML file and returns the head element if available. */
function getHtmlHeadTagElement(htmlContent) {
    return cdk_1.getHtmlHeadTagElement(htmlContent);
}
exports.getHtmlHeadTagElement = getHtmlHeadTagElement;
//# sourceMappingURL=html-head-element.js.map