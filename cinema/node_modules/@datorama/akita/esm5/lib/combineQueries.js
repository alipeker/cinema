import { combineLatest } from 'rxjs';
import { auditTime } from 'rxjs/operators';
export function combineQueries(observables) {
    return combineLatest(observables).pipe(auditTime(0));
}
//# sourceMappingURL=combineQueries.js.map