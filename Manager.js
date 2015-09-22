"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var _Ledger = require("./Ledger");

var _Ledger2 = _interopRequireDefault(_Ledger);

var _Inventory = require("./Inventory");

var _Inventory2 = _interopRequireDefault(_Inventory);

var _utilsClamp = require("./utils/clamp");

var _utilsClamp2 = _interopRequireDefault(_utilsClamp);

var writeData = function writeData(delta, inventory, ledger) {
    inventory.set(delta);
    ledger.record(delta, inventory.peek());
};

var Manager = function Manager(inventory) {
    var _this = this;

    _classCallCheck(this, Manager);

    if (!inventory) {
        throw new Error("The Manager requires an inventory");
        return;
    }

    var ledger = new _Ledger2["default"]();
    var privateInventory = new _Inventory2["default"](inventory.peek());
    var currentLedgerIndex = -1;
    var isTimeTravelling = false;

    this.updates = new _rx2["default"].ReplaySubject(1);

    var sendUpdate = function sendUpdate() {
        return _this.updates.onNext({
            currentLedgerIndex: currentLedgerIndex,
            isTimeTravelling: isTimeTravelling,
            transactions: ledger.peek()
        });
    };

    this.goto = function (index) {
        currentLedgerIndex = (0, _utilsClamp2["default"])(index, 0, ledger.peek().length - 1);
        isTimeTravelling = true;
        inventory.toggleLock(true);
        inventory.forceSet(ledger.peek()[currentLedgerIndex].state);
        sendUpdate();
    };

    this.pause = function () {
        inventory.toggleLock(true);
        isTimeTravelling = true;
        sendUpdate();
    };

    this.resume = function () {
        inventory.toggleLock(false);
        inventory.set(privateInventory.peek());
        isTimeTravelling = false;
        currentLedgerIndex = ledger.peek().length - 1;
        sendUpdate();
    };

    this.record = function (delta) {
        writeData(delta, privateInventory, ledger);
        if (!isTimeTravelling) currentLedgerIndex++;
        sendUpdate();
    };

    this.commit = function () {
        isTimeTravelling = false;
        inventory.toggleLock(false);
        inventory.forceSet(ledger.peek()[currentLedgerIndex].state);
        ledger.revertTo(currentLedgerIndex);
        sendUpdate();
    };

    this.rewind = function (amount) {
        return _this.goto(currentLedgerIndex - amount);
    };
    this.fastForward = function (amount) {
        return _this.goto(currentLedgerIndex + amount);
    };

    // prime the ledger
    this.record({});
};

exports["default"] = Manager;
module.exports = exports["default"];