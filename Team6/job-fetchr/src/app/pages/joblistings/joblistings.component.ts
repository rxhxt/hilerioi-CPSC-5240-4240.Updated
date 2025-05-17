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
}
