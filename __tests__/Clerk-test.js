// __tests__/Clerk-test.js
"use strict";

jest.dontMock("../../Clerk.js");
var Inventory = require("../../Inventory");
var Store = require("../../Store");
var Clerk = require("../../Clerk");

describe("Clerk", function () {
    it("has an emit method", function () {
        var i = new Inventory();
        var s = new Store(i);
        var c = new Clerk(s);

        expect(c.emit).not.toBeUndefined();
    });

    it("can accept methods", function () {
        var i = new Inventory();
        var s = new Store(i);
        var c = new Clerk(s, {
            foo: function foo() {}
        });

        expect(c.foo).not.toBeUndefined();
    });

    it("can use the accepted methods to emit onto the store", function () {
        var i = new Inventory();
        var s = new Store(i);
        var c = new Clerk(s, {
            foo: function foo() {
                this.emit({ foo: "bar" });
            }
        });

        c.foo();

        expect(i.peek()).toEqual({ foo: "bar" });
    });
});