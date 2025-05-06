db.createCollection('appliedjobs');
appliedjobsCollection = db.getCollection("appliedjobs");
appliedjobsCollection.deleteMany({});

// make sure job_id matches the jobPostId in jobpostseed.js
appliedjobsCollection.insertMany([
  {
    appliedJobId: "AJ001",
    user_id: "user123",
    job_id: "ACD12",
    applied_date: new Date("2024-10-05"),
    status: "applied"
  },
  {
    appliedJobId: "AJ002",
    user_id: "user123",
    job_id: "TBD16",
    applied_date: new Date("2024-10-06"),
    status: "interviewing"
  }
]);
