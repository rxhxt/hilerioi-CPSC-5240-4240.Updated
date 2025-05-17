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
  logoPath: string = '';
  jobPosts: JobPost[] = [];
  loadingJobs: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';

  constructor( private jobproxyService: JobproxyService, private router: Router){}

  ngOnInit(): void {
    this.loadJobPosts();
  }

  loadJobPosts(): void {
    this.loadingJobs = true;
    this.jobproxyService.getAllJobPosts().subscribe({
      next: (data) => {
        this.jobPosts = data;
        this.loadingJobs = false;
        console.log('Reteived jobs: ', this.jobPosts);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load job listings. Please try again later.';
        this.loadingJobs = false;
        console.log('Error fetching job posts:', error);
      }
    });
  }

  viewJobDetails(jobPostId: string): void{
    this.router.navigate(['/job', jobPostId]);
  }

  get filteredJobs(): JobPost[] {
    if(!this.searchTerm?.trim()) {
      return this.jobPosts;
    }

    const term = this.searchTerm.toLowerCase();
    return this.jobPosts.filter( job => 
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) || 
      job.location.toLowerCase().includes(term)
    );
  }
}
