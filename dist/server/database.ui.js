"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var express_2 = __importDefault(require("express"));
var easy_pass_encoder_1 = require("./utils/easy.pass.encoder");
var databaseUI = {
    createWebRouter: function () {
        var webPath = path_1.default.join(__dirname, '../web');
        if (!fs_1.default.existsSync(webPath))
            throw "No web path found :(";
        var router = (0, express_1.Router)();
        router.use(express_2.default.static(webPath));
        router.get('*', function (req, res, next) {
            if (req.url.startsWith('/api'))
                return next();
            return res.sendFile(path_1.default.join(webPath, 'index.html'));
        });
        return router;
    },
    createRouter: function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var databaseType, database, _a, lib, router;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        databaseType = options.type;
                        _a = databaseType;
                        switch (_a) {
                            case "mysql": return [3 /*break*/, 1];
                            case "sqlite": return [3 /*break*/, 3];
                            case "postgres": return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('./databases/mysql')); })];
                    case 2:
                        lib = _b.sent();
                        database = new lib.MySQLDatabase(options);
                        return [3 /*break*/, 6];
                    case 3: throw "No sqlite support yet";
                    case 4: throw "No postgres support yet";
                    case 5: throw "No database type found: " + (databaseType);
                    case 6:
                        router = (0, express_1.Router)();
                        router.get('/database-type', function (req, res) {
                            res.status(200).send({
                                type: databaseType,
                                key: database.key
                            });
                        });
                        router.post('/sql', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                            var data, encoded, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        if (!req.body.sql)
                                            throw "No sql field found";
                                        req.body.sql = easy_pass_encoder_1.easyPassEncoder.decode(req.body.sql, database.key);
                                        return [4 /*yield*/, database.sql(req.body.sql, req.body.params)];
                                    case 1:
                                        data = _a.sent();
                                        encoded = easy_pass_encoder_1.easyPassEncoder.encodeJSON(data, database.key);
                                        ;
                                        res.status(200).send({ data: encoded });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_1 = _a.sent();
                                        if (typeof err_1 == 'string') {
                                            res.status(400).send({ message: err_1, error: err_1 });
                                            return [2 /*return*/];
                                        }
                                        console.error("Unknown error:", err_1);
                                        res.status(500).send({
                                            message: err_1.message || "Unknown error",
                                            error: err_1
                                        });
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, router];
                }
            });
        });
    }
};
exports.default = databaseUI;
