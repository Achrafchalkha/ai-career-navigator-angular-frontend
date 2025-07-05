import { Component, OnInit, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule, NavigationEnd } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { ToastrService } from 'ngx-toastr'
import { Location } from '@angular/common'

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-8 relative overflow-hidden">
        
        <!-- Background gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-2xl"></div>
        
        <!-- Content -->
        <div class="relative z-10">
          <!-- Header with brand -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p class="text-gray-600">Sign in to your AI Career Navigator account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                placeholder="Enter your email address"
              />
              <div *ngIf="loginForm.get('email')?.invalid && (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)" class="mt-2 text-sm text-red-600">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                placeholder="Enter your password"
              />
              <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)" class="mt-2 text-sm text-red-600">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters long</span>
              </div>
            </div>

            <!-- Forgot Password Link -->
            <div class="text-right">
              <a routerLink="/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">
                Forgot your password?
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
              <span *ngIf="!isLoading">Sign In</span>
            </button>

            <!-- Divider -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500 font-medium">New to AI Career Navigator?</span>
              </div>
            </div>

            <!-- Register Link -->
            <div class="text-center">
              <p class="text-gray-600 mb-3">Don't have an account?</p>
              <a
                routerLink="/ai-career-navigator/register"
                class="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Create Your Account
              </a>
            </div>
          </form>
        </div>

        <!-- Decorative elements -->
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  `,
  styles: [
    `
    /* Custom backdrop blur */
    .backdrop-blur-xl {
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    /* Gradient text fallback */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }

    /* Smooth transitions */
    * {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  `,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit(): void {
    console.log('🔐 Login Component Initialized');
    console.log('📍 Current URL:', this.router.url);
    console.log('🌐 Browser URL:', window.location.href);
    console.log('📚 History Length:', window.history.length);

    // Debug authentication state
    console.log('🔍 Checking authentication state...');
    console.log('🔑 Token in localStorage:', localStorage.getItem('auth_token'));
    console.log('👤 User in localStorage:', localStorage.getItem('current_user'));
    console.log('✅ isAuthenticated():', this.authService.isAuthenticated());

    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      console.log('⚠️ User already authenticated, but staying on login page for debugging');
      console.log('💡 If you want to go to dashboard, please login again or clear browser storage');
      // Comment out the automatic redirect for debugging
      // this.router.navigate(['/ai-career-navigator/dashboard']);
      // return;
    }

    console.log('🔓 Showing login form');
  }

  // Handle browser back button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log('🔙 PopState detected in Login Component');
    console.log('📍 Current URL:', this.router.url);
    console.log('🌐 Browser URL:', window.location.href);
    console.log('📚 History Length:', window.history.length);
    console.log('📦 Event State:', event.state);

    // Navigate to landing page when back button is pressed
    console.log('🏠 Navigating to landing page...');
    this.router.navigate(['/ai-career-navigator']);
  }

  // Method to go back to landing page
  goToLanding() {
    this.router.navigate(['/ai-career-navigator']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true

      this.authService
        .login(this.loginForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(["/ai-career-navigator/dashboard"])
          },
          error: (error) => {
            console.error("Login error:", error)
            const errorMessage = error.error?.error || error.message || "Login failed"
            this.toastr.error(errorMessage)
            this.isLoading = false
          }
        })
    }
  }
}
