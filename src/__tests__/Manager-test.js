// __tests__/Manager-test.js
jest.dontMock("../../Manager.js");
const Inventory = require("../../Inventory");
const Manager = require("../../Manager");
const Store = require("../../Store");
const Rx = require("rx");

describe("Manager", () => {
    it("has an updates stream", () => {
        const i = new Inventory();
        const m = new Manager(i);

        expect(m.updates instanceof Rx.Observable).toBeTruthy();
    });

    it("can record values", () => {
        const i = new Inventory();
        const m = new Manager(i);
        const callback = jest.genMockFunction();

        m.updates.forEach(callback);

        m.record({foo: "bar"});
        expect(callback.mock.calls[1][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: false,
            transactions: [
                {delta: {}, state: {}},
                {delta: {foo: "bar"}, state: {foo: "bar"}}
            ],
        })
    });

    it("can pause inventory emission", () => {
        const i = new Inventory();
        const m = new Manager(i);
        const callback = jest.genMockFunction();

        m.updates.forEach(callback);
        m.pause();
        i.set({foo: "bar"});
        i.set({boo: "baz"});

        expect(i.peek()).toEqual({});
        expect(callback.mock.calls[1][0]).toEqual({
            currentLedgerIndex: 0,
            isTimeTravelling: true,
            transactions: [{delta: {}, state: {}}],
        });
    });

    it("can resume inventory emmissions", () => {
        const i = new Inventory();
        const m = new Manager(i);
        const s = new Store(i, m);
        const callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({foo: "bar"});
        m.pause();
        s.emit({foo: "baz"});
        s.emit({boo: "hoo"});

        expect(i.peek()).toEqual({foo: "bar"});

        m.resume();
        expect(i.peek()).toEqual({foo: "baz", boo: "hoo"});

        expect(callback.mock.calls[2][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: true,
            transactions: [
                {
                    delta: {},
                    state: {},
                },
                {
                    delta: {foo: "bar"},
                    state: {foo: "bar"},
                },
            ],
        });

        expect(callback.mock.calls[4][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: true,
            transactions: [
                {
                    delta: {},
                    state: {},
                },
                {
                    delta: {foo: "bar"},
                    state: {foo: "bar"},
                },
                {
                    delta: {foo: "baz"},
                    state: {foo: "baz"},
                },
                {
                    delta: {boo: "hoo"},
                    state: {foo: "baz", boo: "hoo"},
                },
            ],
        });

        expect(callback.mock.calls[5][0]).toEqual({
            currentLedgerIndex: 3,
            isTimeTravelling: false,
            transactions: [
                {
                    delta: {},
                    state: {},
                },
                {
                    delta: {foo: "bar"},
                    state: {foo: "bar"},
                },
                {
                    delta: {foo: "baz"},
                    state: {foo: "baz"},
                },
                {
                    delta: {boo: "hoo"},
                    state: {foo: "baz", boo: "hoo"},
                },
            ],
        });
    });

    it("can goto a specific transaction", () => {
        const i = new Inventory();
        const m = new Manager(i);
        const s = new Store(i, m);
        const callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({foo: "bar"});
        s.emit({foo: "baz"});
        s.emit({boo: "hoo"});
        expect(i.peek()).toEqual({foo: "baz", boo: "hoo"});

        m.goto(1);
        expect(i.peek()).toEqual({foo: "bar"});

        expect(callback.mock.calls[4][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: true,
            transactions: [
                {
                    delta: {},
                    state: {},
                },
                {
                    delta: {foo: "bar"},
                    state: {foo: "bar"},
                },
                {
                    delta: {foo: "baz"},
                    state: {foo: "baz"},
                },
                {
                    delta: {boo: "hoo"},
                    state: {foo: "baz", boo: "hoo"},
                },
            ],
        });
    });

    it("can rewind an fastForward transactions", () => {
        const i = new Inventory();
        const m = new Manager(i);
        const s = new Store(i, m);
        const callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({foo: "bar"});
        s.emit({foo: "baz"});
        s.emit({boo: "hoo"});
        expect(i.peek()).toEqual({foo: "baz", boo: "hoo"});

        m.rewind(2);
        expect(i.peek()).toEqual({foo: "bar"});

        m.fastForward(1);
        expect(i.peek()).toEqual({foo: "baz"});

        expect(callback.mock.calls[5][0]).toEqual({
            currentLedgerIndex: 2,
            isTimeTravelling: true,
            transactions: [
                {
                    delta: {},
                    state: {},
                },
                {
                    delta: {foo: "bar"},
                    state: {foo: "bar"},
                },
                {
                    delta: {foo: "baz"},
                    state: {foo: "baz"},
                },
                {
                    delta: {boo: "hoo"},
                    state: {foo: "baz", boo: "hoo"},
                },
            ],
        });
    });

    it("can commit transactions", () => {
        const i = new Inventory();
        const m = new Manager(i);
        const s = new Store(i, m);
        const callback = jest.genMockFunction();

        m.updates.forEach(callback);
        s.emit({foo: "bar"});
        s.emit({foo: "baz"});
        s.emit({boo: "hoo"});

        m.goto(1);
        m.commit();

        expect(i.peek()).toEqual({foo: "bar"});
        expect(callback.mock.calls[5][0]).toEqual({
            currentLedgerIndex: 1,
            isTimeTravelling: false,
            transactions: [
                {
                    delta: {},
                    state: {},
                },
                {
                    delta: {foo: "bar"},
                    state: {foo: "bar"},
                }
            ],
        });
    });
});
