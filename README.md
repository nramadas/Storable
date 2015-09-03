# Storable
Storable is an Observable based data store. The store is queried using keyPaths with each query returning an Observable.

## Usage
```es6
const inventory = new Inventory();
const ledger = new Ledger();
const store = new Store(inventory, ledger);
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
const seedFn = (saveData) => {
    saveData("foo");
};

store.query("foo", "bar", {ensure: seedFn});
```
#### Seeding data asynchronously
Useful if the seed data comes from the server
```es6
const seedFn = (saveData) => {
    performServerCall().then(saveData);
}

store.query("foo", "bar", {ensure: seedFn});
```
