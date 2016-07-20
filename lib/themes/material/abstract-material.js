'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

var _abstractTheme = require('../../classes/abstract-theme');

var _abstractTheme2 = _interopRequireDefault(_abstractTheme);

require('angular-material');

require('daniel-nagy/md-data-table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AbstractMaterial = function (_AbstractTheme) {
	(0, _inherits3.default)(AbstractMaterial, _AbstractTheme);

	function AbstractMaterial(args) {
		(0, _classCallCheck3.default)(this, AbstractMaterial);

		var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AbstractMaterial).call(this, args));

		_this.addRequires(['ngMaterial', 'md.data.table', 'angular-loading-bar']);
		_this.getApp().config(function (cfpLoadingBarProvider) {
			cfpLoadingBarProvider.includeBar = true;
			cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
			cfpLoadingBarProvider.includeSpinner = false;
		});

		_this.getApp().config(function ($mdIconProvider) {
			$mdIconProvider.defaultFontSet("fontawesome");
		});

		_this.getApp().config(function ($mdThemingProvider) {
			var defaultPal = $mdThemingProvider.extendPalette('blue', {
				'400': 'B8BCA7',
				'500': 'B8BCA7',
				'600': '545D32',
				'700': '6C744A',
				'800': '6C744A'
			});

			$mdThemingProvider.definePalette('blue', defaultPal);

			$mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('orange');
		});
		return _this;
	}

	return AbstractMaterial;
}(_abstractTheme2.default);

exports.default = AbstractMaterial;