import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center mb-8">Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                formControlName="firstName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                formControlName="lastName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              formControlName="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ isLoading ? 'Loading...' : 'Register' }}
          </button>
          <p class="text-center text-sm text-gray-600">
            Already have an account?
            <a routerLink="/ai-career-navigator/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.toastr.success('Registration successful');
          this.router.navigate(['/ai-career-navigator/dashboard']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          const errorMessage = error.error?.error || error.message || 'Registration failed';
          this.toastr.error(errorMessage);
          this.isLoading = false;
        }
      });
    }
  }
}
