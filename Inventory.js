"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var _utilsRecursiveExtend = require("./utils/recursiveExtend");

var _utilsRecursiveExtend2 = _interopRequireDefault(_utilsRecursiveExtend);

var Inventory = function Inventory() {
    var _this = this;

    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Inventory);

    var locked = false;
    this.contents = new _rx2["default"].ReplaySubject(1);
    this.contents.forEach(function (newState) {
        return state = newState;
    });
    this.toggleLock = function (newLock) {
        return locked = newLock;
    };
    this.peek = function () {
        return _extends({}, state);
    };
    this.set = function (newState) {
        return !locked && _this.contents.onNext((0, _utilsRecursiveExtend2["default"])(state, newState));
    };
    this.forceSet = function (newState) {
        return _this.contents.onNext(newState);
    };
};

exports["default"] = Inventory;
module.exports = exports["default"];