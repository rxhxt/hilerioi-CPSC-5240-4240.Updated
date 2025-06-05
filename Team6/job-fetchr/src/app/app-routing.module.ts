import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomepageComponent } from './pages/welcomepage/welcomepage.component';
import { JoblistingsComponent } from './pages/joblistings/joblistings.component';
import { JobdetailComponent } from './pages/jobdetail/jobdetail.component';
import { AppliedJobsComponent } from './pages/applied-jobs/applied-jobs.component';


const routes: Routes = [
  { path: '', component: WelcomepageComponent },
  { path: 'jobs', component: JoblistingsComponent },
  { path: 'job/:id', component: JobdetailComponent },
  { path: 'applied-jobs', component: AppliedJobsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }