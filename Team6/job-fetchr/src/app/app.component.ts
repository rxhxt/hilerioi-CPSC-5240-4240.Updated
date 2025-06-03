import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, AuthStatus } from './service/AuthService';
// Note: The import path for AuthService may vary based on your project structure.
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'job-fetchr';
  logoPath: string = 'assets/images/logo-white.png';
  
  authStatus: AuthStatus = { authenticated: false };
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(
      status => {
        this.authStatus = status;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
