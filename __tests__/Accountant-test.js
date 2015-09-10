// __tests__/Accountant-test.js
"use strict";

jest.dontMock("../../Accountant.js");
var Inventory = require("../../Inventory");
var Ledger = require("../../Ledger");
var Store = require("../../Store");
var Accountant = require("../../Accountant");

describe("Accountant", function () {
    it("has rewind and fastForward methods", function () {
        var i = new Inventory();
        var l = new Ledger();
        var a = new Accountant(i, l);

        expect(a.rewind).not.toBeUndefined();
        expect(a.fastForward).not.toBeUndefined();
    });

    it("can rewind a single ledger", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var a = new Accountant(i, l);
        var callback = jest.genMockFunction();

        s.query("foo", "bar").forEach(callback);
        s.emit({ foo: { bar: "thing1" } });
        s.emit({ foo: { bar: "thing2" } });
        a.rewind(1);

        expect(callback.mock.calls[2][0]).toEqual({ bar: "thing1" });
    });

    it("can commit the current state to the ledger", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var a = new Accountant(i, l);

        s.emit({ foo: { bar: "thing1" } });
        s.emit({ foo: { bar: "thing2" } });
        a.rewind(1);
        a.commit();

        expect(l.peek()).toEqual([{
            delta: { foo: { bar: "thing1" } },
            state: { foo: { bar: "thing1" } }
        }]);
    });
});