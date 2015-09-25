# Storable
Storable is an Observable based data store. The store is queried using keyPaths with each query returning an Observable.

Storable also comes with a way to step through store state as it changed, allowing the developer to pause state, rewind and fast forward, and even drop any queued state that accumulated when the state was paused.

## To Install
```
npm install storeablejs
```

## Usage
```es6
import Store from "storablejs/Store";

const store = new Store();
```

## Querying for data
#### Single key path
```es6
store.query("foo", "bar").forEach((data) => {
    // data:
    // {
    //     bar: <value>
    // }
});
```
#### Multiple key paths
```es6
store.query(
    ["foo", "bar"],
    ["baz", "hum"]
).forEach((data) => {
    // data:
    // {
    //     bar: <value>,
    //     hum: <value>
    // }
});
```
#### Aliasing key paths
```es6
store.query(
    ["foo", "bar", {alias: "bar1"}],
    ["baz", "bar", {alias: "bar2"}]
).forEach((data) => {
    // data:
    // {
    //     bar1: <value>,
    //     bar2: <value>
    // }
})
```
#### Seeding data
```es6
const seedFn = (writeResult) => {
    writeResult("foo");
};

store.query("foo", "bar", {ensure: seedFn});
```
#### Seeding data asynchronously
Useful if the seed data comes from the server
```es6
const fetchData = (writeResult) => {
    performServerCall().then(writeResult);
}

store.query("foo", "bar", {ensure: fetchData});
```
## Writing Data
```es6
store.emit({
    foo: {
        bar: "baz"
    }
});
// NOTE: data can be deeply nested, even if the keys don't yet exist in the
// Inventory. The keys are created as the data is written.
```

## Using the Manager to step through state
#### Setup
```es6
import Inventory from "storablejs/Inventory";
import Manager   from "storablejs/Manager";
import Store     from "storablejs/Store";

const inventory = new Inventory();
const manager = new Manager(inventory);
const store = new Store(inventory, manager);
```

#### Time-travelling through Store state
```es6
manager.pause();            // Prevent new Store emmisions from changing state.
                            // New state emmissions from the Store are queued.

manager.resume();           // Allows the Store to function as usual. Also, any
                            // queued state will be played.

manager.rewind(n);          // Go back n steps if possible. This will also pause
                            // the manager.

manager.fastForward(n);     // Go forward n steps if possible. This will also
                            // pause the manager.

manager.goto(n);            // Go to a specific state, where 'n' represents the
                            // index of that store state relative to the first
                            // state.

manager.commit();           // Removes any queued state.
```

#### Viewing the contents of the Manager
```es6
manager.updates.forEach((updates) => {
    const {
        currentLedgerIndex, // The index of current state.
        isTimeTravelling,   // Indicates of the manager is paused or not.
        transactions,       // An array of all emitted states.
    } = updates;
};)
```

## Grouping Store methods
It is often useful to group methods that deal with similar slices of data together into a single module. As a convenience, a `Clerk` can be used to help combine multiple modules together.

```es6
import Store from "storablejs/Store";
import Clerk from "storablejs/Clerk";

import storeMethods1 from "./storeMethods1";
import storeMethods2 from "./storeMethods2";

const store = new Store();
const clerk = new Clerk(store, {
    ...storeMethods1,
    ...storeMethods2,
});

clerk.someMethod();
```

The `Clerk` itself has the ability to emit on the `Store`. When creating a module for the `Clerk` to consume, assume that a method called `emit` exists as a property of the module.

The module itself should just export a dictionary of methods. Ex:

```es6
// storeMethods1.js

export default {
    someMethod() {
        this.emit({foo: "bar"});
    },

    someOtherMethod() {
        this.emit(await doSomethingAsyc());
    },
}
```
