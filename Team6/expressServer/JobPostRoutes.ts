import * as express from 'express';
import {
    createJobPost,
    getAllJobPost,
    getJobPostById    
} from '../MongooseDB/model/JobPostModel';  

const router = express.Router();



