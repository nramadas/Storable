"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = buildObservableFromKeyPath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var _lodashArrayLast = require("lodash/array/last");

var _lodashArrayLast2 = _interopRequireDefault(_lodashArrayLast);

var _lodashLangIsPlainObject = require("lodash/lang/isPlainObject");

var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

var _lodashLangIsString = require("lodash/lang/isString");

var _lodashLangIsString2 = _interopRequireDefault(_lodashLangIsString);

// for a given keyPath and base observable, produce another observable that
// represents data at that keyPath

function buildObservableFromKeyPath(baseObservable, keyPath) {
    var currentObservable = baseObservable;
    var alias = (0, _lodashArrayLast2["default"])(keyPath);
    if ((0, _lodashLangIsPlainObject2["default"])(alias)) alias = alias.alias;

    // build an observable that represents data emitted at that keyPath
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function () {
            var key = _step.value;

            if (!(0, _lodashLangIsString2["default"])(key)) return "break";
            currentObservable = currentObservable.map(function (x) {
                return x[key] || null;
            }).filter(function (x) {
                return x !== null;
            }).distinctUntilChanged();
        };

        for (var _iterator = keyPath[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ret = _loop();

            if (_ret === "break") break;
        }

        // alias the data
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return currentObservable.map(function (x) {
        return _defineProperty({}, alias, x);
    });
}

module.exports = exports["default"];