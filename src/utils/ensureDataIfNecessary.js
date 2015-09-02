import last             from "lodash/array/last";
import reduce           from "lodash/collection/reduce";
import isPlainObject    from "lodash/lang/isPlainObject";
import isEmpty          from "lodash/lang/isEmpty";

export default function ensureDataIfNecessary(keyPath, inventory, emitter) {
    const options = last(keyPath);

    // if there is no ensurer, we don't have to bother doing anything
    if (!(isPlainObject(options) && options.ensure)) return;

    // define the callback used by the ensurer to set the data
    const saveData = (results) => {
        const data = {};
        let nested = data;
        for (let i = 0; i < keyPath.length; i++) {
            if (isPlainObject(keyPath[i+1])) { // the next key is the options
                nested[keyPath[i]] = results;
                break;
            } else {
                nested[keyPath[i]] = {};
                nested = nested[keyPath[i]];
            }
        }
        emitter(data);
    }

    // only call the ensurer if the data doesn't already exist. if any of the
    // keys in the keyPath produce an undefined value, we consider the data to
    // not exist
    let currentData = inventory.peek();
    for (let key of keyPath) {
        // if we get to the end, stop
        if (isPlainObject(key)) break;
        // call the ensurer if needed
        if (isEmpty(currentData[key])) return options.ensure(saveData, keyPath);
        // keep going
        currentData = currentData[key];
    }

    // if we're at this point, there is nothing left to do.
}
