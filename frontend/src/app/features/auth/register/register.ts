import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overlow-hidden p-4">
      <div class="absolute top-0 left-0 -ml-32 -mt-32 w-96 h-96 rounded-full bg-teal-600/10 blur-[100px]"></div>
      <div class="absolute bottom-0 right-0 -mr-32 -mb-32 w-96 h-96 rounded-full bg-primary-600/10 blur-[100px]"></div>
      
      <div class="glass-panel w-full max-w-md rounded-2xl p-10 relative z-10 animate-fade-in-up">
        
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center p-3 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-xl mb-4 border border-teal-500/20">
             <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-800">Join KosmetikOn</h1>
          <p class="text-slate-500 mt-2">Create an account to manage resources.</p>
        </div>

        <div *ngIf="errorMsg" class="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
           <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {{ errorMsg }}
        </div>
        
        <div *ngIf="successMsg" class="bg-teal-50 border border-teal-100 text-teal-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
           <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           {{ successMsg }}
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div class="group">
            <label class="form-label">Email Address</label>
            <div class="relative">
              <input type="email" formControlName="email" class="input-field" placeholder="employee@kosmetikon.com" />
            </div>
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="text-red-500 text-xs mt-1">
              <span *ngIf="registerForm.get('email')?.hasError('required')">Email is required.</span>
              <span *ngIf="registerForm.get('email')?.hasError('email')">Please provide a valid email format.</span>
            </div>
          </div>

          <div class="group">
            <label class="form-label">Password</label>
            <div class="relative">
              <input type="password" formControlName="password" class="input-field" placeholder="Min 6 characters" />
            </div>
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="text-red-500 text-xs mt-1">
              <span *ngIf="registerForm.get('password')?.hasError('required')">Password is required.</span>
              <span *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters long.</span>
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading" class="btn-primary w-full mt-2">
            <span *ngIf="!isLoading">Register Account</span>
            <span *ngIf="isLoading">Processing...</span>
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-slate-500">
          Already have an account? 
          <a routerLink="/login" class="text-teal-600 hover:text-teal-700 transition-colors font-medium">Log in</a>
        </div>
        
      </div>
    </div>
  `
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  errorMsg = '';
  successMsg = '';

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Account created successfully! Redirecting...';
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.error?.message || 'Registration failed. Email might exist.';
        this.cdr.markForCheck();
      }
    });
  }
}
