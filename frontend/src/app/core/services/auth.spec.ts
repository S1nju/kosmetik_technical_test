import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth';
import { API_ENDPOINTS } from '../api/api-endpoints';

import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    
    // Clear localStorage before each test
    localStorage.clear();
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.hasToken()).toBe(false);
  });

  it('should handle registration HTTP post', () => {
    const creds = { email: 'test@kosmetikon.com', password: 'password' };
    const mockRes = { id: 1, email: 'test@kosmetikon.com' };

    service.register(creds).subscribe(res => {
      expect(res).toEqual(mockRes);
    });

    const req = httpMock.expectOne(API_ENDPOINTS.auth.register);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(creds);
    req.flush(mockRes);
  });

  it('should handle login, store token, and navigate', () => {
    const creds = { email: 'test@kosmetikon.com', password: 'password' };
    const mockRes = { token: 'mock-jwt-token', user: { id: 1, email: 'test@kosmetikon.com' } };

    service.login(creds).subscribe(res => {
      expect(res.token).toEqual('mock-jwt-token');
      expect(localStorage.getItem('kosmetikon_token')).toEqual('mock-jwt-token');
      expect(service.isAuthenticated$.value).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    const req = httpMock.expectOne(API_ENDPOINTS.auth.login);
    expect(req.request.method).toBe('POST');
    req.flush(mockRes);
  });

  it('should clear token and navigate to login on logout', () => {
    localStorage.setItem('kosmetikon_token', 'sample-token');
    service.isAuthenticated$.next(true);

    service.logout();

    expect(localStorage.getItem('kosmetikon_token')).toBeNull();
    expect(service.isAuthenticated$.value).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
