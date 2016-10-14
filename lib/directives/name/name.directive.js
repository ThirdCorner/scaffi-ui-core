'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _dec, _class; // jshint unused: false;


var _ngDecorators = require('../../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parserHelper = require('../../helpers/parser-helper');

var _parserHelper2 = _interopRequireDefault(_parserHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPILE = new _weakMap2.default();

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
		(0, _classCallCheck3.default)(this, Name);

		this.restrict = 'A';
		this.scope = false;

		COMPILE.set(this, $compile);
	}

	(0, _createClass3.default)(Name, [{
		key: 'compile',
		value: function compile() {
			var _this = this;

			return {
				post: function post(scope, element, attrs, formCtrl) {
					if (!attrs.name) {
						throw new Error("You've referenced the name property without filling one in. Shame shame shame.");
					}
					if (attrs.ngModel && !_lodash2.default.startsWith(attrs.name, ".")) {

						var form = _parserHelper2.default.getFormController(scope);
						if (!form || !form.$name) {
							return false;
						}
						var tagName = element[0].tagName.toLowerCase();
						var ngAttrs = {
							ngRequired: "required",
							ngPattern: "pattern",
							mdMinlength: "minlength",
							mdMaxlength: "maxlength"
						};
						var messageTypes = {
							required: 'Required',
							min: 'Value too small',
							max: 'Value too big',
							minlength: 'Too short',
							maxlength: 'Too long',
							pattern: null,
							validate: null
						};

						var messagesToGenerate = {};

						var formElemName = form.$name + "." + attrs.name;
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
							if (_lodash2.default.startsWith(name, "ng") && _lodash2.default.has(ngAttrs, name)) {
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
							var showLogic = formElemName + '.$error.' + name + ' && (' + form.$name + '.$submitted || (' + formElemName + '.$touched && ' + formElemName + '.$invalid))';
							if (tagName == "div" || tagName == "span") {
								showLogic = formElemName + '.$error.' + name + ' && (' + form.$name + '.$submitted || ' + formElemName + '.$invalid)';
							}
							messages += '<div class="message" role="alert" ng-show="' + showLogic + '">' + value + '</div>';
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