import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobproxyService, JobPost } from '../../service/jobproxy.service';

@Component({
  selector: 'app-jobdetail',
  standalone: false,
  templateUrl: './jobdetail.component.html',
  styleUrl: './jobdetail.component.css'
})
export class JobdetailComponent implements OnInit {
  jobId: string | null = null;
  job: JobPost | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private jobproxyService: JobproxyService
  ) {}

  ngOnInit(): void {
    // Get the job ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');
      if (this.jobId) {
        this.loadJobDetails(this.jobId);
      } else {
        this.errorMessage = 'Job ID not provided';
        this.loading = false;
      }
    });
  }

  loadJobDetails(jobId: string | null): void {
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
    } else {
      this.loading = false;
      this.errorMessage = 'No job ID provided';
    }
  }

  formatDate(date: Date | undefined): string {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
  }

  applyForJob(): void {
    //TODO: This will be implemented for the job application functionality
    console.log('Apply for job clicked');
  }
}