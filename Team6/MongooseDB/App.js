"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var JobPostRoutes_1 = require("./JobPostRoutes");
var JobPostModel_1 = require("./model/JobPostModel");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    App.prototype.middleware = function () {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    };
    App.prototype.routes = function () {
        var dbConnectionString = process.env.DB_INFO || '';
        console.log("Using database connection:", dbConnectionString);
        var jobPostModel = new JobPostModel_1.JobPostModel(dbConnectionString);
        var jobPostRoutes = new JobPostRoutes_1.JobPostRoutes(jobPostModel);
        this.express.use('/', jobPostRoutes.getRouter());
        // Static file serving
        this.express.use('/images', express.static(__dirname + '/img'));
        this.express.use('/data', express.static(__dirname + '/json'));
        this.express.use('/', express.static(__dirname + '/pages'));
    };
    return App;
}());
exports.App = App;
