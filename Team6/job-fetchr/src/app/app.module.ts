import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JobproxyService } from './service/jobproxy.service';
import { WelcomepageComponent } from './pages/welcomepage/welcomepage.component';
import { JoblistingsComponent } from './pages/joblistings/joblistings.component';
import { JobdetailComponent } from './pages/jobdetail/jobdetail.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomepageComponent,
    JoblistingsComponent,
    JobdetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [JobproxyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
