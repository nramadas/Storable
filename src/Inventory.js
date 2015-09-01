import Rx               from "rx";
import recursiveExtend  from "./utils/recursiveExtend";

export default class Inventory {
    constructor(state={}) {
        this.contents = new Rx.ReplaySubject(1);
        this.contents.forEach(newState => state = newState);
        this.set = (newState) => this.contents.onNext(recursiveExtend(state, newState));
    }
}
