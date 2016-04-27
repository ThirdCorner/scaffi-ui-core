'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class; // jshint unused: false


var _ngDecorators = require('../../ng-decorators');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('../../index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//end-non-standard


//start-non-standard
var StateStore = (_dec = (0, _ngDecorators.Factory)({
	factoryName: 'stateStore'
}), _dec(_class = function () {
	function StateStore($rootScope, socketIO) {
		_classCallCheck(this, StateStore);

		this.$rootScope = $rootScope;
		this.socketIO = socketIO;

		this.requestStore = [];
		this.queue = [];

		this.transitionState = null;
		this.currentState = null;

		var that = this;
		$rootScope.$on('$stateChangeStart', function (event, toState) {
			that.transitionState = toState.name;
			that.currentState = null;
		});
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			that.currentState = toState.name;
			//that._processQueue();
			console.log(that.requestStore);
		});
	}

	_createClass(StateStore, [{
		key: 'registerRequest',
		value: function registerRequest(service, url, data) {

			var request = { url: url, service: service };

			var returnData;
			returnData = new _index.StateModel(url, service, data, this.socketIO);
			request.data = returnData;
			this.addToStore(request);

			return returnData.getRest();
		}
	}, {
		key: 'addToStore',
		value: function addToStore(request) {
			this.requestStore.push(request);
		}
	}], [{
		key: 'factory',
		value: function factory($rootScope, socketIO) {
			StateStore.instance = new StateStore($rootScope, socketIO);
			return StateStore.instance;
		}
	}]);

	return StateStore;
}()) || _class);
exports.default = StateStore;