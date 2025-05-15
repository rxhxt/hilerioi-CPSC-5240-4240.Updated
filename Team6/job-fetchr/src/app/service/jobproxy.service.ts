import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobproxyService {
  hostUrl: string = 'https://127.0.0.1:8080/api/v1/';

  constructor(private httpClient: HttpClient) {}

  getAllJobs() {
    return this.httpClient.get<any[]>(this.hostUrl + 'jobposts');
  }

  getJobById(id: string) {
    return this.httpClient.get(this.hostUrl + 'jobposts/' + id);
  }
}
