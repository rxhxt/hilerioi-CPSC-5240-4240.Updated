import Mongoose = require("mongoose");

interface IAppliedJobModel extends Mongoose.Document {
    appliedJobId: string;
    user_id: string;
    job_id: string;
    applied_date: Date;
    status: string;
}
export {IAppliedJobModel};
