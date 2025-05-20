import { Component } from '@angular/core';
import { JobproxyService, JobPost } from '../../service/jobproxy.service';

@Component({
  selector: 'app-welcomepage',
  standalone: false,
  templateUrl: './welcomepage.component.html', 
  styleUrl: './welcomepage.component.css'
})
export class WelcomepageComponent {
  // Adjust this path based on your project structure
  jobPosts: JobPost[] = [];
  loadingJobs: boolean = false;
  errorMessage: string = '';
  
  constructor(private jobproxyService: JobproxyService) { }
  
  ngOnInit(): void {}
}
