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

var _index = require('../../index.js');

var _index2 = _interopRequireDefault(_index);

var _ngDecorators = require('../../ng-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ID_PROP;

//end-non-standard
// jshint unused: false;
//start-non-standard
var LiveEdit = (_dec = (0, _ngDecorators.Directive)({
	selector: 'live-edit'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function LiveEdit($rootScope, $state, $timeout) {
		(0, _classCallCheck3.default)(this, LiveEdit);

		ID_PROP = _index2.default.config.getIdPropertyName();
		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = {};

		this.$timeout = $timeout;
	}

	(0, _createClass3.default)(LiveEdit, [{
		key: 'compile',
		value: function compile(element, attrs) {

			if (_index.EnvironmentHelper.isLiveEditEnabled()) {

				element.after('<live-edit-view ng-model="' + attrs['ngModel'] + '"></live-edit-view>');

				var that = this;
				return {
					pre: function pre(scope, element, attrs, ngModel) {

						scope.editMode = function () {
							element.removeClass('ng-hide');
							element[0].focus();
							var setElem = angular.element(element.parent().find('live-edit-view'));
							setElem.triggerHandler("hide");
						};

						scope.displayMode = function () {
							element.addClass('ng-hide');
							var setElem = angular.element(element.parent().find('live-edit-view'));
							setElem.triggerHandler("show");
						};

						element.on("click", function () {
							scope.editMode();
						});
						var loading = true;
						if (ngModel) {

							/*
       	This needs to be able to account for nested objs
        */
							var modelBits = attrs["ngModel"].split(".");
							var propName = modelBits.pop();
							var parentName = modelBits.pop();

							var inputScope = scope.$parent;

							var isEditable = function isEditable() {
								return inputScope[parentName][ID_PROP];
							};

							var syncValue = function syncValue() {
								var hasChanged = scope.originalValue != ngModel.$modelValue;

								if (isEditable()) {
									scope.displayMode(ngModel.$modelValue);
								}

								if (loading) return true;

								if (element.hasClass("ng-valid") && isEditable() && hasChanged) {
									scope.originalValue = ngModel.$modelValue;
									inputScope[parentName].pushChanges(propName);
									scope.displayMode();

									return true;
								}

								return false;
							};

							if (!_lodash2.default.has(inputScope, parentName)) {
								throw new Error('Can\'t find ' + parentName + ' in element scope.');
							}

							/*
       	only enable if they pass in a restmodel
        */
							if (!(inputScope[parentName] instanceof _index.DataModel)) {
								throw new Error("You're trying to use live edit mode but the model attached is not an instance of a DataModel. Is it created?");
								return false;
							}

							if (element[0].tagName == "INPUT") {
								element.on("blur", function () {

									return syncValue();
								});
							} else {
								scope.$watch(function () {
									return ngModel.$modelValue;
								}, function (newValue, oldValue) {
									syncValue();
								});
							}

							/*
       	For when model is loaded
        */

							that.$timeout(function () {
								loading = false;

								if (ngModel.$modelValue == null || _lodash2.default.isUndefined(ngModel.$modelValue) || _lodash2.default.isString(ngModel.$modelValue) && ngModel.$modelValue.length == 0) {
									scope.editMode();
								} else {
									scope.displayMode(ngModel.$modelValue);
								}

								scope.originalValue = ngModel.$modelValue;
							});
						}
					},
					post: function post(scope, element, attrs, ngModel) {}
				};
			}
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state, $timeout) {

			LiveEdit.instance = new LiveEdit($rootScope, $state, $timeout);
			return LiveEdit.instance;
		}
	}]);
	return LiveEdit;
}()) || _class);
exports.default = LiveEdit;