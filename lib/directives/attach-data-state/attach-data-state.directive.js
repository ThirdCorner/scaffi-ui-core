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
var AttachDataState = (_dec = (0, _ngDecorators.Directive)({
	selector: 'attach-data-state'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function AttachDataState($rootScope, $state) {
		(0, _classCallCheck3.default)(this, AttachDataState);

		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = false;
	}

	(0, _createClass3.default)(AttachDataState, [{
		key: 'link',
		value: function link(scope, element, attrs, ngModel) {

			var setClasses = [];
			var modelBits = attrs["ngModel"].split(".");
			if (modelBits[0] == "vm") {
				modelBits.shift();
			}
			if (!modelBits.length) {
				return;
			}
			if (!_lodash2.default.has(scope.$parent, modelBits[0])) {
				console.log(scope.$parent, modelBits[0]);
				throw new Error("Can't find ngModel base node in scope");
			}

			scope.$parent[modelBits[0]].onStateChange(function (newState) {
				var states = newState.split(":");
				var parent = states[0];
				var remove = [];
				_lodash2.default.each(setClasses, function (name) {
					if (_lodash2.default.startsWith(name, parent)) {
						remove.push(name);
					}
				});
				if (remove.length) {
					_lodash2.default.each(remove, function (name) {
						element.removeClass(name.replace(":", "-"));
						setClasses.splice(setClasses.indexOf(name), 1);
					}, this);
				}
				setClasses.push(newState);
				element.addClass(newState.replace(":", "-"));
			});
		}
	}], [{
		key: 'directiveFactory',
		value: function directiveFactory($rootScope, $state) {

			AttachDataState.instance = new AttachDataState($rootScope, $state);
			return AttachDataState.instance;
		}
	}]);
	return AttachDataState;
}()) || _class);
exports.default = AttachDataState;