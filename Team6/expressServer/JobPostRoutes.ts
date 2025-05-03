import * as express from 'express';
import { JobPostModel } from '../MongooseDB/model/JobPostModel';

// TODO: Fix import statement 
class JobPostRoutes {
    private router: express.Router;
    private jobPostModel: JobPostModel;

    constructor(jobPostModel: JobPostModel) {
        this.router = express.Router();
        this.jobPostModel = jobPostModel;
        this.configureRoutes();
    }

    



}