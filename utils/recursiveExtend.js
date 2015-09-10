"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = recursiveExtend;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodashLangIsPlainObject = require("lodash/lang/isPlainObject");

var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

var _lodashLangIsNull = require("lodash/lang/isNull");

var _lodashLangIsNull2 = _interopRequireDefault(_lodashLangIsNull);

// return a new object that has keys from a extended with keys from b.

function recursiveExtend(a, b) {
    var returnVal = _extends({}, a);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(b)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var bkey = _step.value;

            var value = b[bkey];
            if ((0, _lodashLangIsPlainObject2["default"])(value)) {
                returnVal[bkey] = recursiveExtend(a[bkey] || {}, value);
            } else if ((0, _lodashLangIsNull2["default"])(value)) {
                delete returnVal[bkey];
            } else {
                returnVal[bkey] = value;
            }
        }
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

    return returnVal;
}

module.exports = exports["default"];