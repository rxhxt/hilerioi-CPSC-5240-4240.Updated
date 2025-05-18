import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface JobPost {
  _id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  contactEmail: string;
  date_posted: Date;
  isActive: boolean;
}

export interface AppliedJob {
  _id?: string;
  jobPostId: string;
  userId: string;
  dateApplied: Date;
  status: string;
  resume?: string;
  coverLetter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobproxyService {

  hostUrl:string = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) { }

  // JobPost endpoints
  getAllJobPosts(): Observable<JobPost[]> {
    return this.httpClient.get<JobPost[]>(this.hostUrl + 'api/v1/jobposts');
  }

  getJobPostById(jobPostId: string): Observable<JobPost> {
    return this.httpClient.get<JobPost>(this.hostUrl + 'api/v1/jobposts/' + jobPostId);
  }

  createJobPost(jobPostData: JobPost): Observable<JobPost> {
    return this.httpClient.post<JobPost>(this.hostUrl + 'api/v1/jobposts', jobPostData);
  }

  // AppliedJob endpoints
  getAllAppliedJobs(): Observable<AppliedJob[]> {
    return this.httpClient.get<AppliedJob[]>(this.hostUrl + 'api/v1/appliedjobs');
  }

  getAppliedJobById(appliedJobId: string): Observable<AppliedJob> {
    return this.httpClient.get<AppliedJob>(this.hostUrl + 'api/v1/appliedjobs/' + appliedJobId);
  }

  createAppliedJob(appliedJobData: AppliedJob): Observable<AppliedJob> {
    return this.httpClient.post<AppliedJob>(this.hostUrl + 'api/v1/appliedjobs', appliedJobData);
  }
}
