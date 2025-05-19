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

    
    
});



