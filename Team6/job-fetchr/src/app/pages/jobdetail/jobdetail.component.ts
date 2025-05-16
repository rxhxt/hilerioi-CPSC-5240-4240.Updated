import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobproxyService, JobPost } from '../../service/jobproxy.service';
@Component({
  selector: 'app-jobdetail',
  standalone: false,
  templateUrl: './jobdetail.component.html',
  styleUrl: './jobdetail.component.css'
})
export class JobdetailComponent {

  jobPost?: JobPost;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobService: JobproxyService
  ) {
    const jobId = this.route.snapshot.paramMap.get('id') || '';
    this.jobService.getJobById(jobId).subscribe((data) => {
      this.jobPost = data;
      console.log("Retrieved job post data.");
    });
  }

  ngOnInit(): void {}

  clickEvent(): void {
    this.router.navigate(['/']);
  }
}
