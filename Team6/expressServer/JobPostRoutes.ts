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

        






    }

}