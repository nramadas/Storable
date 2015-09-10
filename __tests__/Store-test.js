// __tests__/Store-test.js
"use strict";

jest.dontMock("../../Store.js");
var Inventory = require("../../Inventory");
var Ledger = require("../../Ledger");
var Store = require("../../Store");
var Rx = require("rx");

describe("Store", function () {
    it("has a query method", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query).not.toBeUndefined();
    });

    it("returns an observable when query is called", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query("foo") instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable when queried with nested keys", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query("foo", "bar", "boo", "baz") instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable with keys aliased", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query("foo", { alias: "bar" }) instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable with nested keys aliased", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query("foo", "bar", "boo", "baz", { alias: "boom" }) instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable when queried with multiple keypaths", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query(["foo", "bar"], ["boo", "baz"]) instanceof Rx.Observable).toBeTruthy();
    });

    it("returns an observable when queried with multiple keypaths aliased", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);

        expect(s.query(["foo", "bar", { alias: "thing1" }], ["boo", "baz", { alias: "thing2" }]) instanceof Rx.Observable).toBeTruthy();
    });

    it("allows data to be emitted and records the result into the ledger", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var callback = jest.genMockFunction();

        s.query("foo").forEach(callback);
        s.emit({ foo: "bar" });

        expect(callback.mock.calls[0][0]).toEqual({ foo: "bar" });
        expect(l.peek()).toEqual([{ delta: { foo: "bar" }, state: { foo: "bar" } }]);
    });

    it("allows multiple values to be emitted at once", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var callback = jest.genMockFunction();

        s.query(["foo", "bar", { alias: "baz" }], ["boo", "bad", { alias: "gah" }]).forEach(callback);

        s.emit({ foo: { bar: "thing1" } });
        s.emit({ boo: { bad: "thing2" } });

        expect(callback.mock.calls[0][0]).toEqual({
            baz: "thing1",
            gah: "thing2"
        });

        expect(l.peek()).toEqual([{
            delta: { foo: { bar: "thing1" } },
            state: { foo: { bar: "thing1" } }
        }, {
            delta: { boo: { bad: "thing2" } },
            state: {
                foo: { bar: "thing1" },
                boo: { bad: "thing2" }
            }
        }]);
    });

    it("lets you seed data or ensure data", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var callback = jest.genMockFunction();
        var ensurer = function ensurer(saveData) {
            return saveData("thing");
        };

        s.query("foo", "bar", { alias: "baz", ensure: ensurer }).forEach(callback);

        expect(callback.mock.calls[0][0]).toEqual({
            baz: "thing"
        });
    });

    it("won't ensure data that already exists", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var ensurer = function ensurer(saveData) {
            return savaData("thing");
        };

        s.emit({ foo: { bar: "baz" } });
        s.query("foo", "bar", { ensure: ensurer });

        expect(i.peek()).toEqual({
            foo: { bar: "baz" }
        });
    });

    it("doesn't emit events on data that does not change", function () {
        var i = new Inventory();
        var l = new Ledger();
        var s = new Store(i, l);
        var callback = jest.genMockFunction();

        s.query("foo", "bar").forEach(callback);
        s.emit({ foo: { baz: "thing" } });

        expect(callback).not.toBeCalled();
    });
});