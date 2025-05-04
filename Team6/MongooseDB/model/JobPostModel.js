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
class JobPostModel {
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            jobPostId: String,
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
            const newJobPost = new this.model(data);
            const query = newJobPost.save();
            try {
                const result = yield query.exec();
                response.json(result);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.JobPostModel = JobPostModel;
//# sourceMappingURL=JobPostModel.js.map