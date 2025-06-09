import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthStatus } from './service/AuthService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'job-fetchr';
  logoPath = '/images/logo-white.png';
  authStatus: AuthStatus = { authenticated: false };
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authStatus$.subscribe(
      status => {
        this.authStatus = status;
        console.log('Auth status updated:', status);
        
        if (status.authenticated && status.user) {
          console.log('Display Name:', status.user.displayName);
          console.log('Email:', status.user.email);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout().subscribe(
      result => {
        console.log('Logout successful:', result);
      },
      error => {
        console.error('Logout error:', error);
      }
    );
  }
}
