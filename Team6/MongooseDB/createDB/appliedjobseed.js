db.createCollection('appliedjobs');
appliedjobsCollection = db.getCollection("appliedjobs");
appliedjobsCollection.deleteMany({});

// make sure job_id matches the jobPostId in jobpostseed.js
appliedjobsCollection.insertMany([
  {
    appliedJobId: "f1c9e3b7d8a94f4c8b1e3d2f4a6c7e9b",
    user_id: "user123",
    job_id: "a1f4c9eab3d94d4c8f8e3c4e2a9f1b72", // Microsoft
    applied_date: new Date("2024-10-05"),
    status: "applied"
  },
  {
    appliedJobId: "c7e9f1d8a3b94c4eb0d7c1f6e2a9b3d4",
    user_id: "user123",
    job_id: "b7e1d5f6a9c84a41b0d7c1e6f3b5d4f1", // Spotify
    applied_date: new Date("2024-10-06"),
    status: "interviewing"
  },
  {
    appliedJobId: "a9f3c1e7b4d94f4ca0e7d9c1b5f3a6d8",
    user_id: "user456",
    job_id: "d4f1b9e7c2a84d4291f3a7e6b0d5c9a1", // OpenAI
    applied_date: new Date("2024-10-07"),
    status: "applied"
  },
  {
    appliedJobId: "b6d1c9f8e3a94f4cb1d8e7c0f5a3b9d7",
    user_id: "user789",
    job_id: "c1f7b9e8a4d94b42f1c3e7d5b9f0a6c2", // Airbnb
    applied_date: new Date("2024-10-08"),
    status: "offer_received"
  }
]);
