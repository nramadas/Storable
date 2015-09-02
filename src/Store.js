import Rx                           from "rx";
import map                          from "lodash/collection/map";
import reduce                       from "lodash/collection/reduce";
import ensureDataIfNecessary        from "./utils/ensureDataIfNecessary";
import buildObservableFromKeyPath   from "./utils/buildObservableFromKeyPath";

export default class Store {
    constructor(inventory, ledger) {
        /**
         * The arguments to query has several possibilities.
         * 1) Flattened list of arguments: The arguments are cast as an Array
         *    and said Array is taken as the keyPath
         * 2) A flatted list of Arrays: Can be 1 or more Arrays, each Array is
         *    a separate keyPath.
         * In addition, the last argument in each keyPath can be an Object,
         * which maps a list of options. The options are:
         *    alias: <string> how to key the requested data in the dictionary
         *        the observable will emit.
         *    ensure: <function> a method that can be used to ensure certain
         *        data exist.
         */
        this.query = (...args) => {
            let keyPaths = args;

            // if the keyPath is flattened, pack it
            if (!(args[0] instanceof Array)) keyPaths = [args];

            // create an observable for each keyPath. ensure data at that
            // keyPath if the query calls for it.
            const observables = map(keyPaths, (keyPath) => {
                ensureDataIfNecessary(keyPath, inventory, this.emit.bind(this));
                return buildObservableFromKeyPath(inventory.contents, keyPath)
            });

            // combine all the observables into a single observable that has
            // data from all three other observables.
            return Rx.Observable
                .combineLatest(...observables, (...args) => args)
                .map((allData) => {
                    return reduce(allData, (result, data) => {
                        return {
                            ...result,
                            ...data,
                        }
                    }, {});
                });
        };

        this.emit = (newData) => {
            // emit the new data on the inventory
            inventory.set(newData);

            // record the entire entire contents of the inventory
            ledger.record(inventory.peek());
        };
    }
}
