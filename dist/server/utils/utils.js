"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNever = void 0;
function assertNever(never) {
    throw new Error("Never assered: " + JSON.stringify(never));
}
exports.assertNever = assertNever;
var utils = {
    assertNever: assertNever,
    randomPassword: function (len) {
        if (!len)
            len = 10 + (Math.random() * 10) | 0;
        var charset = "0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var str = '';
        for (var i = 0; i < len; i++) {
            str += charset[(Math.random() * charset.length) | 0];
        }
        return str;
    },
};
exports.default = utils;
