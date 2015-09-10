// __tests__/Ledger-test.js
jest.dontMock("../../bin/Ledger.js");

describe("Ledger", () => {
    it("has no transactions to begin with", () => {
        const Ledger = require("../../bin/Ledger");
        const l = new Ledger();
        expect(l.peek().length).toEqual(0);
    });

    it("pushes a new transaction onto the queue", () => {
        const Ledger = require("../../bin/Ledger");
        const l = new Ledger();
        l.record({foo: "bar"}, {foo: "bar"});
        expect(l.peek()).toEqual([{delta: {foo: "bar"}, state: {foo: "bar"}}]);
    });

    it("can push multiple transactions", () => {
        const Ledger = require("../../bin/Ledger");
        const l = new Ledger();
        l.record({foo: "bar"}, {foo: "bar"});
        l.record({boo: "baz"}, {foo: "bar", boo: "baz"});
        expect(l.peek()).toEqual([
            {
                delta: {foo: "bar"},
                state: {foo: "bar"},
            },
            {
                delta: {boo: "baz"},
                state: {foo: "bar", boo: "baz"},
            },
        ]);
    });

    it("can modify the transaction list", () => {
        const Ledger = require("../../bin/Ledger");
        const l = new Ledger();
        l.record({foo: "bar"}, {foo: "bar"});
        l.record({boo: "baz"}, {foo: "bar", boo: "baz"});
        expect(l.revertTo(0).peek()).toEqual([{delta: {foo: "bar"}, state: {foo: "bar"}}]);
    });
});
