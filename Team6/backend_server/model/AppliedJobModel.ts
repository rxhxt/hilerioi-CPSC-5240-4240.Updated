import * as Mongoose from "mongoose";
import { IAppliedJobModel } from '../interfaces/IAppliedJobModel';
const crypto = require('crypto');

class AppliedJobModel {
    public schema: any;
    public innerSchema: any;
    public model: any;
    public dbConnectionString: string;

    public constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema(
            {
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
            }, { collection: 'appliedjobs' }
        );
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<IAppliedJobModel>("AppliedJob", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async retrieveAllAppliedJobs(response: any) {
        console.log('Retrieving all applied jobs');
        const query = this.model.find({});
        try {
            const appliedJobArray = await query.exec();
            response.json(appliedJobArray);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async retrieveAppliedJobById(response: any, appliedJobId: string) {
        console.log('Retrieving applied job with id: ' + appliedJobId);
        const query = this.model.findOne({ appliedJobId: appliedJobId });
        try {
            const appliedJob = await query.exec();
            response.json(appliedJob);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async createAppliedJob(response: any, appliedJob: any) {
        console.log('Creating applied job: ' + JSON.stringify(appliedJob));
        try {
            appliedJob.appliedJobId = crypto.randomBytes(16).toString('hex');
            const newAppliedJob = new this.model(appliedJob);
            const result = await newAppliedJob.save();
            response.json(result);
        }
        catch (e) {
            console.error(e);
        }
    }
}
export { AppliedJobModel };