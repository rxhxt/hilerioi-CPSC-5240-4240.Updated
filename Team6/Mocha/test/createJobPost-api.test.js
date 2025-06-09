var chai = require('chai');
var chaiHttp = require('chai-http');

var expect = chai.expect;
chai.use(chaiHttp);

describe('Test JobPost Creation', function () {

    var createResponse;
    var testJobId;
    var baseUrl = "https://job-fetchr-hee6aedmcmhrgvbu.westus-01.azurewebsites.net";

    // Test data for creating a new job post
    var testJobData = {
        position_title: "Test Software Engineer",
        location: "Seattle, WA",
        company: "Test Tech Company",
        date_posted: new Date().toISOString(),
        recruiter: "Test Recruiter",
        job_description: "This is a test job posting for automated testing purposes. Develop and maintain software applications using modern technologies.",
        salary: 125000,
        status: "Open",
        url: "https://example.com/test-job-posting",
        job_work_type: "Full-time",
        is_remote: true,
        scrape_date: new Date().toISOString()
    };

    describe('Create New Job Post', function () {
        it('Should successfully create a new job post', function (done) {
            chai.request(baseUrl)
                .post("/api/v1/jobposts/unprotected")
                .send(testJobData)
                .end(function (err, res) {
                    createResponse = res;
                    testJobId = res.body.jobPostId; // Store for cleanup

                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('jobPostId');

                    console.log("Created job post with ID: " + res.body.jobPostId);
                    done();
                });
        });

        it('The created job post should have all required fields', function () {
            expect(createResponse.body).to.include.all.keys(
                "_id",
                "jobPostId",
                "position_title",
                "location",
                "date_posted",
                "company",
                "recruiter",
                "job_description",
                "salary",
                "status",
                "scrape_date",
                "url",
                "job_work_type",
                "is_remote"
            );
        });

        it('The created job post should have correct data types', function () {
            var job = createResponse.body;
            expect(job._id).to.be.a('string');
            expect(job.jobPostId).to.be.a('string');
            expect(job.position_title).to.be.a('string');
            expect(job.location).to.be.a('string');
            expect(job.company).to.be.a('string');
            expect(job.recruiter).to.be.a('string');
            expect(job.job_description).to.be.a('string');
            expect(job.salary).to.be.a('number');
            expect(job.status).to.be.a('string');
            expect(job.url).to.be.a('string');
            expect(job.job_work_type).to.be.a('string');
            expect(job.is_remote).to.be.a('boolean');
        });

        it('The created job post should contain the correct values', function () {
            var job = createResponse.body;
            expect(job.position_title).to.equal(testJobData.position_title);
            expect(job.location).to.equal(testJobData.location);
            expect(job.company).to.equal(testJobData.company);
            expect(job.recruiter).to.equal(testJobData.recruiter);
            expect(job.job_description).to.equal(testJobData.job_description);
            expect(job.salary).to.equal(testJobData.salary);
            expect(job.status).to.equal(testJobData.status);
            expect(job.url).to.equal(testJobData.url);
            expect(job.job_work_type).to.equal(testJobData.job_work_type);
            expect(job.is_remote).to.equal(testJobData.is_remote);
        });
    });

    // Cleanup: Delete the test job post after all tests complete
    after(function (done) {
        if (testJobId) {
            console.log("=== CLEANUP PROCESS ===");
            console.log("Verifying job exists before attempting deletion...");
            
            // First verify the job exists
            chai.request(baseUrl)
                .get("/api/v1/jobposts/unprotected/" + testJobId)
                .end(function (err, res) {
                    console.log("Verification - Job exists:", res.status === 200);
                    
                    if (res.status === 200) {
                        console.log("Job found, attempting deletion...");
                        console.log("Job data:", JSON.stringify(res.body, null, 2));
                        
                        // Now try to delete
                        chai.request(baseUrl)
                            .delete("/api/v1/jobposts/unprotected/" + testJobId)
                            .end(function (deleteErr, deleteRes) {
                                console.log("Delete attempt completed");
                                console.log("Delete response status:", deleteRes ? deleteRes.status : 'No response');
                                console.log("Delete response body:", deleteRes ? JSON.stringify(deleteRes.body, null, 2) : 'No body');
                                
                                if (deleteErr) {
                                    console.log("Delete error:", deleteErr.message);
                                } else if (deleteRes.status === 404) {
                                    console.log("Job not found during deletion");
                                } else if (deleteRes.status === 200) {
                                    console.log("Successfully deleted job post");
                                } else {
                                    console.log("Unexpected delete response status:", deleteRes.status);
                                }
                                
                                done(); // Call done only once, here
                            });
                    } else {
                        console.log("Job not found during verification, no deletion needed");
                        done(); // Call done here if verification fails
                    }
                });
        } else {
            console.log("No test job ID found for cleanup");
            done(); // Call done here if no testJobId
        }
    });
});