import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { API_ENDPOINTS } from '../api/api-endpoints';

export interface AuthResponse {
  token?: string;
  user?: { id: number, email: string };
  id?: number;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private tokenKey = 'kosmetikon_token';
  public isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor() { }

  login(credentials: { email: string, password: string }) {
    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.isAuthenticated$.next(true);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  register(credentials: { email: string, password: string }) {
    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.register, credentials);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated$.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
