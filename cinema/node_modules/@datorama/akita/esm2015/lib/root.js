export const isBrowser = typeof window !== 'undefined';
export const isNotBrowser = !isBrowser;
// export const isNativeScript = typeof global !== 'undefined' && (<any>global).__runtimeVersion !== 'undefined'; TODO is this used?
export const hasLocalStorage = () => {
    try {
        return typeof localStorage !== 'undefined';
    }
    catch (_a) {
        return false;
    }
};
export const hasSessionStorage = () => {
    try {
        return typeof sessionStorage !== 'undefined';
    }
    catch (_a) {
        return false;
    }
};
//# sourceMappingURL=root.js.map