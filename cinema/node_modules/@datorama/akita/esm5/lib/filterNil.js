import { filter } from 'rxjs/operators';
/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNil)
 * @deprecated Use the operator function filterNilValue()
 */
export var filterNil = function (source) {
    return source.pipe(filter(function (value) { return value !== null && typeof value !== 'undefined'; }));
};
/**
 * @example
 *
 * query.selectEntity(2).pipe(filterNilValue())
 */
export function filterNilValue() {
    return filter(function (value) { return value !== null && value !== undefined; });
}
//# sourceMappingURL=filterNil.js.map