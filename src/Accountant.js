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
        let isTimeTravelling = false;

        const currentIndexStream = new Rx.ReplaySubject(1);
        const isTimeTravellingStream = new Rx.ReplaySubject(1);

        currentIndexStream.startWith(currentIndex);
        isTimeTravellingStream.startWith(isTimeTravelling);

        this.goto = (index) => {
            currentIndex = clamp(index, 0, ledger.peek().length - 1);
            isTimeTravelling = true;
            currentIndexStream.onNext(currentIndex);
            isTimeTravellingStream.onNext(isTimeTravelling);
            inventory.toggleLock(true);
            inventory.set(ledger.peek()[currentIndex].state, true);
        };

        this.rewind = (amount) => this.goto(currentIndex - amount);
        this.fastForward = (amount) => this.goto(currentIndex + amount);

        this.updates = Rx.Observable
            .combineLatest(ledger.updates, currentIndexStream, isTimeTravellingStream)
            .map(([transactions, currentIndex, isTimeTravelling]) =>
                ({transactions, currentIndex, isTimeTravelling}));

        // const forceStreamEmit = new Rx.ReplaySubject(1);
        // let currentIndex = ledger.peek().length - 1;
        // let locked = true;
        //
        // // prime the stream
        // forceStreamEmit.onNext({});
        //
        // this.stream = Rx.Observable
        //     .combineLatest(ledger.stream, forceStreamEmit, (...args) => args)
        //     .map(([transactions]) => {
        //         if (locked) currentIndex = transactions.length - 1;
        //         return {transactions, currentIndex, locked};
        //     });
        //
        //
        //
        // this.pause = () => {
        //     locked = false;
        //     inventory.toggleLock(true);
        //     forceStreamEmit.onNext({});
        // };
        //
        // this.resume = () => {
        //     this.goto(ledger.peek().length, true);
        //     inventory.toggleLock(false, true);
        //     locked = true;
        // };
        //
        // this.commit = () => {
        //     locked = true;
        //     inventory.toggleLock(false);
        //     inventory.set(ledger.peek()[currentIndex].state);
        //     ledger.revertTo(currentIndex);
        // };
    }
}
