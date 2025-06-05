import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobproxyService, JobPost, AppliedJob } from '../../service/jobproxy.service';

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
  isApplying: boolean = false;
  hasApplied: boolean = false;
  appliedJobId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private jobproxyService: JobproxyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the job ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');
      if (this.jobId) {
        this.loadJobDetails(this.jobId);
        this.checkIfAlreadyApplied();
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

  checkIfAlreadyApplied(): void {
    if (this.jobId) {
      this.jobproxyService.getAllAppliedJobs().subscribe({
        next: (appliedJobs) => {
          const existingApplication = appliedJobs.find(appliedJob => appliedJob.job_id === this.jobId);
          if (existingApplication) {
            this.hasApplied = true;
            this.appliedJobId = existingApplication.appliedJobId;
          }
        },
        error: (error) => {
          console.error('Error checking applied jobs:', error);
        }
      });
    }
  }

  applyForJob(): void {
    if (!this.job || !this.jobId || this.hasApplied || this.isApplying) {
      return;
    }

    this.isApplying = true;

    const applicationData: AppliedJob = {
      appliedJobId: '',
      user_id: '',
      job_id: this.jobId,
      applied_date: new Date(),
      status: 'pending'
    };

    this.jobproxyService.createAppliedJob(applicationData).subscribe({
      next: (result) => {
        this.hasApplied = true;
        this.appliedJobId = result.appliedJobId;
        this.isApplying = false;
        
        alert('Application submitted successfully!');
      },
      error: (error) => {
        this.isApplying = false;
  
        if (error.status === 401) {
          alert('Please log in to apply for jobs.');
        } else {
          alert('Failed to submit application. Please try again.');
        }
      }
    });
  }

  viewApplicationStatus(): void {
    if (this.appliedJobId) {
      this.router.navigate(['/applied-jobs']);
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}