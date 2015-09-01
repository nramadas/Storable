import isPlainObject from "lodash/lang/isPlainObject";
import isNull        from "lodash/lang/isNull";

// return a new object that has keys from a extended with keys from b.
export default function recursiveExtend(a, b) {
    const returnVal = {...a};
    for (let bkey of Object.keys(b)) {
        const value = b[bkey];
        if (isPlainObject(value)) {
            returnVal[bkey] = recursiveExtend(a[bkey] || {}, value);
        } else if (isNull(value)) {
            delete returnVal[bkey];
        } else {
            returnVal[bkey] = value;
        }
    }
    return returnVal;
}
