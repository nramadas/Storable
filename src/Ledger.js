import Rx from "rx";

export default class Ledger {
    constructor(transactions=[]) {
        this.peek = () => [...transactions];

        this.record = (delta, state) => {
            transactions = transactions.concat([{delta, state}]);
            return this;
        };

        this.revertTo = (index) => {
            transactions = transactions.slice(0, index + 1);
            return this;
        };
    }
}
