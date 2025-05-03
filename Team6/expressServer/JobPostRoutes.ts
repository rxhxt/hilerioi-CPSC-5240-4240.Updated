import * as express from 'express';
import {JobPost, IJobPostModel} from './MongooseDB/model/JobPost';

class JobPostRouter {
    public router : express.Router;

    constructor() {
        this.router = express.Router();
        this.routes();
    }

    public routes() : void {

        //GET all job posts
        this.router.get('/', async (req, res, next) => {
            try {
                // Get query paraters for filtering
                const {
                    company,
                    position_title,
                    location,
                    is_remote,
                    status = 'active'
                } = req.query;

                // Execute query with mongoose
                const jobPosts = await JobPost.find().sort({date_posted: -1});

                res.status(200).json({
                    status: 'success',
                    results: jobPosts.length,
                    data: jobPosts,
                    message: 'Retrieved all job posts'
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to retrieve job posts',
                    error: error.message
                });
            }
        });

        // GET job post by ID
        this.router.get('/:id', async (req, res, next) => {
            try {
                const id = req.params.id;

                // Find a job post with the specified ID using mongoose
                const jobPost = await JobPost.findById(id);

                if (!jobPost) {
                    return res.status(404).json({
                        status: 'error',
                        message: `Job post with ID ${id} not found`
                    });
                }

                res.status(200).json({
                    status: 'success',
                    data: jobPost,
                    message: `Retrived job post with ID ${id}`
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to retrieve job post',
                    error: error.message
                });
            }
        });

        // POST new job post
        this.router.post('/', async(req, res, next) => {
            try {
                const jobPostData = req.body;

                // Create new job post using Mongoose
                const newJobPost = await JobPost.create(jobPostData);

                res.status(201).json({
                    status:'success',
                    data: newJobPost,
                    message: 'Created new job post'
                });
            } catch (error) {
                console.log(error);

                res.status(500).json({
                    status: 'error',
                    message: 'Failed to create job post',
                    error: error.message
                });
            }
        });

    }

}