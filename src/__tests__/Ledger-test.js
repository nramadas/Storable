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
        l.record({foo: "bar"});
        expect(l.peek()).toEqual([{foo: "bar"}]);
    });

    it("can push multiple transactions", () => {
        const Ledger = require("../../bin/Ledger");
        const l = new Ledger();
        l.record({foo: "bar"});
        l.record({boo: "baz"});
        expect(l.peek()).toEqual([{foo: "bar"}, {boo: "baz"}]);
    });
});
