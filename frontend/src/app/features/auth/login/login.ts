import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overlow-hidden p-4">
      <!-- Background Decorations -->
      <div class="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary-600/10 blur-[100px]"></div>
      <div class="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px]"></div>
      
      <!-- Glass Panel -->
      <div class="glass-panel w-full max-w-md rounded-2xl p-10 relative z-10 animate-fade-in-up">
        
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-xl mb-4 border border-primary-500/20">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-800">KosmetikOn</h1>
          <p class="text-slate-500 mt-2">Welcome back! Sign in to inventory.</p>
        </div>

        <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
           <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {{ errorMsg }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          
          <div class="group">
            <label class="form-label">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input type="email" formControlName="email" class="input-field pl-10" placeholder="admin@admin.com" />
            </div>
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-red-500 text-xs mt-1">Valid email is required.</div>
          </div>

          <div class="group">
            <label class="form-label">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input type="password" formControlName="password" class="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn-primary w-full mt-2">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading" class="flex items-center gap-2">
               <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Authenticating...
            </span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-slate-500">
          Don't have an account? 
          <a routerLink="/register" class="text-primary-600 hover:text-primary-700 transition-colors font-medium">Create one now</a>
        </div>
        
      </div>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoading = false;
  errorMsg = '';

  onSubmit() {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    this.errorMsg = '';
    
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.error?.message || 'Invalid credentials or server error.';
      }
    });
  }
}
