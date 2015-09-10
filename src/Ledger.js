import Rx from "rx";

export default class Ledger {
    constructor(transactions=[]) {
        this.stream = new Rx.ReplaySubject(1);
        this.peek = () => [...transactions];

        this.record = (delta, state) => {
            transactions = transactions.concat([{delta, state}]);
            this.stream.onNext(transactions);
            return this;
        };

        this.revertTo = (index) => {
            transactions = transactions.slice(0, index + 1);
            this.stream.onNext(transactions);
            return this;
        };
    }
}
