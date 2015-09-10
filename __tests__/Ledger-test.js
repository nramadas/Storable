// __tests__/Ledger-test.js
"use strict";

jest.dontMock("../../Ledger.js");
var Ledger = require("../../Ledger");

describe("Ledger", function () {
    it("has no transactions to begin with", function () {
        var l = new Ledger();
        expect(l.peek().length).toEqual(0);
    });

    it("pushes a new transaction onto the queue", function () {
        var l = new Ledger();
        l.record({ foo: "bar" }, { foo: "bar" });
        expect(l.peek()).toEqual([{ delta: { foo: "bar" }, state: { foo: "bar" } }]);
    });

    it("can push multiple transactions", function () {
        var l = new Ledger();
        l.record({ foo: "bar" }, { foo: "bar" });
        l.record({ boo: "baz" }, { foo: "bar", boo: "baz" });
        expect(l.peek()).toEqual([{
            delta: { foo: "bar" },
            state: { foo: "bar" }
        }, {
            delta: { boo: "baz" },
            state: { foo: "bar", boo: "baz" }
        }]);
    });

    it("can modify the transaction list", function () {
        var l = new Ledger();
        l.record({ foo: "bar" }, { foo: "bar" });
        l.record({ boo: "baz" }, { foo: "bar", boo: "baz" });
        expect(l.revertTo(0).peek()).toEqual([{ delta: { foo: "bar" }, state: { foo: "bar" } }]);
    });
});