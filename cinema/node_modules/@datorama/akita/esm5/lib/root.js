export var isBrowser = typeof window !== 'undefined';
export var isNotBrowser = !isBrowser;
// export const isNativeScript = typeof global !== 'undefined' && (<any>global).__runtimeVersion !== 'undefined'; TODO is this used?
export var hasLocalStorage = function () {
    try {
        return typeof localStorage !== 'undefined';
    }
    catch (_a) {
        return false;
    }
};
export var hasSessionStorage = function () {
    try {
        return typeof sessionStorage !== 'undefined';
    }
    catch (_a) {
        return false;
    }
};
//# sourceMappingURL=root.js.map