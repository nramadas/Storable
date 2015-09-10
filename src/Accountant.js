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
        this.stream = ledger.stream.map(transactions => ({transactions, currentIndex}));

        this.rewind = (amount) => {
            currentIndex = clamp(currentIndex - amount, 0, ledger.peek().length - 1);
            inventory.set(ledger.peek()[currentIndex].state);
        };

        this.fastForward = (amount) => {
            currentIndex = clamp(currentIndex + amount, 0, ledger.peek().length - 1);
            inventory.set(ledger.peek()[currentIndex].state);
        };

        this.commit = () => {
            inventory.set(ledger.peek()[currentIndex].state);
            ledger.revertTo(currentIndex);
        };
    }
}
