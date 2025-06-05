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
                user_id: { type: String, required: true },
                job_id: { type: String, required: true },
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

    public async retrieveAllAppliedJobs(response: any, userId?: string) {
        console.log('Retrieving all applied jobs for user:', userId);
        
        try {
            let query;
            if (userId) {
                //filter by user ID (ssoID)
                query = this.model.find({ user_id: userId });
            } else {
                //if not authenticated, return none
                query = this.model.find({ user_id: null });
            }
            
            const appliedJobArray = await query.exec();
            response.json(appliedJobArray);
        } catch (e) {
            response.status(500).json({ error: 'Failed to retrieve applied jobs' });
        }
    }

    public async retrieveAppliedJobById(response: any, appliedJobId: string, userId?: string) {
        console.log('Retrieving applied job with id:', appliedJobId, 'for user:', userId);
        
        try {
            let query;
            if (userId) {
                // find jobs that match both appliedJobId and userId
                query = this.model.findOne({ 
                    appliedJobId: appliedJobId, 
                    user_id: userId 
                });
            } else {
                // if not authenticated, return none
                query = this.model.findOne({ 
                    appliedJobId: appliedJobId, 
                    user_id: null 
                });
            }
            
            const appliedJob = await query.exec();
            if (!appliedJob) {
                return response.status(404).json({ error: "Applied job not found" });
            }
            response.json(appliedJob);
        } catch (e) {
            response.status(500).json({ error: 'Failed to retrieve applied job' });
        }
    }

    public async createAppliedJob(response: any, appliedJob: any, userId?: string) {
        console.log('Creating applied job:', JSON.stringify(appliedJob), 'for user:', userId);
        
        try {
            appliedJob.appliedJobId = crypto.randomBytes(16).toString('hex');
            
            if (userId) {
                appliedJob.user_id = userId;
            }
            else{
                // If userId is not provided, dont do anything
                appliedJob.user_id = null;
            }
            
            // Set applied date if not provided
            if (!appliedJob.applied_date) {
                appliedJob.applied_date = new Date();
            }
            
            const newAppliedJob = new this.model(appliedJob);
            const result = await newAppliedJob.save();
            response.json(result);
        } catch (e) {
            response.status(500).json({ error: 'Failed to create applied job' });
        }
    }
}
export { AppliedJobModel };