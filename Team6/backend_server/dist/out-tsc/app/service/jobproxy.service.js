import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let JobproxyService = class JobproxyService {
    httpClient;
    hostUrl = 'http://localhost:8080/';
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    // JobPost endpoints
    getAllJobPosts() {
        return this.httpClient.get(this.hostUrl + 'api/v1/jobposts');
    }
    getJobPostById(jobPostId) {
        return this.httpClient.get(this.hostUrl + 'api/v1/jobposts/' + jobPostId);
    }
    createJobPost(jobPostData) {
        return this.httpClient.post(this.hostUrl + 'api/v1/jobposts', jobPostData);
    }
    // AppliedJob endpoints
    getAllAppliedJobs() {
        return this.httpClient.get(this.hostUrl + 'api/v1/appliedjobs');
    }
    getAppliedJobById(appliedJobId) {
        return this.httpClient.get(this.hostUrl + 'api/v1/appliedjobs/' + appliedJobId);
    }
    createAppliedJob(appliedJobData) {
        return this.httpClient.post(this.hostUrl + 'api/v1/appliedjobs', appliedJobData);
    }
};
JobproxyService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], JobproxyService);
export { JobproxyService };
