"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyPassEncoder = void 0;
exports.easyPassEncoder = {
    encodeJSON: function (json, pass) {
        return exports.easyPassEncoder.encode(JSON.stringify(json), pass);
    },
    decodeJSON: function (base64, pass) {
        return JSON.parse(exports.easyPassEncoder.decode(base64, pass));
    },
    encode: function (original, pass) {
        var str = '';
        var choto = 0;
        for (var i = 0; i < original.length; i++) {
            choto = (original.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
            str += String.fromCharCode(choto);
        }
        return btoa(str);
    },
    decode: function (base64, pass) {
        base64 = atob(base64);
        var str = '';
        var choto = 0;
        for (var i = 0; i < base64.length; i++) {
            choto = (base64.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
            str += String.fromCharCode(choto);
        }
        return str;
    },
};
