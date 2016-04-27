'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractList = function () {
    function AbstractList(NgTableParams, $scope) {
        var _this = this;

        _classCallCheck(this, AbstractList);

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

    _createClass(AbstractList, [{
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