"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _rx = require("rx");

var _rx2 = _interopRequireDefault(_rx);

var _lodashCollectionMap = require("lodash/collection/map");

var _lodashCollectionMap2 = _interopRequireDefault(_lodashCollectionMap);

var _lodashCollectionReduce = require("lodash/collection/reduce");

var _lodashCollectionReduce2 = _interopRequireDefault(_lodashCollectionReduce);

var _utilsEnsureDataIfNecessary = require("./utils/ensureDataIfNecessary");

var _utilsEnsureDataIfNecessary2 = _interopRequireDefault(_utilsEnsureDataIfNecessary);

var _utilsBuildObservableFromKeyPath = require("./utils/buildObservableFromKeyPath");

var _utilsBuildObservableFromKeyPath2 = _interopRequireDefault(_utilsBuildObservableFromKeyPath);

var Store = function Store(inventory, ledger) {
    var _this = this;

    _classCallCheck(this, Store);

    /**
     * The arguments to query has several possibilities.
     * 1) Flattened list of arguments: The arguments are cast as an Array
     *    and said Array is taken as the keyPath
     * 2) A flatted list of Arrays: Can be 1 or more Arrays, each Array is
     *    a separate keyPath.
     * In addition, the last argument in each keyPath can be an Object,
     * which maps a list of options. The options are:
     *    alias: <string> how to key the requested data in the dictionary
     *        the observable will emit.
     *    ensure: <function> a method that can be used to ensure certain
     *        data exist.
     */
    this.query = function () {
        var _Rx$Observable;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var keyPaths = args;

        // if the keyPath is flattened, pack it
        if (!(args[0] instanceof Array)) keyPaths = [args];

        // create an observable for each keyPath. ensure data at that
        // keyPath if the query calls for it.
        var observables = (0, _lodashCollectionMap2["default"])(keyPaths, function (keyPath) {
            (0, _utilsEnsureDataIfNecessary2["default"])(keyPath, inventory, _this.emit.bind(_this));
            return (0, _utilsBuildObservableFromKeyPath2["default"])(inventory.contents, keyPath);
        });

        // combine all the observables into a single observable that has
        // data from all three other observables.
        return (_Rx$Observable = _rx2["default"].Observable).combineLatest.apply(_Rx$Observable, _toConsumableArray(observables).concat([function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return args;
        }])).map(function (allData) {
            return (0, _lodashCollectionReduce2["default"])(allData, function (result, data) {
                return _extends({}, result, data);
            }, {});
        });
    };

    this.emit = function (newData) {
        // emit the new data on the inventory
        inventory.set(newData);

        // record the entire entire contents of the inventory
        ledger.record(newData, inventory.peek());
    };
};

exports["default"] = Store;
module.exports = exports["default"];