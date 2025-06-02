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
        // Get environment variables
        const dbProtocol = process.env.DB_PROTOCAL || 'mongodb://';
        const dbUser = process.env.DB_USER || '';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbInfo = process.env.DB_INFO || '';
        // Construct the full MongoDB connection string
        let dbConnectionString = '';
        if (dbUser && dbPassword) {
            // If user and password are provided, include them in the connection string
            dbConnectionString = `${dbProtocol}${dbUser}:${dbPassword}${dbInfo}`;
        }
        else {
            // If no authentication, just use protocol and info
            dbConnectionString = `${dbProtocol}${dbInfo}`;
        }
        // Log connection string (hide password for security)
        console.log("Using database connection:", dbConnectionString.replace(/:([^:@]{1,})@/, ':****@'));
        const jobPostModel = new JobPostModel_1.JobPostModel(dbConnectionString);
        const jobPostRoutes = new JobPostRoutes_1.JobPostRoutes(jobPostModel);
        this.express.use('/', jobPostRoutes.getRouter());
        const appliedJobModel = new AppliedJobModel_1.AppliedJobModel(dbConnectionString);
        const appliedJobRoutes = new AppliedJobRoutes_1.AppliedJobRoutes(appliedJobModel);
        this.express.use('/', appliedJobRoutes.getRouter());
        //static files
        this.express.use('/images', express.static(__dirname + '/img'));
        // this.express.use('/data', express.static(__dirname + '/json'));
        // this.express.use('/', express.static(__dirname + '/pages'));
        console.log("Serving static files from: " + __dirname + '/dist/job-fetchr');
        this.express.use('/', express.static(__dirname + '/dist/job-fetchr'));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map