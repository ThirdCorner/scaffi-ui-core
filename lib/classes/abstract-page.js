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

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractPage = function () {
	function AbstractPage($scope) {
		(0, _classCallCheck3.default)(this, AbstractPage);

		if ($scope.$parent) {
			this._loadParentForm($scope);
		}
	}

	(0, _createClass3.default)(AbstractPage, [{
		key: '_loadParentForm',
		value: function _loadParentForm($scope) {
			_parserHelper2.default.setFormInChildScope($scope, $scope.$parent);
		}
	}]);
	return AbstractPage;
}();

exports.default = AbstractPage;