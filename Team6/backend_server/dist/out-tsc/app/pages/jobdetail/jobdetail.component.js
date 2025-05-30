import { __decorate } from "tslib";
import { Component } from '@angular/core';
let JobdetailComponent = class JobdetailComponent {
    route;
    jobproxyService;
    jobId = null;
    job = null;
    loading = true;
    errorMessage = '';
    constructor(route, jobproxyService) {
        this.route = route;
        this.jobproxyService = jobproxyService;
    }
    ngOnInit() {
        // Get the job ID from the route parameters
        this.route.paramMap.subscribe(params => {
            this.jobId = params.get('id');
            if (this.jobId) {
                this.loadJobDetails(this.jobId);
            }
            else {
                this.errorMessage = 'Job ID not provided';
                this.loading = false;
            }
        });
    }
    loadJobDetails(jobId) {
        this.loading = true;
        if (jobId) {
            this.jobproxyService.getJobPostById(jobId).subscribe({
                next: (jobData) => {
                    this.job = jobData;
                    this.loading = false;
                    console.log('Job details loaded:', this.job);
                },
                error: (error) => {
                    this.errorMessage = 'Failed to load job details. Please try again later.';
                    this.loading = false;
                    console.error('Error fetching job details:', error);
                }
            });
        }
        else {
            this.loading = false;
            this.errorMessage = 'No job ID provided';
        }
    }
    formatDate(date) {
        if (!date)
            return 'N/A';
        return new Date(date).toLocaleDateString();
    }
    applyForJob() {
        //TODO: This will be implemented for the job application functionality
        console.log('Apply for job clicked');
    }
};
JobdetailComponent = __decorate([
    Component({
        selector: 'app-jobdetail',
        standalone: false,
        templateUrl: './jobdetail.component.html',
        styleUrl: './jobdetail.component.css'
    })
], JobdetailComponent);
export { JobdetailComponent };
