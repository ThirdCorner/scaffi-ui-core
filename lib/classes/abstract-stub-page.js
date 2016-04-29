'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractStubPage = function () {
	function AbstractStubPage($scope) {
		_classCallCheck(this, AbstractStubPage);

		if ($scope.$parent) {
			this._loadParentForm($scope);
		}
	}

	_createClass(AbstractStubPage, [{
		key: '_loadParentForm',
		value: function _loadParentForm($scope) {
			_parserHelper2.default.setFormInChildScope($scope, $scope.$parent);
		}
	}]);

	return AbstractStubPage;
}();

exports.default = AbstractStubPage;