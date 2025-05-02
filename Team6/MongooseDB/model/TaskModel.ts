import * as Mongoose from "mongoose";
import {IAppliedJobModel} from '../interfaces/IAppliedJobModel';

class TaskModel {
    public schema:any;
    public innerSchema:any;
    public model:any;
    public dbConnectionString:string;

    public constructor(DB_CONNECTION_STRING:string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = new Mongoose.Schema(
            {
                appliedJobId: String,
                user_id: String,
                job_id: String,
                applied_date: Date,
                status: String
            }, {collection: 'appliedjobs'}
        );
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});
            this.model = Mongoose.model<IAppliedJobModel>("Task", this.schema);    
        }
        catch (e) {
            console.error(e);        
        }
    }
    
    public async retrieveAllAppliedJobs(response:any) {
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

    public async retrieveAppliedJobById(response:any, appliedJobId:string) {
        console.log('Retrieving applied job with id: ' + appliedJobId);
        const query = this.model.findOne({appliedId: appliedJobId});
        try {
            const appliedJob = await query.exec();
            response.json(appliedJob);
        }
        catch (e) {
            console.error(e);
        }
    }

    public async createAppliedJob(response:any, appliedJob:any) {
        console.log('Creating applied job: ' + JSON.stringify(appliedJob));
        const newAppliedJob = new this.model(appliedJob);
        const query = newAppliedJob.save();
        try {
            const result = await query.exec();
            response.json(result);
        }
        catch (e) {
            console.error(e);
        }
    }
}
export {TaskModel};