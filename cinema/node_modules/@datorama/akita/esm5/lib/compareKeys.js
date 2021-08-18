import { isFunction } from './isFunction';
export function compareKeys(keysOrFuncs) {
    return function (prevState, currState) {
        var isFns = isFunction(keysOrFuncs[0]);
        // Return when they are NOT changed
        return keysOrFuncs.some(function (keyOrFunc) {
            if (isFns) {
                return keyOrFunc(prevState) !== keyOrFunc(currState);
            }
            return prevState[keyOrFunc] !== currState[keyOrFunc];
        }) === false;
    };
}
//# sourceMappingURL=compareKeys.js.map