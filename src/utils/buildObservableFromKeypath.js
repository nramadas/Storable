import Rx               from "rx";
import last             from "lodash/array/last";
import isPlainObject    from "lodash/lang/isPlainObject";
import isString         from "lodash/lang/isString";

// for a given keyPath and base observable, produce another observable that
// represents data at that keyPath
export default function buildObservableFromKeyPath(baseObservable, keyPath) {
    let currentObservable = baseObservable;
    let alias = last(keyPath);
    if (isPlainObject(alias)) alias = alias.alias;

    // build an observable that represents data emitted at that keyPath
    for (let key of keyPath) {
        if (!(isString(key))) break;
        currentObservable = currentObservable
            .map(x => x[key] || null)
            .filter(x => x !== null)
    }

    // alias the data
    return currentObservable
        .map(x => {return {[alias]: x}})
}
