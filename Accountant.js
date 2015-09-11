"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var _lodashArrayLast = require("lodash/array/last");

var _lodashArrayLast2 = _interopRequireDefault(_lodashArrayLast);

var _lodashArrayIndexOf = require("lodash/array/indexOf");

var _lodashArrayIndexOf2 = _interopRequireDefault(_lodashArrayIndexOf);

var _lodashArraySlice = require("lodash/array/slice");

var _lodashArraySlice2 = _interopRequireDefault(_lodashArraySlice);

var _lodashCollectionFindLast = require("lodash/collection/findLast");

var _lodashCollectionFindLast2 = _interopRequireDefault(_lodashCollectionFindLast);

var _lodashLangIsPlainObject = require("lodash/lang/isPlainObject");

var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

var _utilsClamp = require("./utils/clamp");

var _utilsClamp2 = _interopRequireDefault(_utilsClamp);

var _utilsLastFrom = require("./utils/lastFrom");

var _utilsLastFrom2 = _interopRequireDefault(_utilsLastFrom);

var Accountant = function Accountant(inventory, ledger) {
    var _this = this;

    _classCallCheck(this, Accountant);

    var currentIndex = ledger.peek().length - 1;
    var locked = true;

    this.stream = ledger.stream.map(function (transactions) {
        if (locked) currentIndex = transactions.length - 1;
        return { transactions: transactions, currentIndex: currentIndex };
    });

    this.goto = function (index) {
        locked = false;
        currentIndex = (0, _utilsClamp2["default"])(index, 0, ledger.peek().length - 1);
        inventory.set(ledger.peek()[currentIndex].state);
    };

    this.rewind = function (amount) {
        return _this.goto(currentIndex - amount);
    };
    this.fastForward = function (amount) {
        return _this.goto(currentIndex + amount);
    };

    this.commit = function () {
        inventory.set(ledger.peek()[currentIndex].state);
        ledger.revertTo(currentIndex);
        locked = true;
    };
};

exports["default"] = Accountant;
module.exports = exports["default"];