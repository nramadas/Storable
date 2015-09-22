export default class Clerk {
    constructor(store, methods={}) {
        if (!store) {
            throw new Error("A Clerk requires a Store");
            return;
        }

        this.emit = (newData) => store.emit(newData);

        for (let methodName of Object.keys(methods)) {
            this[methodName] = methods[methodName].bind(this);
        }
    }
}
