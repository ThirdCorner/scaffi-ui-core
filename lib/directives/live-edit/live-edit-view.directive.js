'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dec, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//end-non-standard
// jshint unused: false;
//start-non-standard
var LiveEditView = (_dec = (0, _ngDecorators.Directive)({
	selector: 'live-edit-view'
}), _dec(_class = function () {
	/*
  If you add constructor injectors, you need to add them to the directiveFactory portion as well
  Otherwise, you'll get an injection error
  */

	function LiveEditView($rootScope, $state) {
		(0, _classCallCheck3.default)(this, LiveEditView);

		this.restrict = 'E';
		this.require = 'ngModel';
		this.scope = false;
	}

	(0, _createClass3.default)(LiveEditView, [{
		key: 'link',
		value: function link(scope, element, attrs, ngModel) {

			element.on("click", function () {
				_lodash2.default.each(element.parent().children(), function (item) {
					if (!_lodash2.default.isUndefined(angular.element(item).attr('live-edit'))) {
						item.click();
					}
				});
			});
			element.on("hide", function () {
				element.addClass("ng-hide");
			});
			element.on("show", function () {
				element.removeClass("ng-hide");
			});
			scope.$watch(function () {
				return ngModel.$modelValue;
			}, function (newValue) {
				element.text(newValue);
			}, true);
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			LiveEditView.instance = new LiveEditView($rootScope, $state);
			return LiveEditView.instance;
		}
	}]);
	return LiveEditView;
}()) || _class);
exports.default = LiveEditView;