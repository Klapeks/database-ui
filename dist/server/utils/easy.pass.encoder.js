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
        var codeUnits = new Uint16Array(original.length);
        for (var i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = original.charCodeAt(i);
        }
        codeUnits = new Uint8Array(codeUnits.buffer);
        var str = '';
        var choto = 0;
        for (var i = 0; i < codeUnits.length; i++) {
            choto = (codeUnits[i] ^ pass.charCodeAt(i % pass.length)) & 0xff;
            str += String.fromCharCode(choto);
        }
        return btoa(str);
    },
    decode: function (base64, pass) {
        base64 = atob(base64);
        var codeUnits = new Uint8Array(base64.length);
        for (var i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = (base64.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xFF;
        }
        codeUnits = new Uint16Array(codeUnits.buffer);
        var str = '';
        for (var i = 0; i < codeUnits.length; i++) {
            str += String.fromCharCode(codeUnits[i]);
        }
        return str;
    },
};
