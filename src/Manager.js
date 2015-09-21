import Rx           from "rx";
import Ledger       from "./Ledger";
import Inventory    from "./Inventory";
import clamp        from "./utils/clamp";

const writeData = (delta, inventory, ledger) => {
    inventory.set(delta);
    ledger.record(delta, inventory.peek());
}

export default class Manager {
    constructor(inventory) {
        if (!inventory) {
            throw new Error("The Manager requires an inventory");
            return;
        }

        const ledger = new Ledger();
        const privateInventory = new Inventory(inventory.peek());
        let currentLedgerIndex = -1;
        let isTimeTravelling = false;

        this.updates = new Rx.ReplaySubject(1);

        const sendUpdate = () => this.updates.onNext({
            currentLedgerIndex,
            isTimeTravelling,
            transactions: ledger.peek()
        });

        this.goto = (index) => {
            currentLedgerIndex = clamp(index, 0, ledger.peek().length - 1);
            isTimeTravelling = true;
            inventory.toggleLock(true);
            inventory.forceSet(ledger.peek()[currentLedgerIndex].state, true);
            sendUpdate();
        };

        this.pause = () => {
            inventory.toggleLock(true);
            isTimeTravelling = true;
            sendUpdate();
        };

        this.resume = () => {
            inventory.toggleLock(false);
            inventory.set(privateInventory.peek());
            isTimeTravelling = false;
            currentLedgerIndex = ledger.peek().length - 1;
            sendUpdate();
        };

        this.record = (delta) => {
            writeData(delta, privateInventory, ledger);
            if (!isTimeTravelling) currentLedgerIndex++;
            sendUpdate();
        };

        this.rewind = (amount) => this.goto(currentLedgerIndex - amount);
        this.fastForward = (amount) => this.goto(currentLedgerIndex + amount);

        // prime the ledger
        this.record({});
    }
}
