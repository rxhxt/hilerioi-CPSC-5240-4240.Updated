import Mongoose = require("mongoose");

interface IJobPostModel extends Mongoose.Document {
    position_title: string;
    location: string;
    date_posted: Date;
    company: string;
    recruiter: string;
    job_description: string;
    salary: number;
    status: string;
    scrape_date: Date;
    url: string;
    job_work_type: string;
    is_remote: boolean;   
}
export {IJobPostModel};