'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractPage = function AbstractPage($scope) {
	(0, _classCallCheck3.default)(this, AbstractPage);
}
/*
	We shouldn't need to setForm in scope, because page
	should be top level scope with form already.
	
	It's the stub pages we have issue with
 */
// _loadParentForm($scope){
// 	ParserHelper.setFormInChildScope($scope, $scope.$parent);
// }
;

exports.default = AbstractPage;