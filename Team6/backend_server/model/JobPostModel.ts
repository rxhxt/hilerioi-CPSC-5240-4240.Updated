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

    public async deleteJobPost(response: any, jobPostId: string) {
        console.log('Deleting job post with id: ' + jobPostId);
        try {
            // Try deleting by jobPostId first
            let result = await this.model.deleteOne({ jobPostId: jobPostId });
            
            // If that didn't work, try by _id
            if (result.deletedCount === 0) {
                console.log('Trying to delete by _id instead...');
                result = await this.model.deleteOne({ _id: jobPostId });
            }
            
            if (result.deletedCount === 0) {
                response.status(404).json({ 
                    error: 'Job post not found',
                    jobPostId: jobPostId 
                });
            } else {
                response.json({ 
                    message: 'Job post deleted successfully', 
                    deletedCount: result.deletedCount,
                    jobPostId: jobPostId 
                });
            }
        } catch (e) {
            console.error('Error deleting job post:', e);
            response.status(500).json({ 
                error: 'Failed to delete job post',
                details: e.message 
            });
        }
    }

    public async CreateJobPost(response:any, data:any) {
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