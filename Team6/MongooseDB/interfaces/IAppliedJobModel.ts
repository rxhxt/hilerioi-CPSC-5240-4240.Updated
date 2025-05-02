import Mongoose = require("mongoose");

interface IAppliedJobModel extends Mongoose.Document {
    user_id: string;
    job_id: string;
    applied_date: Date;
    status: string;
}
export {IAppliedJobModel};
