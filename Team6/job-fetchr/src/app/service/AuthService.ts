import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  
  private hostUrl: string = '/';

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  checkAuthStatus(): Observable<AuthStatus> {
    return this.http.get<AuthStatus>(this.hostUrl + 'api/v1/auth/status', { withCredentials: true })
      .pipe(
        tap(status => {
          this.authStatusSubject.next(status);
        })
      );
  }

  login(): void {
    window.location.href = '/login';
  }

  logout(): Observable<any> {
    return this.http.post(this.hostUrl + 'api/v1/auth/logout', {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.authStatusSubject.next({ authenticated: false });
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