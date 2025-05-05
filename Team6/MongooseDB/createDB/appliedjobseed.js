db.createCollection('appliedjobs');
appliedjobsCollection = db.getCollection("appliedjobs");
appliedjobsCollection.deleteMany({});

appliedjobsCollection.insertMany([
  {
    appliedJobId: "AJ001",
    user_id: "user123",
    job_id: "ACD12", // make sure it matches the jobPostId in jobpostseed.js
    applied_date: new Date("2024-10-05"),
    status: "applied"
  },
  {
    appliedJobId: "AJ002",
    user_id: "user123",
    job_id: "TBD16",  // make sure it matches the jobPostId in jobpostseed.js
    applied_date: new Date("2024-10-06"),
    status: "interviewing"
  }
]);
