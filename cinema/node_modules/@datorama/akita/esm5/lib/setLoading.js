import { defer } from 'rxjs';
import { finalize } from 'rxjs/operators';
export function setLoading(store) {
    return function (source) {
        return defer(function () {
            store.setLoading(true);
            return source.pipe(finalize(function () { return store.setLoading(false); }));
        });
    };
}
//# sourceMappingURL=setLoading.js.map