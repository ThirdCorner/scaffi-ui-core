"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UseCase = function UseCase(description, structure) {
	(0, _classCallCheck3.default)(this, UseCase);

	this.description = description;
	this.structure = structure;
};

exports.default = UseCase;