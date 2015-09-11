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
        let currentIndex = ledger.peek().length - 1;
        let locked = true;

        this.stream = ledger.stream.map(transactions => {
            if (locked) currentIndex = transactions.length - 1;
            return {transactions, currentIndex};
        });

        this.goto = (index) => {
            locked = false;
            currentIndex = clamp(index, 0, ledger.peek().length - 1);
            inventory.set(ledger.peek()[currentIndex].state);
        };

        this.rewind = (amount) => this.goto(currentIndex - amount);
        this.fastForward = (amount) => this.goto(currentIndex + amount);

        this.commit = () => {
            inventory.set(ledger.peek()[currentIndex].state);
            ledger.revertTo(currentIndex);
            locked = true;
        };
    }
}
