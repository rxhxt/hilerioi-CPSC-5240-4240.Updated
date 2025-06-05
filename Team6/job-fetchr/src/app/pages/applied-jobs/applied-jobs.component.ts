import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobproxyService, AppliedJob, JobPost } from '../../service/jobproxy.service';

@Component({
  selector: 'app-applied-jobs',
  standalone: false,
  templateUrl: './applied-jobs.component.html',
  styleUrl: './applied-jobs.component.css'
})
export class AppliedJobsComponent implements OnInit {
  appliedJobs: AppliedJob[] = [];
  jobPosts: JobPost[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  filteredAppliedJobs: AppliedJob[] = [];
  sortOption: string = 'newest';

  constructor(
    private jobproxyService: JobproxyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppliedJobs();
  }

  loadAppliedJobs(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Load both applied jobs and job posts to get complete information
    this.jobproxyService.getAllAppliedJobs().subscribe({
      next: (appliedJobsData) => {
        this.appliedJobs = appliedJobsData;
        // Load job posts to get job details
        this.loadJobPostDetails();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load applied jobs. Please try again later.';
        this.loading = false;
        console.error('Error fetching applied jobs:', error);
      }
    });
  }

  loadJobPostDetails(): void {
    this.jobproxyService.getAllJobPosts().subscribe({
      next: (jobPostsData) => {
        this.jobPosts = jobPostsData;
        this.applyFiltersAndSort();
        this.loading = false;
        console.log('Applied jobs loaded:', this.appliedJobs);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load job details. Please try again later.';
        this.loading = false;
        console.error('Error fetching job posts:', error);
      }
    });
  }

  getJobDetails(jobPostId: string): JobPost | null {
    return this.jobPosts.find(job => job.jobPostId === jobPostId) || null;
  }

  searchJobs(): void {
    console.log('Searching applied jobs for:', this.searchTerm);
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    this.applyFilters();
    this.applySorting();
  }

  applyFilters(): void {
    if (!this.searchTerm?.trim()) {
      this.filteredAppliedJobs = [...this.appliedJobs];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredAppliedJobs = this.appliedJobs.filter(appliedJob => {
      const jobDetails = this.getJobDetails(appliedJob.jobPostId);
      return (
        jobDetails?.position_title?.toLowerCase().includes(term) ||
        jobDetails?.company?.toLowerCase().includes(term) ||
        jobDetails?.location?.toLowerCase().includes(term) ||
        appliedJob.status?.toLowerCase().includes(term)
      );
    });
  }

  applySorting(): void {
    if (!this.filteredAppliedJobs || this.filteredAppliedJobs.length === 0) return;

    switch (this.sortOption) {
      case 'newest':
        this.filteredAppliedJobs.sort((a, b) => 
          new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()
        );
        break;
      case 'oldest':
        this.filteredAppliedJobs.sort((a, b) => 
          new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime()
        );
        break;
      case 'status':
        this.filteredAppliedJobs.sort((a, b) => 
          (a.status || '').localeCompare(b.status || '')
        );
        break;
      case 'company':
        this.filteredAppliedJobs.sort((a, b) => {
          const jobA = this.getJobDetails(a.jobPostId);
          const jobB = this.getJobDetails(b.jobPostId);
          return (jobA?.company || '').localeCompare(jobB?.company || '');
        });
        break;
    }
  }

  get filteredJobs(): AppliedJob[] {
    return this.filteredAppliedJobs;
  }

  viewJobDetails(jobPostId: string): void {
    if (jobPostId) {
      console.log('Navigating to job details for ID:', jobPostId);
      this.router.navigate(['/job', jobPostId]);
    } else {
      console.error('Cannot navigate to job details: missing job ID');
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'accepted':
      case 'hired':
        return 'bg-success';
      case 'rejected':
      case 'declined':
        return 'bg-danger';
      case 'interview':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bi-clock';
      case 'accepted':
      case 'hired':
        return 'bi-check-circle';
      case 'rejected':
      case 'declined':
        return 'bi-x-circle';
      case 'interview':
        return 'bi-person-video';
      default:
        return 'bi-question-circle';
    }
  }
}
