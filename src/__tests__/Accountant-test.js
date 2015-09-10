// __tests__/Accountant-test.js
jest.dontMock("../../bin/Accountant.js");
const Inventory = require("../../bin/Inventory");
const Ledger = require("../../bin/Ledger");
const Store = require("../../bin/Store");
const Accountant = require("../../bin/Accountant");

describe("Accountant", () => {
    it("has rewind and fastForward methods", () => {
        const i = new Inventory();
        const l = new Ledger();
        const a = new Accountant(i, l);

        expect(a.rewind).not.toBeUndefined();
        expect(a.fastForward).not.toBeUndefined();
    });

    it("can rewind a single ledger", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const a = new Accountant(i, l);
        const callback = jest.genMockFunction();

        s.query("foo", "bar").forEach(callback);
        s.emit({foo: {bar: "thing1"}});
        s.emit({foo: {bar: "thing2"}});
        a.rewind(1);

        expect(callback.mock.calls[2][0]).toEqual({bar: "thing1"});
    });

    it("can commit the current state to the ledger", () => {
        const i = new Inventory();
        const l = new Ledger();
        const s = new Store(i, l);
        const a = new Accountant(i, l);

        s.emit({foo: {bar: "thing1"}});
        s.emit({foo: {bar: "thing2"}});
        a.rewind(1);
        a.commit();

        expect(l.peek()).toEqual([{delta: {foo: {bar: "thing1"}}, state: {foo: {bar: "thing1"}}}]);
    });
});
