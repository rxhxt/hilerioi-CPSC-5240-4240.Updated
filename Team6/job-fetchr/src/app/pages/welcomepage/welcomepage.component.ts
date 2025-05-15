import { Component } from '@angular/core';
import { JobproxyService, JobPost } from '../../../jobproxy.service';

@Component({
  selector: 'app-welcomepage',
  standalone: false,
  templateUrl: './welcomepage.component.html',
  styleUrl: './welcomepage.component.css'
})
export class WelcomepageComponent {
  logoPath: string = 'img/logo-white.png'; // Adjust this path based on your project structure
  jobPosts: JobPost[] = [];
  loadingJobs: boolean = false;
  errorMessage: string = '';
  
  constructor(private jobproxyService: JobproxyService) { }
  
  ngOnInit(): void {
    this.getJobPosts();
  }

  getJobPosts(): void {
    this.loadingJobs = true;
    this.jobproxyService.getAllJobPosts().subscribe({
      next: (jobs) => {
        this.jobPosts = jobs;
        this.loadingJobs = false;
        console.log('Retrieved jobs:', this.jobPosts);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load job posts. Please try again later.';
        this.loadingJobs = false;
        console.error('Error fetching jobs:', error);
      }
    });
  }
}
