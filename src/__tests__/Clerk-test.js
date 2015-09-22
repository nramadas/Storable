// __tests__/Clerk-test.js
jest.dontMock("../../Clerk.js");
const Inventory = require("../../Inventory");
const Store = require("../../Store");
const Clerk = require("../../Clerk");

describe("Clerk", () => {
    it("has an emit method", () => {
        const i = new Inventory();
        const s = new Store(i);
        const c = new Clerk(s);

        expect(c.emit).not.toBeUndefined();
    });

    it("can accept methods", () => {
        const i = new Inventory();
        const s = new Store(i);
        const c = new Clerk(s, {
            foo() {},
        });

        expect(c.foo).not.toBeUndefined();
    });

    it("can use the accepted methods to emit onto the store", () => {
        const i = new Inventory();
        const s = new Store(i);
        const c = new Clerk(s, {
            foo() {
                this.emit({foo: "bar"});
            },
        });

        c.foo();

        expect(i.peek()).toEqual({foo: "bar"});
    });
});
