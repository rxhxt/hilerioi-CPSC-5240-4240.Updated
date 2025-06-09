import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { tap, catchError, retry, retryWhen, delayWhen, take } from 'rxjs/operators';

export interface AuthStatus {
  authenticated: boolean;
  user?: {
    id?: string;
    ssoID?: string;
    displayName?: string;
    photo?: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<AuthStatus>({ authenticated: false });
  public authStatus$ = this.authStatusSubject.asObservable();
  private baseUrl: string | undefined;

  constructor(private http: HttpClient) {
    // Use environment-specific base URL
    this.baseUrl = "https://job-fetchr-hee6aedmcmhrgvbu.westus-01.azurewebsites.net"
    console.log('Auth service initialized with base URL:', this.baseUrl);
    this.checkAuthStatus().subscribe();
  }

  checkAuthStatus(): Observable<AuthStatus> {
    const url = `${this.baseUrl}/api/v1/auth/status`;
    
    return this.http.get<AuthStatus>(url, { 
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(error => console.log('Auth check failed, retrying...', error)),
          delayWhen(() => timer(1000)),
          take(3)
        )
      ),
      tap(status => {
        console.log('Auth status received:', status);
        this.authStatusSubject.next(status);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Auth status check failed after retries:', error);
        
        // Handle different error types
        if (error.status === 0) {
          console.error('Network error - unable to connect to server');
        } else if (error.status === 401) {
          console.log('User not authenticated');
        } else if (error.status >= 500) {
          console.error('Server error during auth check');
        }
        
        this.authStatusSubject.next({ authenticated: false });
        return of({ authenticated: false });
      })
    );
  }

  login(): void {
    // Use full URL for login to handle cross-origin scenarios
    const loginUrl = `${this.baseUrl}/login`;
    console.log('Redirecting to login:', loginUrl);
    window.location.href = loginUrl;
  }

  logout(): Observable<any> {
    const url = `${this.baseUrl}/api/v1/auth/logout`;
    
    return this.http.post(url, {}, { 
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(() => {
        console.log('Logout successful');
        this.authStatusSubject.next({ authenticated: false });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Logout failed:', error);
        // Even if logout fails on server, clear local auth state
        this.authStatusSubject.next({ authenticated: false });
        return of({ success: false, error: error.message });
      })
    );
  }

  getCurrentAuthStatus(): AuthStatus {
    return this.authStatusSubject.value;
  }

  // Method to refresh auth status manually
  refreshAuthStatus(): Observable<AuthStatus> {
    return this.checkAuthStatus();
  }

  // Check if user is authenticated (synchronous)
  isAuthenticated(): boolean {
    return this.authStatusSubject.value.authenticated;
  }

  // Get current user info
  getCurrentUser(): any {
    return this.authStatusSubject.value.user;
  }
}