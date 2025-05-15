import * as Mongoose from "mongoose";
import {IJobPostModel} from '../interfaces/IJobPostModel';
const crypto = require('crypto');

class JobPostModel {
    public schema:any;
    public model:any;
    public dbConnectionString:string;

    public constructor(DB_CONNECTION_STRING:string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new Mongoose.Schema(
            {
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
            }, {collection: 'jobposts'}
        );    
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<IJobPostModel>("JobPost", this.schema);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async retrieveAllJobPosts(response:any) {
        console.log('Retrieving all job posts');
        var query = this.model.find({});
        try {
            const jobPostArray = await query.exec();
            response.json(jobPostArray);
        }
        catch(e) {
            console.error(e);
        }
    }

    public async retrieveJobPostsById(response:any, job_id:string) {
        console.log('Retrieving job post with id: ' + job_id);
        var query = this.model.findOne({jobPostId: job_id});
        try {
            const result = await query.exec();
            response.json(result) ;
        }
        catch (e) {
            console.error(e);
        }
    }

    public async CreateJobPost(response:any, data:any) {
        console.log('Creating job post with data: ' + JSON.stringify(data));
        try {
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const jobPostData = {
            ...data,
            jobPostId: uniqueId
            };

            const newJobPost = new this.model(jobPostData);
            const result = await newJobPost.save();
            response.json(result);
        }
        catch (e) {
            console.error(e);
            response.status(500).json({ error: 'Failed to create job post' });
        }
    }
        
        
}
export {JobPostModel};