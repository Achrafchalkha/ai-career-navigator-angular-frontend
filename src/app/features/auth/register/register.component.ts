import { Component, OnInit, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule, NavigationEnd } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { ToastrService } from 'ngx-toastr'
import { Location } from '@angular/common'

@Component({
  selector: "app-register",
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
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p class="text-gray-600">Join AI Career Navigator and start your journey</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  formControlName="firstName"
                  class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                  placeholder="First name"
                />
                <div *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="mt-2 text-sm text-red-600">
                  <span *ngIf="registerForm.get('firstName')?.errors?.['required']">First name is required</span>
                  <span *ngIf="registerForm.get('firstName')?.errors?.['minlength']">First name must be at least 2 characters</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  formControlName="lastName"
                  class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                  placeholder="Last name"
                />
                <div *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="mt-2 text-sm text-red-600">
                  <span *ngIf="registerForm.get('lastName')?.errors?.['required']">Last name is required</span>
                  <span *ngIf="registerForm.get('lastName')?.errors?.['minlength']">Last name must be at least 2 characters</span>
                </div>
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                placeholder="Enter your email address"
              />
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="mt-2 text-sm text-red-600">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                formControlName="password"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                placeholder="Create a strong password"
              />
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="mt-2 text-sm text-red-600">
                <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 8 characters long</span>
              </div>
              <!-- Password requirements -->
              <div class="mt-2 text-xs text-gray-500">
                Password must be at least 8 characters long
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                formControlName="agreeToTerms"
                class="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label class="text-sm text-gray-600">
                I agree to the 
                <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a> 
                and 
                <a href="#" class="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
              </label>
            </div>
            <div *ngIf="registerForm.get('agreeToTerms')?.invalid && registerForm.get('agreeToTerms')?.touched" class="text-sm text-red-600">
              You must agree to the terms and conditions
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
              <span *ngIf="!isLoading">Create Account</span>
            </button>

            <!-- Divider -->
            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
              </div>
            </div>

            <!-- Login Link -->
            <div class="text-center">
              <a
                routerLink="/ai-career-navigator/login"
                class="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                Sign In to Your Account
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
export class RegisterComponent implements OnInit {
  registerForm: FormGroup
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.registerForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      agreeToTerms: [false, [Validators.requiredTrue]],
    })
  }

  ngOnInit(): void {
    console.log('📝 Register Component Initialized');
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
      console.log('⚠️ User already authenticated, but staying on register page for debugging');
      console.log('💡 If you want to go to dashboard, please register again or clear browser storage');
      // Comment out the automatic redirect for debugging
      // this.router.navigate(['/ai-career-navigator/dashboard']);
      // return;
    }

    console.log('🔓 Showing register form');
  }

  // Handle browser back button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    console.log('🔙 Back button pressed from register page');
    // Navigate to landing page when back button is pressed
    this.router.navigate(['/ai-career-navigator']);
  }

  // Method to go back to landing page
  goToLanding() {
    this.router.navigate(['/ai-career-navigator']);
  }

  onSubmit(): void {
    console.log('🚀 Registration form submitted');
    console.log('📝 Form valid:', this.registerForm.valid);
    console.log('📋 Form values:', this.registerForm.value);
    console.log('🌐 API URL being used:', this.authService.getApiUrl());

    if (this.registerForm.valid) {
      this.isLoading = true
      console.log('⏳ Starting registration request...');

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.toastr.success('Account created successfully!');
          this.router.navigate(["/ai-career-navigator/dashboard"])
        },
        error: (error) => {
          console.error("❌ Registration error:", error);
          console.error("❌ Error details:", {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });

          let errorMessage = "Registration failed";
          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 0) {
            errorMessage = "Cannot connect to server. Please check your internet connection.";
          } else if (error.status === 400) {
            errorMessage = "Invalid registration data. Please check your inputs.";
          } else if (error.status === 409) {
            errorMessage = "An account with this email already exists.";
          }

          this.toastr.error(errorMessage);
          this.isLoading = false
        }
      })
    } else {
      console.log('❌ Form is invalid');
      console.log('📋 Form errors:', this.getFormErrors());
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched()
    }
  }

  // Helper method to get form errors for debugging
  getFormErrors() {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
