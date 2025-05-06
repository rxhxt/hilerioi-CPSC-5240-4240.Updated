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
            user_id: String,
            job_id: String,
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
    retrieveAllAppliedJobs(response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Retrieving all applied jobs');
            const query = this.model.find({});
            try {
                const appliedJobArray = yield query.exec();
                response.json(appliedJobArray);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    retrieveAppliedJobById(response, appliedJobId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Retrieving applied job with id: ' + appliedJobId);
            const query = this.model.findOne({ appliedJobId: appliedJobId });
            try {
                const appliedJob = yield query.exec();
                response.json(appliedJob);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    createAppliedJob(response, appliedJob) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating applied job: ' + JSON.stringify(appliedJob));
            try {
                const newAppliedJob = new this.model(appliedJob);
                const result = yield newAppliedJob.save();
                response.json(result);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.AppliedJobModel = AppliedJobModel;
//# sourceMappingURL=AppliedJobModel.js.map