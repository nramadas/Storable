import Rx               from "rx";
import last             from "lodash/array/last";
import indexOf          from "lodash/array/indexOf";
import slice            from "lodash/array/slice";
import findLast         from "lodash/collection/findLast";
import isPlainObject    from "lodash/lang/isPlainObject";
import clamp            from "./utils/clamp";
import lastFrom         from "./utils/lastFrom";

export default class Accountant {
    constructor(inventory, ledger) {
        const currentIndexChanged = new Rx.ReplaySubject(1);
        let currentIndex = ledger.peek().length - 1;
        let locked = true;

        // prime the stream
        currentIndexChanged.onNext({});

        this.stream = Rx.Observable
            .combineLatest(ledger.stream, currentIndexChanged, (...args) => args)
            .map(([transactions]) => {
                if (locked) currentIndex = transactions.length - 1;
                return {transactions, currentIndex, locked};
            });

        this.goto = (index, newLocked=false) => {
            locked = newLocked;
            currentIndex = clamp(index, 0, ledger.peek().length - 1);
            inventory.toggleLock(true);
            inventory.set(ledger.peek()[currentIndex].state, true);
            currentIndexChanged.onNext({});
        };

        this.rewind = (amount) => this.goto(currentIndex - amount);
        this.fastForward = (amount) => this.goto(currentIndex + amount);

        this.pause = () => {
            locked = false;
            inventory.toggleLock(true);
        };

        this.resume = () => {
            this.goto(ledger.peek().length, true);
            inventory.toggleLock(false, true);
            locked = true;
        };

        this.commit = () => {
            locked = true;
            inventory.toggleLock(false);
            inventory.set(ledger.peek()[currentIndex].state);
            ledger.revertTo(currentIndex);
        };
    }
}
