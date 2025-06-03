import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  ssoID: string;
  displayName: string;
  email: string;
  photo: string;
  createdAt: Date;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusSubject = new BehaviorSubject<AuthStatus>({ authenticated: false });
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  checkAuthStatus(): Observable<AuthStatus> {
    return this.http.get<AuthStatus>('/api/v1/auth/status', { withCredentials: true })
      .pipe(
        tap(status => {
          this.authStatusSubject.next(status);
        }),
        catchError(error => {
          console.error('Auth status check failed:', error);
          this.authStatusSubject.next({ authenticated: false });
          return of({ authenticated: false });
        })
      );
  }

  login(): void {
    // This will work for both local and production
    window.location.href = '/login';
  }

  logout(): Observable<any> {
    return this.http.post('/api/v1/auth/logout', {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authStatusSubject.next({ authenticated: false });
        }),
        catchError(error => {
          console.error('Logout failed:', error);
          // Still update the local state even if the request fails
          this.authStatusSubject.next({ authenticated: false });
          return of({ success: false });
        })
      );
  }

  get currentAuthStatus(): AuthStatus {
    return this.authStatusSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.authStatusSubject.value.authenticated;
  }

  get currentUser(): User | undefined {
    return this.authStatusSubject.value.user;
  }
}