'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class; // jshint unused: false


var _ngDecorators = require('../../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//end-non-standard

/*
    This class is so that scaffi-ui-core components can run stuff after everything else in a project is loaded.
 */
//start-non-standard
var PostLoader = (_dec = (0, _ngDecorators.Factory)({
	factoryName: 'postLoader'
}), _dec(_class = function () {
	function PostLoader() {
		_classCallCheck(this, PostLoader);

		this.events = [];
	}

	_createClass(PostLoader, [{
		key: 'add',
		value: function add(event) {
			this.events.push(event);
		}
	}, {
		key: 'call',
		value: function call() {
			_lodash2.default.each(this.events, function (event) {
				event();
			});
		}
	}], [{
		key: 'factory',
		value: function factory() {
			PostLoader.instance = new PostLoader();
			return PostLoader.instance;
		}
	}]);

	return PostLoader;
}()) || _class);
exports.default = PostLoader;