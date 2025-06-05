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
    
    this.jobproxyService.getAllAppliedJobs().subscribe({
      next: (appliedJobsData) => {
        this.appliedJobs = appliedJobsData;
        this.loadJobPostDetails();
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Please log in to view your applied jobs.';
        } else {
          this.errorMessage = 'Failed to load applied jobs. Please try again later.';
        }
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

  // Statistics calculation methods
  getTotalApplications(): number {
    return this.appliedJobs.length;
  }

  getPendingApplications(): number {
    return this.appliedJobs.filter(job => job.status?.toLowerCase() === 'pending').length;
  }

  getInterviewApplications(): number {
    return this.appliedJobs.filter(job => job.status?.toLowerCase() === 'interview').length;
  }

  getAcceptedApplications(): number {
    return this.appliedJobs.filter(job => 
      job.status?.toLowerCase() === 'accepted' || job.status?.toLowerCase() === 'hired'
    ).length;
  }

  searchJobs(): void {
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
      const jobDetails = this.getJobDetails(appliedJob.job_id);
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
          new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime()
        );
        break;
      case 'oldest':
        this.filteredAppliedJobs.sort((a, b) => 
          new Date(a.applied_date).getTime() - new Date(b.applied_date).getTime()
        );
        break;
      case 'status':
        this.filteredAppliedJobs.sort((a, b) => 
          (a.status || '').localeCompare(b.status || '')
        );
        break;
      case 'company':
        this.filteredAppliedJobs.sort((a, b) => {
          const jobA = this.getJobDetails(a.job_id);
          const jobB = this.getJobDetails(b.job_id);
          return (jobA?.company || '').localeCompare(jobB?.company || '');
        });
        break;
    }
  }

  get filteredJobs(): AppliedJob[] {
    return this.filteredAppliedJobs;
  }

  viewJobDetails(appliedJob: AppliedJob): void {
    if (appliedJob.job_id) {
      this.router.navigate(['/job', appliedJob.job_id]);
    } else {
      console.error('missing job ID');
    }
  }

  openOriginalPost(url: string): void {
    if (url) {
      window.open(url, '_blank');
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

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFiltersAndSort();
  }

  refreshAppliedJobs(): void {
    this.loadAppliedJobs();
  }
}
