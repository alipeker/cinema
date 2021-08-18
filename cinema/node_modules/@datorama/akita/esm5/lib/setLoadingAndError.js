import { defer } from 'rxjs';
import { tap } from 'rxjs/operators';
export function setLoadingAndError(store) {
    return function (source) {
        return defer(function () {
            store.setLoading(true);
            store.setError(null);
            return source.pipe(tap({
                error: function (err) {
                    store.setLoading(false);
                    store.setError(err);
                },
                complete: function () {
                    store.setLoading(false);
                },
            }));
        });
    };
}
//# sourceMappingURL=setLoadingAndError.js.map