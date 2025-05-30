import { __decorate } from "tslib";
import { Component } from '@angular/core';
let JoblistingsComponent = class JoblistingsComponent {
    jobproxyService;
    router;
    logoPath = 'assets/images/logo-white.png';
    jobPosts = [];
    loading = true;
    errorMessage = '';
    searchTerm = '';
    filteredJobPosts = [];
    sortOption = 'newest'; // Default sort option
    constructor(jobproxyService, router) {
        this.jobproxyService = jobproxyService;
        this.router = router;
    }
    ngOnInit() {
        this.loadJobPosts();
    }
    loadJobPosts() {
        this.loading = true;
        this.jobproxyService.getAllJobPosts().subscribe({
            next: (data) => {
                this.jobPosts = data;
                this.applyFiltersAndSort(); // Apply filters and sorting
                this.loading = false;
                console.log('Retrieved jobs: ', this.jobPosts);
            },
            error: (error) => {
                this.errorMessage = 'Failed to load job listings. Please try again later.';
                this.loading = false;
                console.log('Error fetching job posts:', error);
            }
        });
    }
    searchJobs() {
        console.log('Searching for:', this.searchTerm);
        this.applyFiltersAndSort();
    }
    applyFiltersAndSort() {
        this.applyFilters();
        this.applySorting();
    }
    // Filter jobs based on search term
    applyFilters() {
        if (!this.searchTerm?.trim()) {
            this.filteredJobPosts = [...this.jobPosts];
            return;
        }
        const term = this.searchTerm.toLowerCase();
        this.filteredJobPosts = this.jobPosts.filter(job => job.position_title?.toLowerCase().includes(term) ||
            job.company?.toLowerCase().includes(term) ||
            job.location?.toLowerCase().includes(term) ||
            job.job_description?.toLowerCase().includes(term));
    }
    // Apply sorting to filtered jobs
    applySorting() {
        if (!this.filteredJobPosts || this.filteredJobPosts.length === 0)
            return;
        switch (this.sortOption) {
            case 'newest':
                this.filteredJobPosts.sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime());
                break;
            case 'oldest':
                this.filteredJobPosts.sort((a, b) => new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime());
                break;
            case 'company':
                this.filteredJobPosts.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
                break;
        }
    }
    get filteredJobs() {
        return this.filteredJobPosts;
    }
    viewJobDetails(jobPostId) {
        if (jobPostId) {
            console.log('Navigating to job details for ID:', jobPostId);
            this.router.navigate(['/job', jobPostId]);
        }
        else {
            console.error('Cannot navigate to job details: missing job ID');
        }
    }
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }
};
JoblistingsComponent = __decorate([
    Component({
        selector: 'app-joblistings',
        standalone: false,
        templateUrl: './joblistings.component.html',
        styleUrl: './joblistings.component.css'
    })
], JoblistingsComponent);
export { JoblistingsComponent };
