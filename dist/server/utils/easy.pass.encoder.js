"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.easyPassEncoder = void 0;
exports.easyPassEncoder = {
    decodeArray: function (array, pass) {
        var newArr = Array(array.length);
        for (var i = 0; i < array.length; i++) {
            newArr[i] = exports.easyPassEncoder.decodeJSON(array[i], pass);
        }
        return newArr;
    },
    encodeArray: function (array, pass) {
        var newArr = Array(array.length);
        for (var i = 0; i < array.length; i++) {
            newArr[i] = exports.easyPassEncoder.encodeJSON(array[i], pass);
        }
        return newArr;
    },
    encodeJSON: function (json, pass) {
        return exports.easyPassEncoder.encode(JSON.stringify(json), pass);
    },
    decodeJSON: function (base64, pass) {
        return JSON.parse(exports.easyPassEncoder.decode(base64, pass));
    },
    encode: function (original, pass) {
        var choto = Array(original.length);
        for (var i = 0; i < original.length; i++) {
            choto[i] = (original.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
        }
        return btoa(String.fromCharCode.apply(String, __spreadArray([], __read(choto), false)));
    },
    decode: function (base64, pass) {
        base64 = atob(base64);
        var choto = Array(base64.length);
        for (var i = 0; i < base64.length; i++) {
            choto[i] = (base64.charCodeAt(i) ^ pass.charCodeAt(i % pass.length)) & 0xff;
        }
        return String.fromCharCode.apply(String, __spreadArray([], __read(choto), false));
    },
};
