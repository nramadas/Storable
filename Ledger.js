"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var Ledger = function Ledger() {
    var _this = this;

    var transactions = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Ledger);

    this.peek = function () {
        return [].concat(_toConsumableArray(transactions));
    };

    this.record = function (delta, state) {
        transactions = transactions.concat([{ delta: delta, state: state }]);
        return _this;
    };

    this.revertTo = function (index) {
        transactions = transactions.slice(0, index + 1);
        return _this;
    };
};

exports["default"] = Ledger;
module.exports = exports["default"];