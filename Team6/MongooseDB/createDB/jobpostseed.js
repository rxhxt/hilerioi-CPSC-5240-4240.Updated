db = db.getSiblingDB('jobfetchr');
db.createCollection('jobposts');
jobpostsCollection = db.getCollection("jobposts");
jobpostsCollection.deleteMany({});
jobpostsCollection.insertMany([
  {
    jobPostId: "a1f4c9eab3d94d4c8f8e3c4e2a9f1b72",
    position_title: "Software Engineer",
    location: "Seattle, WA",
    date_posted: new Date("2024-10-01"),
    company: "Microsoft",
    recruiter: "Giorgio Himothy",
    job_description: "Develop Azure Type.",
    salary: 130000,
    status: "active",
    scrape_date: new Date(),
    url: "https://careers.microsoft.com/job/4201",
    job_work_type: "Full-time",
    is_remote: true
  },
  {
    jobPostId: "b7e1d5f6a9c84a41b0d7c1e6f3b5d4f1",
    position_title: "Data Analyst",
    location: "New York, NY",
    date_posted: new Date("2024-09-28"),
    company: "Spotify",
    recruiter: "Ben Him",
    job_description: "Put Drake on everyone's Spotify Rewind.",
    salary: 95000,
    status: "active",
    scrape_date: new Date(),
    url: "https://jobs.spotify.com/job/9311",
    job_work_type: "Full-time",
    is_remote: false
  },
  {
    jobPostId: "d4f1b9e7c2a84d4291f3a7e6b0d5c9a1",
    position_title: "Machine Learning Engineer",
    location: "San Francisco, CA",
    date_posted: new Date("2024-10-05"),
    company: "OpenAI",
    recruiter: "Avery Lin",
    job_description: "Design and optimize language models for real-world applications.",
    salary: 160000,
    status: "active",
    scrape_date: new Date(),
    url: "https://careers.openai.com/job/5832",
    job_work_type: "Full-time",
    is_remote: true
  },
  {
    jobPostId: "f9e1c6b7a3d94f4cb0e9d8c1f2a3b5d7",
    position_title: "Product Manager",
    location: "Austin, TX",
    date_posted: new Date("2024-10-03"),
    company: "Tesla",
    recruiter: "Jordan Smith",
    job_description: "Lead product development for next-gen autonomous vehicles.",
    salary: 145000,
    status: "active",
    scrape_date: new Date(),
    url: "https://careers.tesla.com/job/7745",
    job_work_type: "Full-time",
    is_remote: false
  },
  {
    jobPostId: "c1f7b9e8a4d94b42f1c3e7d5b9f0a6c2",
    position_title: "UX/UI Designer",
    location: "Remote",
    date_posted: new Date("2024-10-02"),
    company: "Airbnb",
    recruiter: "Taylor Green",
    job_description: "Create intuitive designs for the Airbnb mobile and web platforms.",
    salary: 110000,
    status: "active",
    scrape_date: new Date(),
    url: "https://careers.airbnb.com/job/6642",
    job_work_type: "Full-time",
    is_remote: true
  },
  {
    jobPostId: "e8b9c1f6d3a94f4cb1d7e9c0a5f3b6d1",
    position_title: "Cybersecurity Specialist",
    location: "Washington, DC",
    date_posted: new Date("2024-09-30"),
    company: "Lockheed Martin",
    recruiter: "Chris Howard",
    job_description: "Ensure security compliance and defend against cyber threats.",
    salary: 125000,
    status: "active",
    scrape_date: new Date(),
    url: "https://careers.lockheedmartin.com/job/8921",
    job_work_type: "Full-time",
    is_remote: false
  }
]);
