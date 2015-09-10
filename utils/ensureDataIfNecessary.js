"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = ensureDataIfNecessary;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodashArrayLast = require("lodash/array/last");

var _lodashArrayLast2 = _interopRequireDefault(_lodashArrayLast);

var _lodashCollectionReduce = require("lodash/collection/reduce");

var _lodashCollectionReduce2 = _interopRequireDefault(_lodashCollectionReduce);

var _lodashLangIsPlainObject = require("lodash/lang/isPlainObject");

var _lodashLangIsPlainObject2 = _interopRequireDefault(_lodashLangIsPlainObject);

var _lodashLangIsEmpty = require("lodash/lang/isEmpty");

var _lodashLangIsEmpty2 = _interopRequireDefault(_lodashLangIsEmpty);

function ensureDataIfNecessary(keyPath, inventory, emitter) {
    var options = (0, _lodashArrayLast2["default"])(keyPath);

    // if there is no ensurer, we don't have to bother doing anything
    if (!((0, _lodashLangIsPlainObject2["default"])(options) && options.ensure)) return;

    // define the callback used by the ensurer to set the data
    var writeResult = function writeResult(result) {
        var data = {};
        var nested = data;
        for (var i = 0; i < keyPath.length; i++) {
            if ((0, _lodashLangIsPlainObject2["default"])(keyPath[i + 1])) {
                // the next key is the options
                nested[keyPath[i]] = result;
                break;
            } else {
                nested[keyPath[i]] = {};
                nested = nested[keyPath[i]];
            }
        }
        emitter(data);
    };

    // only call the ensurer if the data doesn't already exist. if any of the
    // keys in the keyPath produce an undefined value, we consider the data to
    // not exist
    var currentData = inventory.peek();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keyPath[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            // if we get to the end, stop
            if ((0, _lodashLangIsPlainObject2["default"])(key)) break;
            // call the ensurer if needed
            if ((0, _lodashLangIsEmpty2["default"])(currentData[key])) return options.ensure(writeResult, keyPath);
            // keep going
            currentData = currentData[key];
        }

        // if we're at this point, there is nothing left to do.
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
}

module.exports = exports["default"];