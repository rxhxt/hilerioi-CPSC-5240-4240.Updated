var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test JobListing results', function () {

    var requestResult;
    var response;

    before(function (done) {
        chai.request("https://job-fetchr-hee6aedmcmhrgvbu.westus-01.azurewebsites.net/")
            .get("/api/v1/jobposts/unprotected")
            .end(function (err, res) {
                requestResult = res.body;
                response = res;
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('Should return an array object with 6 object', function () {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.at.least(6);
        expect(response).to.have.headers;
    });

    it('The entries in the array have the expected fields from JobPost interface', function () {
        expect(requestResult[0]).to.include.all.keys(
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

    it('The job post data has the correct types', function () {
        const job = requestResult[0];
        expect(job._id).to.be.a('string');
        expect(job.position_title).to.be.a('string');
        expect(job.company).to.be.a('string');
        expect(job.location).to.be.a('string');
        expect(job.job_description).to.be.a('string');
    });

    it('The datePosted field is a valid date string', function () {
        const job = requestResult[0];
        expect(isNaN(Date.parse(job.date_posted))).to.be.false;
    });

    it('Should handle specific field validation', function () {
        const job = requestResult[0];
        expect(job.position_title.length).to.be.greaterThan(0);
        expect(job.company.length).to.be.greaterThan(0);
    });

    it('The elements in the array have the expected properties', function () {
        expect(response.body).to.have.length(6);
        expect(response.body).to.satisfy(
            function (body) {
                for (var i = 0; i < body.length; i++) {
                    const job = body[i];
                    expect(job).to.have.property('position_title');
                    expect(job).to.have.property('company');
                    expect(job).to.have.property('location');
                    expect(job).to.have.property('date_posted');
                }
                return true;
            });
    });
});



