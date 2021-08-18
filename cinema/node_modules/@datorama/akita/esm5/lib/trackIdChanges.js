import { merge, of } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
/**
 * Track id updates of an entity and re-evaluation the query with the changed entity id.
 * Hint: Don't place the operator after other operators in the same pipeline as those will be skipped on
 * re-evaluation. Also, it can't be used with the selection operator, e.g <code>selectEntity(1, e => e.title)</code>
 * @param query The query from which the entity is selected.
 * @example
 *
 *   query.selectEntity(1).pipe(trackIdChanges(query)).subscribe(entity => { ... })
 *
 */
export function trackIdChanges(query) {
    return function (source) { return source.lift(new TrackIdChanges(query)); };
}
var TrackIdChanges = /** @class */ (function () {
    function TrackIdChanges(query) {
        this.query = query;
    }
    TrackIdChanges.prototype.call = function (subscriber, source) {
        var _this = this;
        return source
            .pipe(first(), switchMap(function (entity) {
            var currId = entity[_this.query.__store__.config.idKey];
            var pending = false;
            return merge(of({ newId: undefined, oldId: currId, pending: false }), _this.query.__store__.selectEntityIdChanges$).pipe(
            // the new id must differ form the old id
            filter(function (change) { return change.oldId === currId; }), 
            // extract the current pending state of the id update
            tap(function (change) { return (pending = change.pending); }), 
            // only update the selection query if the id update is already applied to the store
            filter(function (change) { return change.newId !== currId && !pending; }), 
            // build a selection query for the new entity id
            switchMap(function (change) {
                return _this.query
                    .selectEntity((currId = change.newId || currId))
                    // skip undefined value if pending.
                    .pipe(filter(function () { return !pending; }));
            }));
        }))
            .subscribe(subscriber);
    };
    return TrackIdChanges;
}());
//# sourceMappingURL=trackIdChanges.js.map