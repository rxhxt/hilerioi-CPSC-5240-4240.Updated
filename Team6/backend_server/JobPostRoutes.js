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
exports.JobPostRoutes = void 0;
const express = require("express");
class JobPostRoutes {
    constructor(jobPostModel) {
        this.router = express.Router();
        this.jobPostModel = jobPostModel;
        this.configureRoutes();
    }
    configureRoutes() {
        // -------------------Non Validated Routes below-------------------
        // Get all job posts
        this.router.get('/api/v1/jobposts/unprotected', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.jobPostModel.retrieveAllJobPosts(res);
        }));
        // Get job post by id
        this.router.get('/api/v1/jobposts/unprotected/:jobPostId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostId = req.params.jobPostId;
            yield this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        }));
        // Create new job post
        this.router.post('/api/v1/jobposts/unprotected', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostData = req.body;
            yield this.jobPostModel.CreateJobPost(res, jobPostData);
        }));
        // -------------------Validated Routes below-------------------
        // Get all job posts
        this.router.get('/api/v1/jobposts', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.jobPostModel.retrieveAllJobPosts(res);
        }));
        // Get job post by id
        this.router.get('/api/v1/jobposts/:jobPostId', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostId = req.params.jobPostId;
            yield this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        }));
        // Create new job post
        this.router.post('/api/v1/jobposts', this.validateAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const jobPostData = req.body;
            yield this.jobPostModel.CreateJobPost(res, jobPostData);
        }));
    }
    getRouter() {
        return this.router;
    }
    validateAuth(req, res, next) {
        console.log('Validating authentication');
    }
}
exports.JobPostRoutes = JobPostRoutes;
//# sourceMappingURL=JobPostRoutes.js.map