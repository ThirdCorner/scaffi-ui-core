'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class; // jshint unused: false;


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ngDecorators = require('../../ng-decorators');

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ID_PROP;
//start-non-standard

//end-non-standard
var LiveEditBlurSubmit = (_dec = (0, _ngDecorators.Directive)({
	selector: 'live-edit-blur-submit'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function LiveEditBlurSubmit($rootScope, $state, $timeout) {
		_classCallCheck(this, LiveEditBlurSubmit);

		ID_PROP = _index2.default.config.getIdPropertyName();
		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = false;
	}

	_createClass(LiveEditBlurSubmit, [{
		key: 'link',
		value: function link(scope, element, attrs, ngModel) {
			var modelBits = attrs["ngModel"].split(".");
			var propName = modelBits.pop();
			var parentName = modelBits.pop();
			if (!_lodash2.default.has(scope, parentName)) {
				throw new Error('Can\'t find ' + parentName + ' in element scope.');
			}

			/*
    only enable if they pass in a restmodel
    */
			if (!(scope[parentName] instanceof _index.DataModel)) {
				throw new Error("You're trying to use live edit mode but the model attached is not an instance of a DataModel. Is it created?");
				return false;
			}

			var loading = true;
			if (!scope[parentName][ID_PROP]) {
				// element.focus();

				scope.displayMode = function () {

					element.addClass('ng-hide');
					var setElem = angular.element(element.parent().find('live-edit-view'));
					setElem.triggerHandler("show");
				};

				if (element[0].tagName == "INPUT") {

					element.on("blur", function () {
						if (loading) return true;

						if (element.hasClass("ng-valid") && !scope[parentName][ID_PROP]) {
							scope[parentName].save();
							scope.displayMode();
						}
					});
				} else {
					scope.$watch(function () {
						return ngModel.$valid;
					}, function (newValue, oldValue) {
						if (loading) return true;

						if (newValue) {
							if (!scope[parentName][ID_PROP]) {
								scope[parentName].save();
								scope.displayMode();
							}
						}
					});
				}
			}

			setTimeout(function () {
				loading = false;
			});
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state, $timeout) {

			LiveEditBlurSubmit.instance = new LiveEditBlurSubmit($rootScope, $state, $timeout);
			return LiveEditBlurSubmit.instance;
		}
	}]);

	return LiveEditBlurSubmit;
}()) || _class);
exports.default = LiveEditBlurSubmit;