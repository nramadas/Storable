"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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

    var currentIndexChanged = new _rx2["default"].ReplaySubject(1);
    var currentIndex = ledger.peek().length - 1;
    var locked = true;

    // prime the stream
    currentIndexChanged.onNext({});

    this.stream = _rx2["default"].Observable.combineLatest(ledger.stream, currentIndexChanged, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args;
    }).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1);

        var transactions = _ref2[0];

        if (locked) currentIndex = transactions.length - 1;
        return { transactions: transactions, currentIndex: currentIndex };
    });

    this.goto = function (index) {
        locked = false;
        currentIndex = (0, _utilsClamp2["default"])(index, 0, ledger.peek().length - 1);
        inventory.toggleLock(true);
        inventory.set(ledger.peek()[currentIndex].state, true);
        currentIndexChanged.onNext({});
    };

    this.rewind = function (amount) {
        return _this.goto(currentIndex - amount);
    };
    this.fastForward = function (amount) {
        return _this.goto(currentIndex + amount);
    };

    this.pause = function () {
        locked = false;
        inventory.toggleLock(true);
    };

    this.resume = function () {
        _this.goto(ledger.peek().length);
        inventory.toggleLock(false);
        locked = true;
    };

    this.commit = function () {
        inventory.toggleLock(false);
        inventory.set(ledger.peek()[currentIndex].state);
        ledger.revertTo(currentIndex);
        locked = true;
    };
};

exports["default"] = Accountant;
module.exports = exports["default"];