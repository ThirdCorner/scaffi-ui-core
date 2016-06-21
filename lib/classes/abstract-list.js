'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractList = function () {
    function AbstractList(NgTableParams, $scope) {
        var _this = this;

        (0, _classCallCheck3.default)(this, AbstractList);

        var that = this;
        this.fetchingData = false;
        this.error = false;
        this.initialLoaded = false;
        this.$scope = $scope;

        if (!_lodash2.default.isObject($scope.filters)) {
            throw new Error("Table filters must have a param filters set with an object.");
        }

        this.tableParams = new NgTableParams({}, {
            filterDelay: 10,
            getData: function getData(params) {
                if (!that.fetchingData) {
                    this.error = false;
                    that.fetchingData = true;
                    return that.getData(params).then(function (data) {
                        that.fetchingData = false;
                        that.error = false;
                        that.initialLoaded = true;
                        if (!data) {
                            that.error = true;
                            return [];
                        } else {
                            params.total(data.inlineCount); // recal. page nav controls
                            that.rowCount = data.inlineCount;
                            that.afterLoad(data.results);
                            return data.results;
                        }
                    });
                }
            }
        });

        $scope.$watch('filters', function (newFilter) {
            _this.tableParams.filter(newFilter);
            _this.tableParams.reload();
        }, true);
    }

    (0, _createClass3.default)(AbstractList, [{
        key: 'getData',
        value: function getData(params) {
            throw new Error("You must provide a getData function that returns a promise");
        }
    }, {
        key: 'afterLoad',
        value: function afterLoad(serverData) {
            //Extend
        }
    }]);
    return AbstractList;
}();

exports.default = AbstractList;