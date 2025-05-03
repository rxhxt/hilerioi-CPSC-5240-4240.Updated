import * as express from 'express';
import {
    createJobPost,
    retrieveAllJobPosts,
    retrieveJobPostsById    
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

router.get('/:id', async (req, res) => {
    try {
        const jobPost = await retrieveJobPostsById(req.params.id);
        if (!jobPost) {
            return res.status(404).json({error: 'Job post not found'});
        }
        res.json(jobPost);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch job post'});
    } 
});


router.get('/', async (req, res) => {
    try {
        const jobPosts = await retrieveAllJobPosts();
        res.json(jobPosts);
    } catch (error) {
        res.status(500).json({error: 'Failed to job posts'});
    }
});