var chai = require('chai');
var chaiHttp = require('chai-http');
var async = require('async');

var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var http = require('http');
chai.use(chaiHttp);

describe('Test Jobpost Detail results', function () {

    var jobId;
    var requestResult;
    var response;

    before(function (done) {
        chai.request("http://localhost:8080")
            .get("/api/v1/jobposts")
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.greaterThan(0);
                
                // Save the ID of the first job post for our detail test
                jobId = res.body[0].jobPostId;
                done();
            });
    });

});