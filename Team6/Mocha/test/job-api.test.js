var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test JobListing results', function(){
    
    var requestResult;
    var response;

    before(function(done){
        chai.request("http://localhost:8080")
        .get("/api/v1/jobposts")
        .end(function (err, res){
            requestResult = res.body;
            response = res;
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
        });
    });

    it('Should return an array object with 1 object', function(){
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.be.at.least(1);
        expect(response).to.have.headers;
    });

    it('The entries in the array have the expected fields from JobPost interface', function(){
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
        "url",
        "job_work_type",
        "is_remote",
        "__v"
 
        );
    });

    it('The job post data has the correct types', function(){
        const job = requestResult[0];
        expect(job._id).to.be.a('string');
        expect(job.title).to.be.a('string');
        expect(job.company).to.be.a('string');
        expect(job.location).to.be.a('string');
        expect(job.description).to.be.a('string');
        expect(job.requirements).to.be.an('array');
        expect(job.contactEmail).to.be.a('string');
        expect(job.isActive).to.be.a('boolean');
    });

     it('The datePosted field is a valid date string', function(){
        const job = requestResult[0];
        expect(isNan(Date.parse(job.datePosed))).to.be.false;
    });

      it('Should handle specific field validation', function(){
        const job = requestResult[0];
        expect(job.requirements).to.be.an('array').that.is.not.empty;
        expect(job.title.length).to.be.greaterThan(0);
        expect(job.company.length).to.be.greaterThan(0);
    });
    
     it('Should match the expected data format for UI rendering', function(){
        const job = requestResult[0];
       expect(job).to.have.property('title');
        expect(job).to.have.property('company');
        expect(job).to.have.property('location');
        expect(job).to.have.property('datePosted');
    });
});



