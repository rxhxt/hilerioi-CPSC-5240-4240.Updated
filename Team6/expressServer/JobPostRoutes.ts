import * as express from 'express';
import {
    createJobPost,
    getAllJobPost,
    getJobPostById    
} from '../MongooseDB/model/JobPostModel';  

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const jobPost = await createJobPost(req.body);
        res.status(201).json(jobPost);
    } catch (error) {
        res.status(500).json({error: 'Failed to create job post'});
    }
});

