import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user already has a token, they shouldn't access login/register pages
  if (authService.hasToken()) {
    return router.parseUrl('/dashboard');
  }

  // Otherwise, let them through
  return true;
};
