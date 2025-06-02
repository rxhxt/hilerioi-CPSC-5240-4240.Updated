import * as express from 'express';
import { JobPostModel } from './model/JobPostModel';


class JobPostRoutes {
    private router: express.Router;
    private jobPostModel: JobPostModel;

    constructor(jobPostModel: JobPostModel) {
        this.router = express.Router();
        this.jobPostModel = jobPostModel;
        this.configureRoutes();
    }

    private configureRoutes(): void {
        // -------------------Non Validated Routes below-------------------
        // Get all job posts
        this.router.get('/api/v1/jobposts/unprotected', async (req, res) => {
            await this.jobPostModel.retrieveAllJobPosts(res);
        });

        // Get job post by id
        this.router.get('/api/v1/jobposts/unprotected/:jobPostId', async (req, res) => {
            const jobPostId = req.params.jobPostId;
            await this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        });

        // Create new job post
        this.router.post('/api/v1/jobposts/unprotected', async (req, res) => {
            const jobPostData = req.body;
            await this.jobPostModel.CreateJobPost(res, jobPostData);
        });


        // -------------------Validated Routes below-------------------
        // Get all job posts
        this.router.get('/api/v1/jobposts',this.validateAuth, async (req, res) => {
            await this.jobPostModel.retrieveAllJobPosts(res);
        });

        // Get job post by id
        this.router.get('/api/v1/jobposts/:jobPostId', this.validateAuth, async (req, res) => {
            const jobPostId = req.params.jobPostId;
            await this.jobPostModel.retrieveJobPostsById(res, jobPostId);
        });

        // Create new job post
        this.router.post('/api/v1/jobposts', this.validateAuth, async (req, res) => {
            const jobPostData = req.body;
            await this.jobPostModel.CreateJobPost(res, jobPostData);
        });
    }

    public getRouter() : express.Router {
        return this.router;
    }

    private validateAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
        console.log('Validating authentication');
    }
}

export {JobPostRoutes}