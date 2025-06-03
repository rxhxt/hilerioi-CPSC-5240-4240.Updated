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
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const GooglePassport_1 = require("./GooglePassport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const JobPostModel_1 = require("./model/JobPostModel");
const AppliedJobModel_1 = require("./model/AppliedJobModel");
class App {
    constructor() {
        this.googlePassportObj = new GooglePassport_1.default();
        this.express = express();
        this.middleware();
        this.routes();
        const dbProtocol = process.env.DB_PROTOCAL || 'mongodb://';
        const dbUser = process.env.DB_USER || '';
        const dbPassword = process.env.DB_PASSWORD || '';
        const dbInfo = process.env.DB_INFO || '';
        let dbConnectionString = '';
        if (dbUser && dbPassword) {
            dbConnectionString = `${dbProtocol}${dbUser}:${dbPassword}${dbInfo}`;
        }
        else {
            dbConnectionString = `${dbProtocol}${dbInfo}`;
        }
        console.log("Using database connection:", dbConnectionString.replace(/:([^:@]{1,})@/, ':****@'));
        // Initialize models
        this.jobPostModel = new JobPostModel_1.JobPostModel(dbConnectionString);
        this.appliedJobModel = new AppliedJobModel_1.AppliedJobModel(dbConnectionString);
    }
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.express.use(session({
            secret: process.env.SESSION_SECRET || 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));
        this.express.use(cookieParser());
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    }
    validateAuth(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("user is authenticated");
            console.log(JSON.stringify(req.user));
            return next();
        }
        console.log("user is not authenticated");
        res.redirect('/login');
    }
    routes() {
        let router = express.Router();
        // Authentication routes
        router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
        router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
            console.log("Successfully authenticated user");
            res.redirect('/');
        });
        // JobPost routes
        router.get('/api/v1/jobposts/unprotected', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.jobPostModel.retrieveAllJobPosts(res);
        }));
        router.get('/api/v1/jobposts/unprotected/:jobPostId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostId = req.params.jobPostId;
            yield this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        }));
        router.post('/api/v1/jobposts/unprotected', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostData = req.body;
            yield this.jobPostModel.CreateJobPost(res, jobPostData);
        }));
        router.get('/api/v1/jobposts', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.jobPostModel.retrieveAllJobPosts(res);
        }));
        router.get('/api/v1/jobposts/:jobPostId', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostId = req.params.jobPostId;
            yield this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        }));
        router.post('/api/v1/jobposts', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostData = req.body;
            yield this.jobPostModel.CreateJobPost(res, jobPostData);
        }));
        // AppliedJob routes
        router.get('/api/v1/appliedjobs/unprotected', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.appliedJobModel.retrieveAllAppliedJobs(res);
        }));
        router.get('/api/v1/appliedjobs/unprotected/:appliedJobId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.appliedJobId;
            yield this.appliedJobModel.retrieveAppliedJobById(res, id);
        }));
        router.post('/api/v1/appliedjobs/unprotected', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            yield this.appliedJobModel.createAppliedJob(res, payload);
        }));
        router.get('/api/v1/appliedjobs', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.appliedJobModel.retrieveAllAppliedJobs(res);
        }));
        router.get('/api/v1/appliedjobs/:appliedJobId', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.appliedJobId;
            yield this.appliedJobModel.retrieveAppliedJobById(res, id);
        }));
        router.post('/api/v1/appliedjobs', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            yield this.appliedJobModel.createAppliedJob(res, payload);
        }));
        this.express.use('/', router);
        // Static files
        this.express.use('/images', express.static(__dirname + '/img'));
        // console.log("Serving static files from: " + __dirname + '/dist/job-fetchr');
        this.express.use('/', express.static(__dirname + '/dist/job-fetchr/browser'));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map