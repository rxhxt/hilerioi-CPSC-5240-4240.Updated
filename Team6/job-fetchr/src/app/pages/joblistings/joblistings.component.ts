import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JobproxyService, JobPost } from '../../../jobproxy.service';


@Component({
  selector: 'app-joblistings',
  standalone: false,
  templateUrl: './joblistings.component.html',
  styleUrl: './joblistings.component.css'
})
export class JoblistingsComponent {
  logoPath: string = 'Team6/job-fetchr/src/app/pages/welcomepage/img/logo-white.png';
  jobPosts: JobPost[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(private jobproxyService: JobproxyService, private router: Router){}

  ngOnInit(): void {
    this.loadJobPosts();
  }

  loadJobPosts(): void {
    this.loading = true;
    this.jobproxyService.getAllJobPosts().subscribe({
      next: (data) => {
        this.jobPosts = data;
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

  viewJobDetails(jobPostId: string | undefined): void {
    if (jobPostId){
      this.router.navigate(['/job', jobPostId]);
    }
    
  }

  get filteredJobs(): JobPost[] {
    if (!this.searchTerm?.trim()) {
      return this.jobPosts;
    }

    const term = this.searchTerm.toLowerCase();
    return this.jobPosts.filter(job => 
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) || 
      job.location.toLowerCase().includes(term)
    );
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
