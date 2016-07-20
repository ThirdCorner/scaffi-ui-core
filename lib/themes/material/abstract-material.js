'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _abstractTheme = require('../classes/abstract-theme');

var _abstractTheme2 = _interopRequireDefault(_abstractTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractMaterial = function (_AbstractTheme) {
	(0, _inherits3.default)(AbstractMaterial, _AbstractTheme);

	function AbstractMaterial(args) {
		(0, _classCallCheck3.default)(this, AbstractMaterial);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AbstractMaterial).call(this, args));

		_this.addRequires(['angular-loading-bar']);
		_this.getApp().config(function (cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeBar = true;
			cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
			cfpLoadingBarProvider.includeSpinner = false;
		});
		return _this;
	}

	return AbstractMaterial;
}(_abstractTheme2.default);