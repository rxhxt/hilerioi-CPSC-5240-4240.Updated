import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { JobproxyService } from '../../service/jobproxy.service';
@Component({
  selector: 'app-jobdetail',
  standalone: false,
  templateUrl: './jobdetail.component.html',
  styleUrl: './jobdetail.component.css'
})
export class JobdetailComponent {
  job: any;

  constructor(private route: ActivatedRoute, private jobService: JobproxyService) {
    const id = this.route.snapshot.params['id'];
    this.jobService.getJobById(id).subscribe((res) => {
      this.job = res;
    });
  }
}
