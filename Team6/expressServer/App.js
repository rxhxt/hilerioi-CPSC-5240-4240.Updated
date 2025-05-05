"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var url = require("url");
var bodyParser = require("body-parser");
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        var _this = this;
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
                return [2 /*return*/];
            });
        }); });
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.get('/one', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    res.send('request one');
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        }); });
        router.get('/add', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var urlParts, query, value1, value2, sum, msg;
            return __generator(this, function (_a) {
                try {
                    urlParts = url.parse(req.url, true);
                    query = urlParts.query;
                    console.log('var1:' + query.var1);
                    console.log('var2:' + query.var2);
                    value1 = parseInt(query.var1);
                    value2 = parseInt(query.var2);
                    sum = value1 + value2;
                    msg = 'addition of ' + query.var1 + ' plus ' + query.var2 + ' equals ' + sum;
                    console.log(msg);
                    res.send(msg);
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        }); });
        router.get('/add2/:var1/:var2', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var value1, value2, sum, msg;
            return __generator(this, function (_a) {
                try {
                    console.log('var1:' + req.params.var1);
                    console.log('var2:' + req.params.var2);
                    value1 = parseInt(req.params.var1);
                    value2 = parseInt(req.params.var2);
                    sum = value1 + value2;
                    msg = 'addition of ' + value1 + ' plus ' + value2 + ' equals ' + sum;
                    console.log(msg);
                    res.send(msg);
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        }); });
        router.post('/add', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var payload, value1, value2, sum, msg;
            return __generator(this, function (_a) {
                try {
                    payload = req.body;
                    console.log('var1:' + payload.var1);
                    console.log('var2:' + payload.var2);
                    value1 = parseInt(payload.var1);
                    value2 = parseInt(payload.var2);
                    sum = value1 + value2;
                    msg = 'addition of ' + value1 + ' plus ' + value2 + ' equals ' + sum;
                    console.log(msg);
                    res.send(msg);
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        }); });
        var fname2;
        router.get('/name/:fname', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var name_1;
            return __generator(this, function (_a) {
                try {
                    console.log(':fname = ' + req.params.fname);
                    if (req.params.fname === 'israelh') {
                        name_1 = fname2 + ' hilerio';
                    }
                    else {
                        name_1 = fname2 + ' world';
                    }
                    console.log(name_1);
                    res.send("Your name is: " + name_1);
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        }); });
        router.param('fname', function (req, res, next, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    console.log('The param value is: ' + value);
                    fname2 = value + "-ABC";
                    next();
                }
                catch (error) {
                    console.log(error);
                }
                return [2 /*return*/];
            });
        }); });
        this.express.use('/', router);
        this.express.use('/images', express.static(__dirname + '/img'));
        this.express.use('/data', express.static(__dirname + '/json'));
        this.express.use('/', express.static(__dirname + '/pages'));
    };
    return App;
}());
exports.App = App;
