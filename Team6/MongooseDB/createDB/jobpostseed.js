db = db.getSiblingDB('jobfetchr');
db.createCollection('jobposts');
jobpostsCollection = db.getCollection("jobposts");
jobpostsCollection.remove({});

jobpostsCollection.insertMany([
  {
    jobPostId: "ACD12",
    position_title: "Software Engineer",
    location: "Seattle, WA",
    date_posted: new Date("2024-10-01"),
    company: "Microsoft",
    recruiter: "Giorgio Himothy",
    job_description: "Develop Azure Type Shi.",
    salary: 130000,
    status: "active",
    scrape_date: new Date(),
    url: "https://careers.microsoft.com/job/4201",
    job_work_type: "Full-time",
    is_remote: true
  },
  {
    jobPostId: "TBD16",
    position_title: "Data Analyst",
    location: "New York, NY",
    date_posted: new Date("2024-09-28"),
    company: "Spotify",
    recruiter: "Ben Him",
    job_description: "Put Drake on everyones Spotify Rewind.",
    salary: 95000,
    status: "active",
    scrape_date: new Date(),
    url: "https://jobs.spotify.com/job/9311",
    job_work_type: "Full-time",
    is_remote: false
  }
]);
