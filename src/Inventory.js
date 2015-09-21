import Rx               from "rx";
import recursiveExtend  from "./utils/recursiveExtend";

export default class Inventory {
    constructor(state={}) {
        let locked = false;
        this.contents = new Rx.ReplaySubject(1);
        this.contents.forEach(newState => state = newState);
        this.toggleLock = (newLock) => locked = newLock;
        this.peek = () => ({...state});
        this.set = (newState) => !locked && this.contents.onNext(recursiveExtend(state, newState));
        this.forceSet = (newState) => this.contents.onNext(newState);
    }
}
