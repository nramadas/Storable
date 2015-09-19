// __tests__/Inventory-test.js
"use strict";

jest.dontMock("../../Inventory.js");
var Inventory = require("../../Inventory");

describe("Inventory", function () {
    it("emits events when data is set", function () {
        var i = new Inventory();
        var callback = jest.genMockFunction();
        i.contents.forEach(callback);

        i.set({ foo: "bar" });
        expect(callback.mock.calls[0][0]).toEqual({ foo: "bar" });
    });

    it("lets you peek at the current data set", function () {
        var i = new Inventory();
        i.set({ foo: "bar" });
        expect(i.peek()).toEqual({ foo: "bar" });
    });

    it("correctly extends data when new state is passed in", function () {
        var i = new Inventory();
        var callback = jest.genMockFunction();
        i.contents.forEach(callback);

        i.set({ foo: "bar" });
        i.set({ bar: "baz" });
        i.set({ whiz: { fizz: "heyo" } });

        expect(callback.mock.calls[0][0]).toEqual({
            foo: "bar"
        });

        expect(callback.mock.calls[1][0]).toEqual({
            foo: "bar",
            bar: "baz"
        });

        expect(callback.mock.calls[2][0]).toEqual({
            foo: "bar",
            bar: "baz",
            whiz: {
                fizz: "heyo"
            }
        });
    });

    it("deletes keys when its value is null", function () {
        var i = new Inventory();
        var callback = jest.genMockFunction();
        i.contents.forEach(callback);

        i.set({
            foo: {
                boo: {
                    doo: "1",
                    zoo: "2"
                }
            },
            bar: 3
        });

        i.set({
            foo: {
                boo: {
                    doo: null
                }
            }
        });

        i.set({
            bar: null
        });

        expect(callback.mock.calls[0][0]).toEqual({
            foo: {
                boo: {
                    doo: "1",
                    zoo: "2"
                }
            },
            bar: 3
        });

        expect(callback.mock.calls[1][0]).toEqual({
            foo: {
                boo: {
                    zoo: "2"
                }
            },
            bar: 3
        });

        expect(callback.mock.calls[2][0]).toEqual({
            foo: {
                boo: {
                    zoo: "2"
                }
            }
        });
    });

    it("can be locked", function () {
        var i = new Inventory();
        i.set({ foo: "bar" });
        expect(i.peek()).toEqual({ foo: "bar" });
        i.toggleLock(true);
        i.set({ foo: "baz" });
        expect(i.peek()).toEqual({ foo: "bar" });
    });
});