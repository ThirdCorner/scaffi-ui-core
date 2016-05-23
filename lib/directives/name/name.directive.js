'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class; // jshint unused: false;


var _ngDecorators = require('../../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COMPILE = new WeakMap();

//start-non-standard

//end-non-standard
var Name = (_dec = (0, _ngDecorators.Directive)({
	selector: 'name'
}), _dec(_class = function () {
	/*
  If you add constructor injectors, you need to add them to the directiveFactory portion as well
  Otherwise, you'll get an injection error
  */

	function Name($rootScope, $state, $compile) {
		_classCallCheck(this, Name);

		this.restrict = 'A';
		this.scope = false;

		COMPILE.set(this, $compile);
	}

	_createClass(Name, [{
		key: 'compile',
		value: function compile() {
			var _this = this;

			return {
				post: function post(scope, element, attrs, formCtrl) {

					if (attrs.ngModel && !_lodash2.default.startsWith(attrs.name, ".")) {

						var ngAttrs = {
							ngRequired: "required",
							ngPattern: "pattern"
						};
						var messageTypes = {
							required: 'Required',
							min: 'Value too small',
							max: 'Value too big',
							minlength: 'Too short',
							maxlength: 'Too long',
							pattern: null
						};

						var messagesToGenerate = {};

						var formElemName = "formCtrl." + attrs.name;
						var messages = '<div class="validation-messages">';

						_lodash2.default.forEach(messageTypes, function (value, name) {

							if (!_lodash2.default.has(attrs, name)) {
								return true;
							}

							if (_lodash2.default.has(attrs, name + "Message")) {
								value = attrs[name + "Message"];
							}

							if (!value) {
								throw new Error('You must provide a ' + _lodash2.default.kebabCase(name) + '-message attribute if you want to validate on it');
								return false;
							}

							messagesToGenerate[name] = value;
						}, _this);

						_lodash2.default.forEach(attrs, function (value, name) {
							if (_lodash2.default.startsWith(name, "ng") && _lodash2.default.has(ngAttrs, name) || _lodash2.default.startsWith(name, "md")) {
								var preChopName = name;
								name = _lodash2.default.camelCase(name.substr(2));

								var messageValue;
								if (_lodash2.default.has(messageTypes, name)) {
									messageValue = messageTypes[name];
								}

								if (_lodash2.default.has(attrs, preChopName + "Message")) {
									messageValue = attrs[preChopName + "Message"];
								}

								if (!messageValue) {
									throw new Error('You must provide a ' + _lodash2.default.kebabCase(preChopName) + '-message attribute if you want to validate on it');
									return false;
								}

								messagesToGenerate[name] = messageValue;
							}
						});

						_lodash2.default.forEach(messagesToGenerate, function (value, name) {

							messages += '<div class="message" role="alert" ng-show="' + formElemName + '.$error.' + name + ' && (formCtrl.$submitted || (' + formElemName + '.$touched && ' + formElemName + '.$invalid))">' + value + '</div>';
						});

						messages += "</div>";

						var div = COMPILE.get(_this)(messages)(scope);
						element.after(div);
					}
				}
			};
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state, $compile) {

			Name.instance = new Name($rootScope, $state, $compile);
			return Name.instance;
		}
	}]);

	return Name;
}()) || _class);
exports.default = Name;