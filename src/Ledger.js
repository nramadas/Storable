export default class Ledger {
    constructor(transactions=[]) {
        this.peek = () => transactions;
        this.record = (transaction) => transactions.push(transaction);
    }
}
