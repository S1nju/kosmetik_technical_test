import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private backendUrl = environment.apiUrl || 'http://localhost:3000/api';
  
  private tokenKey = 'kosmetikon_token';
  public isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor() {}

  login(credentials: {email: string, password: string}) {
    return this.http.post<AuthResponse>(`${this.backendUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.isAuthenticated$.next(true);
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  register(credentials: {email: string, password: string}) {
    return this.http.post<AuthResponse>(`${this.backendUrl}/auth/register`, credentials);
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
