import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { JobproxyService } from './service/jobproxy.service';
import { AuthService } from './services/auth.service';  // Add this import
import { WelcomepageComponent } from './pages/welcomepage/welcomepage.component';
import { JoblistingsComponent } from './pages/joblistings/joblistings.component';
import { JobdetailComponent } from './pages/jobdetail/jobdetail.component';
import { CommonModule } from '@angular/common';
import { AppliedJobsComponent } from './pages/applied-jobs/applied-jobs.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomepageComponent,
    JoblistingsComponent,
    JobdetailComponent,
    AppliedJobsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    RouterModule, 
    FormsModule
  ],
  providers: [JobproxyService, AuthService],  
  bootstrap: [AppComponent]
})
export class AppModule { }
