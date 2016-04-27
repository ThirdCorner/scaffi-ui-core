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
var AttachDataState = (_dec = (0, _ngDecorators.Directive)({
	selector: 'attach-data-state'
}), _dec(_class = function () {
	/*
 	If you add constructor injectors, you need to add them to the directiveFactory portion as well
 	Otherwise, you'll get an injection error
  */

	function AttachDataState($rootScope, $state) {
		_classCallCheck(this, AttachDataState);

		this.restrict = 'A';
		this.require = 'ngModel';
		this.scope = false;
	}

	_createClass(AttachDataState, [{
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