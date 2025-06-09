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
        // Updated CORS configuration for same-origin setup
        this.express.use((req, res, next) => {
            // Since frontend and backend are served from same origin, we need different CORS handling
            const allowedOrigins = process.env.NODE_ENV === 'production'
                ? [process.env.AZURE_URL || 'https://your-azure-app.azurewebsites.net']
                : ['http://localhost:8080']; // Same port as your backend
            const origin = req.headers.origin;
            if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
            }
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            }
            else {
                next();
            }
        });
        // Updated session configuration
        this.express.use(session({
            secret: process.env.SESSION_SECRET || 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
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
        // API routes
        router.get('/api/v1/auth/status', (req, res) => {
            console.log("Checking authentication status");
            if (req.isAuthenticated()) {
                res.json({
                    authenticated: true,
                    user: req.user
                });
            }
            else {
                res.json({
                    authenticated: false
                });
            }
        });
        router.post('/api/v1/auth/logout', (req, res) => {
            req.logout((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Logout failed' });
                }
                res.json({ success: true });
            });
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
        router.get('/api/v1/appliedjobs', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.ssoID; // Get user ID from authenticated user
            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }
            yield this.appliedJobModel.retrieveAllAppliedJobs(res, userId);
        }));
        router.get('/api/v1/appliedjobs/:appliedJobId', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const id = req.params.appliedJobId;
            const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.ssoID;
            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }
            yield this.appliedJobModel.retrieveAppliedJobById(res, id, userId);
        }));
        router.post('/api/v1/appliedjobs', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const payload = req.body;
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.ssoID;
            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }
            yield this.appliedJobModel.createAppliedJob(res, payload, userId);
        }));
        // Apply the router with all API and auth routes FIRST
        this.express.use('/', router);
        // Static files
        this.express.use('/images', express.static(__dirname + '/img'));
        this.express.use('/', express.static(__dirname + '/dist/job-fetchr/browser'));
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map