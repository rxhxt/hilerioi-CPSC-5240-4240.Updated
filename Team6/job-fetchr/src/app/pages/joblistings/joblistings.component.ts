import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JobproxyService, JobPost } from '../../service/jobproxy.service';


@Component({
  selector: 'app-joblistings',
  standalone: false,
  templateUrl: './joblistings.component.html',
  styleUrl: './joblistings.component.css'
})
export class JoblistingsComponent {
  logoPath: string = 'assets/images/logo-white.png';
  jobPosts: JobPost[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  filteredJobPosts: JobPost[] = [];
  sortOption: string = 'newest'; // Default sort option

  constructor(private jobproxyService: JobproxyService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobPosts();
  }

  loadJobPosts(): void {
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

  searchJobs(): void {
    console.log('Searching for:', this.searchTerm);
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    this.applyFilters();
    this.applySorting();
  }
  
  // Filter jobs based on search term
  applyFilters(): void {
    if (!this.searchTerm?.trim()) {
      this.filteredJobPosts = [...this.jobPosts];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredJobPosts = this.jobPosts.filter(job => 
      job.position_title?.toLowerCase().includes(term) ||
      job.company?.toLowerCase().includes(term) || 
      job.location?.toLowerCase().includes(term) ||
      job.job_description?.toLowerCase().includes(term)
    );
  }

  // Apply sorting to filtered jobs
  applySorting(): void {
    if (!this.filteredJobPosts || this.filteredJobPosts.length === 0) return;
    
    switch(this.sortOption) {
      case 'newest':
        this.filteredJobPosts.sort((a, b) => 
          new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime()
        );
        break;
      case 'oldest':
        this.filteredJobPosts.sort((a, b) => 
          new Date(a.date_posted).getTime() - new Date(b.date_posted).getTime()
        );
        break;
      case 'company':
        this.filteredJobPosts.sort((a, b) => 
          (a.company || '').localeCompare(b.company || '')
        );
        break;
    }
  }

  get filteredJobs(): JobPost[] {
    return this.filteredJobPosts;
  }

  viewJobDetails(jobPostId: string | undefined): void {
    if (jobPostId) {
      console.log('Navigating to job details for ID:', jobPostId);
      this.router.navigate(['/job', jobPostId]);
    } else {
      console.error('Cannot navigate to job details: missing job ID');
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
