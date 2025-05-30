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
exports.JobPostModel = void 0;
const Mongoose = require("mongoose");
const crypto = require('crypto');
class JobPostModel {
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            jobPostId: {
                type: String,
                unique: true,
                required: true,
                index: true
            },
            position_title: String,
            location: String,
            date_posted: Date,
            company: String,
            recruiter: String,
            job_description: String,
            salary: Number,
            status: String,
            scrape_date: Date,
            url: String,
            job_work_type: String,
            is_remote: Boolean
        }, { collection: 'jobposts' });
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongoose.connect(this.dbConnectionString);
                this.model = Mongoose.model("JobPost", this.schema);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    retrieveAllJobPosts(response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Retrieving all job posts');
            var query = this.model.find({});
            try {
                const jobPostArray = yield query.exec();
                response.json(jobPostArray);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    retrieveJobPostsById(response, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Retrieving job post with id: ' + job_id);
            var query = this.model.findOne({ jobPostId: job_id });
            try {
                const result = yield query.exec();
                response.json(result);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    CreateJobPost(response, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating job post with data: ' + JSON.stringify(data));
            try {
                const uniqueId = crypto.randomBytes(16).toString('hex');
                const jobPostData = {
                    jobPostId: uniqueId,
                    position_title: data.position_title,
                    location: data.location,
                    date_posted: data.date_posted || new Date(),
                    company: data.company,
                    recruiter: data.recruiter,
                    job_description: data.job_description,
                    salary: data.salary,
                    status: data.status,
                    scrape_date: data.scrape_date || new Date(),
                    url: data.url,
                    job_work_type: data.job_work_type,
                    is_remote: data.is_remote
                };
                console.log('Job post data to be saved: ' + JSON.stringify(jobPostData));
                const newJobPost = new this.model(jobPostData);
                const result = yield newJobPost.save();
                response.json(result);
            }
            catch (e) {
                console.error(e);
                response.status(500).json({ error: 'Failed to create job post' });
            }
        });
    }
}
exports.JobPostModel = JobPostModel;
//# sourceMappingURL=JobPostModel.js.map