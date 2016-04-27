'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		_classCallCheck(this, LiveEditView);

		this.restrict = 'E';
		this.require = 'ngModel';
		this.scope = false;
	}

	_createClass(LiveEditView, [{
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