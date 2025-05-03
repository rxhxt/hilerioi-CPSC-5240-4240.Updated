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

    private configureRoutes(): void {
        // Get all job posts
        this.router.get('/api/v1/jobposts', async (req, res) => {
            await this.jobPostModel.retrieveAllJobPosts(res);
        });

        // Get job post by id
        this.router.get('/api/v1/jobposts/:jobPostId', async (req, res) => {
            const jobPostId = req.params.jobPostId;
            await this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        });

        // Create new job post
        this.router.post('/api/v1/jobposts', async (req, res) => {
            const jobPostData = req.body;
            await this.jobPostModel.CreateJobPost(res, jobPostData);
        });
    }

    public getRouter() : express.Router {
        return this.router;
    }


}

export {JobPostRoutes}