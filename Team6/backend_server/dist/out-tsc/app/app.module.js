import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { JobproxyService } from './service/jobproxy.service';
import { WelcomepageComponent } from './pages/welcomepage/welcomepage.component';
import { JoblistingsComponent } from './pages/joblistings/joblistings.component';
import { JobdetailComponent } from './pages/jobdetail/jobdetail.component';
import { CommonModule } from '@angular/common';
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            WelcomepageComponent,
            JoblistingsComponent,
            JobdetailComponent
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            HttpClientModule,
            CommonModule,
            RouterModule,
            FormsModule
        ],
        providers: [JobproxyService],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
