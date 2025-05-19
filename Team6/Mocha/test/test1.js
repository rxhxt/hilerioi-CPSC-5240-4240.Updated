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
           '_id',
            'title',
            'company',
            'location',
            'description',
            'requirements',
            'contactEmail',
            'datePosted',
            'isActive' 
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
    
});



