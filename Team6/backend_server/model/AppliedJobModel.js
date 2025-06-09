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
exports.AppliedJobModel = void 0;
const Mongoose = require("mongoose");
const crypto = require('crypto');
class AppliedJobModel {
    constructor(DB_CONNECTION_STRING) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    createSchema() {
        this.schema = new Mongoose.Schema({
            appliedJobId: {
                type: String,
                unique: true,
                required: true,
                index: true
            },
            user_id: { type: String, required: true },
            job_id: { type: String, required: true },
            applied_date: Date,
            status: String
        }, { collection: 'appliedjobs' });
    }
    createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongoose.connect(this.dbConnectionString);
                this.model = Mongoose.model("AppliedJob", this.schema);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    retrieveAllAppliedJobs(response, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Retrieving all applied jobs for user:', userId);
            try {
                let query;
                if (userId) {
                    //filter by user ID (ssoID)
                    query = this.model.find({ user_id: userId });
                }
                else {
                    //if not authenticated, return none
                    query = this.model.find({ user_id: null });
                }
                const appliedJobArray = yield query.exec();
                response.json(appliedJobArray);
            }
            catch (e) {
                response.status(500).json({ error: 'Failed to retrieve applied jobs' });
            }
        });
    }
    retrieveAppliedJobById(response, appliedJobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Retrieving applied job with id:', appliedJobId, 'for user:', userId);
            try {
                let query;
                if (userId) {
                    // find jobs that match both appliedJobId and userId
                    query = this.model.findOne({
                        appliedJobId: appliedJobId,
                        user_id: userId
                    });
                }
                else {
                    // if not authenticated, return none
                    query = this.model.findOne({
                        appliedJobId: appliedJobId,
                        user_id: null
                    });
                }
                const appliedJob = yield query.exec();
                if (!appliedJob) {
                    return response.status(404).json({ error: "Applied job not found" });
                }
                response.json(appliedJob);
            }
            catch (e) {
                response.status(500).json({ error: 'Failed to retrieve applied job' });
            }
        });
    }
    createAppliedJob(response, appliedJob, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating applied job:', JSON.stringify(appliedJob), 'for user:', userId);
            try {
                appliedJob.appliedJobId = crypto.randomBytes(16).toString('hex');
                if (userId) {
                    appliedJob.user_id = userId;
                }
                else {
                    // If userId is not provided, dont do anything
                    appliedJob.user_id = null;
                }
                // Set applied date if not provided
                if (!appliedJob.applied_date) {
                    appliedJob.applied_date = new Date();
                }
                const newAppliedJob = new this.model(appliedJob);
                const result = yield newAppliedJob.save();
                response.json(result);
            }
            catch (e) {
                response.status(500).json({ error: 'Failed to create applied job' });
            }
        });
    }
}
exports.AppliedJobModel = AppliedJobModel;
//# sourceMappingURL=AppliedJobModel.js.map