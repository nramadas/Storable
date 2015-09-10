// __tests__/Store-test.js
jest.dontMock("../../Store.js");
const Inventory = require("../../Inventory");
const Ledger = require("../../Ledger");
const Store = require("../../Store");
const Rx = require("rx");

describe("Store", () => {
    it("has a query method", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query).not.toBeUndefined();
    });

    it("returns an observable when query is called", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query("foo") instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable when queried with nested keys", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query("foo", "bar", "boo", "baz") instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable with keys aliased", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query("foo", {alias: "bar"}) instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable with nested keys aliased", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query("foo", "bar", "boo", "baz", {alias: "boom"}) instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable when queried with multiple keypaths", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query(
            ["foo", "bar"],
            ["boo", "baz"]
        ) instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable when queried with multiple keypaths aliased", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);

        expect(s.query(
            ["foo", "bar", {alias: "thing1"}],
            ["boo", "baz", {alias: "thing2"}]
        ) instanceof Rx.Observable).toBeTruthy();
    });

    it("allows data to be emitted and records the result into the ledger", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const callback = jest.genMockFunction();

        s.query("foo").forEach(callback);
        s.emit({foo: "bar"});

        expect(callback.mock.calls[0][0]).toEqual({foo: "bar"});
        expect(l.peek()).toEqual([{delta: {foo: "bar"}, state: {foo: "bar"}}]);
    });

    it("allows multiple values to be emitted at once", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const callback = jest.genMockFunction();

        s.query(
            ["foo", "bar", {alias: "baz"}],
            ["boo", "bad", {alias: "gah"}]
        ).forEach(callback);

        s.emit({foo: {bar: "thing1"}});
        s.emit({boo: {bad: "thing2"}});

        expect(callback.mock.calls[0][0]).toEqual({
            baz: "thing1",
            gah: "thing2"
        });

        expect(l.peek()).toEqual([
            {
                delta: {foo: {bar: "thing1"}},
                state: {foo: {bar: "thing1"}},
            },
            {
                delta: {boo: {bad: "thing2"}},
                state: {
                    foo: {bar: "thing1"},
                    boo: {bad: "thing2"}
                }
            }
        ]);
    });

    it("lets you seed data or ensure data", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const callback = jest.genMockFunction();
        const ensurer = (saveData) => saveData("thing");

        s.query("foo", "bar", {alias: "baz", ensure: ensurer}).forEach(callback);

        expect(callback.mock.calls[0][0]).toEqual({
            baz: "thing"
        });
    });

    it("won't ensure data that already exists", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const ensurer = (saveData) => savaData("thing");

        s.emit({foo: {bar: "baz"}});
        s.query("foo", "bar", {ensure: ensurer});

        expect(i.peek()).toEqual({
            foo: {bar: "baz"}
        });
    });

    it("doesn't emit events on data that does not change", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const callback = jest.genMockFunction();

        s.query("foo", "bar").forEach(callback);
        s.emit({foo: {baz: "thing"}});

        expect(callback).not.toBeCalled();
    });
});
