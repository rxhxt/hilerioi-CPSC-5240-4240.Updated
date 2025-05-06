"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const bodyParser = require("body-parser");
const JobPostRoutes_1 = require("./JobPostRoutes");
const JobPostModel_1 = require("./model/JobPostModel");
const AppliedJobRoutes_1 = require("./AppliedJobRoutes");
const AppliedJobModel_1 = require("./model/AppliedJobModel");
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }
    routes() {
        const dbConnectionString = process.env.DB_INFO || '';
        console.log("Using database connection:", dbConnectionString);
        const jobPostModel = new JobPostModel_1.JobPostModel(dbConnectionString);
        const jobPostRoutes = new JobPostRoutes_1.JobPostRoutes(jobPostModel);
        this.express.use('/', jobPostRoutes.getRouter());
        const appliedJobModel = new AppliedJobModel_1.AppliedJobModel(dbConnectionString);
        const appliedJobRoutes = new AppliedJobRoutes_1.AppliedJobRoutes(appliedJobModel);
        this.express.use('/', appliedJobRoutes.getRouter());
        //static files
        this.express.use('/images', express.static(__dirname + '/img'));
        this.express.use('/data', express.static(__dirname + '/json'));
        this.express.use('/', express.static(__dirname + '/pages'));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map