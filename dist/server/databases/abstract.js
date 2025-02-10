"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __importDefault(require("@/utils/utils"));
var AbstractDatabase = /** @class */ (function () {
    function AbstractDatabase(options) {
        this.options = options;
        this.key = utils_1.default.randomPassword(64);
    }
    return AbstractDatabase;
}());
exports.default = AbstractDatabase;
