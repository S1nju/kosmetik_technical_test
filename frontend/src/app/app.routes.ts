import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { RawMaterialForm } from './features/dashboard/raw-material-form/raw-material-form';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'raw-materials/new', component: RawMaterialForm, canActivate: [authGuard] },
  { path: 'raw-materials/edit/:id', component: RawMaterialForm, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
