import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface AuthStatus {
  authenticated: boolean;
  user?: {
    id?: string;
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

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  checkAuthStatus(): Observable<AuthStatus> {
    return this.http.get<AuthStatus>('/api/v1/auth/status', { 
      withCredentials: true,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).pipe(
      tap(status => {
        console.log('Auth status received:', status);
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
    // Since we're on the same origin, use relative URL
    window.location.href = '/login';
  }

  logout(): Observable<any> {
    return this.http.post('/api/v1/auth/logout', {}, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(() => {
        this.authStatusSubject.next({ authenticated: false });
      }),
      catchError(error => {
        console.error('Logout failed:', error);
        this.authStatusSubject.next({ authenticated: false });
        return of({ success: false });
      })
    );
  }

  getCurrentAuthStatus(): AuthStatus {
    return this.authStatusSubject.value;
  }
}