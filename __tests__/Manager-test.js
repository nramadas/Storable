// __tests__/Manager-test.js
"use strict";

jest.dontMock("../../Manager.js");
var Inventory = require("../../Inventory");
var Manager = require("../../Manager");
var Store = require("../../Store");
var Rx = require("rx");

describe("Manager", function () {
    it("has an updates stream", function () {
        var i = new Inventory();
        var m = new Manager(i);

        expect(m.updates instanceof Rx.Observable).toBeTruthy();
    });

    it("can record values", function () {
        var i = new Inventory();
        var m = new Manager(i);
        var callback = jest.genMockFunction();

        m.updates.forEach(callback);

        m.record({ foo: "bar" });
        expect(callback.mock.calls[1][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: false,
            transactions: [{ delta: {}, state: {} }, { delta: { foo: "bar" }, state: { foo: "bar" } }]
        });
    });

    it("can pause inventory emission", function () {
        var i = new Inventory();
        var m = new Manager(i);
        var callback = jest.genMockFunction();

        m.updates.forEach(callback);
        m.pause();
        i.set({ foo: "bar" });
        i.set({ boo: "baz" });

        expect(i.peek()).toEqual({});
        expect(callback.mock.calls[1][0]).toEqual({
            currentLedgerIndex: 0,
            isTimeTravelling: true,
            transactions: [{ delta: {}, state: {} }]
        });
    });

    it("can resume inventory emmissions", function () {
        var i = new Inventory();
        var m = new Manager(i);
        var s = new Store(i, m);
        var callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({ foo: "bar" });
        m.pause();
        s.emit({ foo: "baz" });
        s.emit({ boo: "hoo" });

        expect(i.peek()).toEqual({ foo: "bar" });

        m.resume();
        expect(i.peek()).toEqual({ foo: "baz", boo: "hoo" });

        expect(callback.mock.calls[2][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: true,
            transactions: [{
                delta: {},
                state: {}
            }, {
                delta: { foo: "bar" },
                state: { foo: "bar" }
            }]
        });

        expect(callback.mock.calls[4][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: true,
            transactions: [{
                delta: {},
                state: {}
            }, {
                delta: { foo: "bar" },
                state: { foo: "bar" }
            }, {
                delta: { foo: "baz" },
                state: { foo: "baz" }
            }, {
                delta: { boo: "hoo" },
                state: { foo: "baz", boo: "hoo" }
            }]
        });

        expect(callback.mock.calls[5][0]).toEqual({
            currentLedgerIndex: 3,
            isTimeTravelling: false,
            transactions: [{
                delta: {},
                state: {}
            }, {
                delta: { foo: "bar" },
                state: { foo: "bar" }
            }, {
                delta: { foo: "baz" },
                state: { foo: "baz" }
            }, {
                delta: { boo: "hoo" },
                state: { foo: "baz", boo: "hoo" }
            }]
        });
    });

    it("can goto a specific transaction", function () {
        var i = new Inventory();
        var m = new Manager(i);
        var s = new Store(i, m);
        var callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({ foo: "bar" });
        s.emit({ foo: "baz" });
        s.emit({ boo: "hoo" });
        expect(i.peek()).toEqual({ foo: "baz", boo: "hoo" });

        m.goto(1);
        expect(i.peek()).toEqual({ foo: "bar" });

        expect(callback.mock.calls[4][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: true,
            transactions: [{
                delta: {},
                state: {}
            }, {
                delta: { foo: "bar" },
                state: { foo: "bar" }
            }, {
                delta: { foo: "baz" },
                state: { foo: "baz" }
            }, {
                delta: { boo: "hoo" },
                state: { foo: "baz", boo: "hoo" }
            }]
        });
    });

    it("can rewind an fastForward transactions", function () {
        var i = new Inventory();
        var m = new Manager(i);
        var s = new Store(i, m);
        var callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({ foo: "bar" });
        s.emit({ foo: "baz" });
        s.emit({ boo: "hoo" });
        expect(i.peek()).toEqual({ foo: "baz", boo: "hoo" });

        m.rewind(2);
        expect(i.peek()).toEqual({ foo: "bar" });

        m.fastForward(1);
        expect(i.peek()).toEqual({ foo: "baz" });

        expect(callback.mock.calls[5][0]).toEqual({
            currentLedgerIndex: 2,
            isTimeTravelling: true,
            transactions: [{
                delta: {},
                state: {}
            }, {
                delta: { foo: "bar" },
                state: { foo: "bar" }
            }, {
                delta: { foo: "baz" },
                state: { foo: "baz" }
            }, {
                delta: { boo: "hoo" },
                state: { foo: "baz", boo: "hoo" }
            }]
        });
    });

    it("can commit transactions", function () {
        var i = new Inventory();
        var m = new Manager(i);
        var s = new Store(i, m);
        var callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({ foo: "bar" });
        s.emit({ foo: "baz" });
        s.emit({ boo: "hoo" });

        m.goto(1);
        m.commit();

        expect(i.peek()).toEqual({ foo: "bar" });
        expect(callback.mock.calls[5][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: false,
            transactions: [{
                delta: {},
                state: {}
            }, {
                delta: { foo: "bar" },
                state: { foo: "bar" }
            }]
        });
    });
});