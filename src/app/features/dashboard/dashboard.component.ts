import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators, FormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { ToastrService } from "ngx-toastr"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <!-- Animated Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 -z-10">
      <div class="absolute inset-0 opacity-40" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-2xl animate-float-delayed"></div>
      <div class="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
    </div>

    <!-- Enhanced Navigation -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center space-x-8">
            <!-- Logo with Animation -->
            <div class="flex items-center group">
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Career Navigator
              </h1>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-2">
              <button
                (click)="navigateToTab('dashboard')"
                [class]="getTabClasses('dashboard')"
                class="relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span>Dashboard</span>
                </div>
                <div *ngIf="activeTab === 'dashboard'" class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl -z-10"></div>
              </button>

              <button
                (click)="navigateToTab('history')"
                [class]="getTabClasses('history')"
                class="relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>History</span>
                  <span *ngIf="guidanceHistory.length > 0" class="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {{ guidanceHistory.length }}
                  </span>
                </div>
                <div *ngIf="activeTab === 'history'" class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl -z-10"></div>
              </button>

              <button
                (click)="navigateToTab('stats')"
                [class]="getTabClasses('stats')"
                class="relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Statistics</span>
                </div>
                <div *ngIf="activeTab === 'stats'" class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl -z-10"></div>
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Mobile Menu Button -->
            <button
              (click)="showMobileMenu = !showMobileMenu"
              class="md:hidden p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-white/50 transition-all duration-300 transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <!-- User Info Card -->
            <div class="hidden sm:block bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 shadow-lg">
              <div class="text-sm font-semibold text-gray-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
              <div class="text-xs text-gray-600">{{ currentUser?.email }}</div>
            </div>

            <!-- Logout Button -->
            <button
              (click)="logout()"
              class="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div class="flex items-center space-x-2 relative z-10">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="hidden sm:inline">Logout</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="showMobileMenu" class="md:hidden py-6 border-t border-white/20 animate-slide-down">
          <div class="flex flex-col space-y-3">
            <button
              (click)="navigateToTab('dashboard'); showMobileMenu = false"
              [class]="getMobileTabClasses('dashboard')"
              class="flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard
            </button>
            <button
              (click)="navigateToTab('history'); showMobileMenu = false"
              [class]="getMobileTabClasses('history')"
              class="flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              History ({{ guidanceHistory.length }})
            </button>
            <button
              (click)="navigateToTab('stats'); showMobileMenu = false"
              [class]="getMobileTabClasses('stats')"
              class="flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300"
            >
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Statistics
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Dashboard Tab -->
        <div *ngIf="activeTab === 'dashboard'" class="animate-fade-in">
          <!-- Hero Section -->
          <div class="text-center mb-16 relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 rounded-3xl blur-3xl"></div>
            <div class="relative z-10">
              <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
                Your AI Career
                <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  Guidance Hub
                </span>
              </h1>
              <div class="w-full flex justify-center">
                <p class="text-xl md:text-2xl text-gray-600 max-w-4xl leading-relaxed text-center animate-slide-up-delayed">
                  Get personalized career recommendations, learning roadmaps, and market insights powered by AI
                </p>
              </div>
            </div>
          </div>

          <!-- Main Dashboard Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Career Form - Takes 2 columns (only show when not showing results) -->
            <div class="lg:col-span-2" *ngIf="!showResults">
              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden animate-slide-up">
                <!-- Background Pattern -->
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl"></div>
                
                <!-- Form Header -->
                <div class="relative z-10 mb-8">
                  <div class="flex items-center mb-6">
                    <div class="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform hover:scale-110 transition-all duration-300">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Career Profile Builder</h2>
                      <p class="text-gray-600 mt-1">Tell us about yourself to get personalized guidance</p>
                    </div>
                  </div>
                </div>

                <form [formGroup]="careerForm" (ngSubmit)="onSubmit()" class="relative z-10 space-y-8">
                  <!-- Personal Information Section -->
                  <div class="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 transform hover:scale-[1.02] transition-all duration-300">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      Personal Information
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Age</label>
                        <input
                          type="number"
                          formControlName="age"
                          min="16"
                          max="100"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none group-hover:shadow-lg"
                          placeholder="Enter your age"
                        />
                      </div>
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Education Level</label>
                        <select
                          formControlName="education"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none group-hover:shadow-lg"
                        >
                          <option value="">Select education level</option>
                          <option value="High School">High School</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Bootcamp/Certification">Bootcamp/Certification</option>
                          <option value="Self-taught">Self-taught</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Experience Section -->
                  <div class="bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 transform hover:scale-[1.02] transition-all duration-300">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                        </svg>
                      </div>
                      Experience & Skills
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Experience Level</label>
                        <select
                          formControlName="experienceLevel"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white hover:border-purple-300 outline-none group-hover:shadow-lg"
                        >
                          <option value="">Select experience level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Current Role (Optional)</label>
                        <input
                          type="text"
                          formControlName="currentRole"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:bg-white hover:border-purple-300 outline-none group-hover:shadow-lg"
                          placeholder="e.g., Software Developer, Student"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Interests & Goals Section -->
                  <div class="bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 transform hover:scale-[1.02] transition-all duration-300">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                      </div>
                      Interests & Career Goals
                    </h3>
                    <div class="space-y-6">
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Areas of Interest</label>
                        <input
                          type="text"
                          formControlName="interests"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white hover:border-green-300 outline-none group-hover:shadow-lg"
                          placeholder="e.g., Web Development, Data Science, AI/ML, Mobile Apps"
                        />
                        <p class="text-xs text-gray-500 mt-2">Separate multiple interests with commas</p>
                      </div>
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Desired Field/Role</label>
                        <input
                          type="text"
                          formControlName="desiredField"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white hover:border-green-300 outline-none group-hover:shadow-lg"
                          placeholder="e.g., Frontend Developer, Data Analyst, Product Manager"
                        />
                      </div>
                      <div class="group">
                        <label class="block text-sm font-semibold text-gray-700 mb-3">Soft Skills</label>
                        <input
                          type="text"
                          formControlName="softSkills"
                          class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 focus:bg-white hover:border-green-300 outline-none group-hover:shadow-lg"
                          placeholder="e.g., Problem-solving, Communication, Leadership, Teamwork"
                        />
                        <p class="text-xs text-gray-500 mt-2">Separate multiple skills with commas</p>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Notes Section -->
                  <div class="bg-gradient-to-r from-orange-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/50 transform hover:scale-[1.02] transition-all duration-300">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </div>
                      Additional Information
                    </h3>
                    <div class="group">
                      <textarea
                        formControlName="additionalNotes"
                        rows="4"
                        class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-white hover:border-orange-300 outline-none resize-none group-hover:shadow-lg"
                        placeholder="Any additional information about your career goals, preferences, or specific requirements..."
                      ></textarea>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="flex justify-center pt-8">
                    <button
                      type="submit"
                      [disabled]="careerForm.invalid || isLoading"
                      class="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    >
                      <div class="relative z-10 flex items-center space-x-3">
                        <svg *ngIf="isLoading" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg *ngIf="!isLoading" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span>{{ isLoading ? 'Generating Your Guidance...' : 'Get AI Career Guidance' }}</span>
                      </div>
                      <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Sidebar - Takes 1 column (only show when not showing results) -->
            <div class="lg:col-span-1 space-y-6" *ngIf="!showResults">
              <!-- Quick Stats Card -->
              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed">
                <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  Quick Stats
                </h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100/50 hover:shadow-lg transition-all duration-300">
                    <span class="text-sm font-semibold text-gray-700">Sessions</span>
                    <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ guidanceHistory.length }}</span>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-100/50 hover:shadow-lg transition-all duration-300">
                    <span class="text-sm font-semibold text-gray-700">Last Session</span>
                    <span class="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {{ lastSessionDate || 'Never' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Recent Sessions Card -->
              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed-2">
                <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  Recent Sessions
                </h3>
                <div class="space-y-3">
                  <div *ngFor="let session of guidanceHistory.slice(0, 3)"
                       class="p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                       (click)="viewSession(session)">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm font-semibold text-gray-900">{{ session.userProfile?.desiredField || 'Career Guidance' }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(session.createdAt) }}</p>
                      </div>
                      <span class="text-xs px-3 py-1 rounded-full font-medium"
                            [ngClass]="{
                              'bg-green-100 text-green-800': session.status === 'success',
                              'bg-yellow-100 text-yellow-800': session.status === 'processing',
                              'bg-red-100 text-red-800': session.status === 'error'
                            }">
                        {{ session.status }}
                      </span>
                    </div>
                  </div>
                  <div *ngIf="guidanceHistory.length === 0" class="text-center py-8">
                    <div class="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p class="text-gray-500 text-sm">No sessions yet</p>
                    <p class="text-gray-400 text-xs mt-1">Create your first guidance session above</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Section (full width when showing results) -->
          <div *ngIf="showResults && guidanceResult" class="animate-fade-in" [class.mt-16]="!showResults">
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
              <!-- Background Pattern -->
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl"></div>
              
              <!-- Results Header -->
              <div class="relative z-10 flex items-center justify-between mb-12">
                <div class="flex items-center">
                  <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg transform hover:scale-110 transition-all duration-300">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Your AI Career Guidance</h2>
                    <p class="text-xl text-gray-600 mt-2">Personalized recommendations crafted just for you</p>
                  </div>
                </div>

                <!-- New Career Search Button -->
                <button
                  (click)="startNewSearch()"
                  class="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-3xl overflow-hidden"
                >
                  <div class="relative z-10 flex items-center space-x-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>New Career Search</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>

              <!-- Results Grid -->
              <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <!-- Career Suggestions -->
                <div class="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50 transform hover:scale-105 transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                      </svg>
                    </div>
                    Career Suggestions
                  </h3>
                  <div class="space-y-4">
                    <div *ngFor="let suggestion of (guidanceResult.careerSuggestions || guidanceResult.career_suggestions || []); let i = index"
                         class="p-4 bg-white/80 rounded-xl shadow-sm border border-blue-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <p class="text-gray-800 font-medium">{{ suggestion }}</p>
                    </div>
                    <div *ngIf="!(guidanceResult.careerSuggestions || guidanceResult.career_suggestions)?.length"
                         class="p-8 bg-gray-50/80 rounded-xl text-center">
                      <p class="text-gray-500">No career suggestions available</p>
                    </div>
                  </div>
                </div>

                <!-- Learning Roadmap -->
                <div class="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100/50 transform hover:scale-105 transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                    </div>
                    Learning Roadmap
                  </h3>
                  <div class="space-y-4">
                    <div *ngFor="let step of (guidanceResult.roadmap || []); let i = index"
                         class="flex items-start p-4 bg-white/80 rounded-xl shadow-sm border border-purple-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                        <span class="text-white text-sm font-bold">{{ i + 1 }}</span>
                      </div>
                      <p class="text-gray-800 font-medium">{{ step }}</p>
                    </div>
                    <div *ngIf="!guidanceResult.roadmap?.length"
                         class="p-8 bg-gray-50/80 rounded-xl text-center">
                      <p class="text-gray-500">No learning roadmap available</p>
                    </div>
                  </div>
                </div>

                <!-- Top Courses -->
                <div class="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-8 border border-green-100/50 transform hover:scale-105 transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                    Recommended Courses
                  </h3>
                  <div class="space-y-4">
                    <div *ngFor="let course of (guidanceResult.topCourses || guidanceResult.top_courses || []); let i = index"
                         class="p-4 bg-white/80 rounded-xl shadow-sm border border-green-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <h4 class="font-semibold text-gray-900">{{ course.title || course.name || 'Course Title' }}</h4>
                      <p class="text-sm text-gray-600 mb-2">{{ course.provider || 'Provider' }}</p>
                      <p class="text-sm text-gray-700">{{ course.description || 'Course description not available' }}</p>
                      <div class="flex justify-between items-center mt-3">
                        <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{{ course.level || 'Beginner' }}</span>
                        <span *ngIf="course.estimatedHours || course.duration" class="text-xs text-gray-500">
                          {{ course.estimatedHours || course.duration }}{{ course.estimatedHours ? 'h' : '' }}
                        </span>
                      </div>
                      <a *ngIf="course.url || course.link" [href]="course.url || course.link" target="_blank"
                         class="inline-flex items-center mt-2 text-sm text-green-600 hover:text-green-700">
                        View Course
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    </div>
                    <div *ngIf="!(guidanceResult.topCourses || guidanceResult.top_courses)?.length"
                         class="p-8 bg-gray-50/80 rounded-xl text-center">
                      <p class="text-gray-500">No course recommendations available</p>
                    </div>
                  </div>
                </div>

                <!-- Skills to Track -->
                <div class="bg-gradient-to-br from-orange-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100/50 transform hover:scale-105 transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    Skills to Develop
                  </h3>
                  <div class="flex flex-wrap gap-3">
                    <span *ngFor="let skill of (guidanceResult.skillsToTrack || guidanceResult.skills_to_track || []); let i = index"
                          class="px-4 py-2 bg-white/80 text-orange-700 rounded-xl text-sm font-medium border border-orange-200/50 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                          [style.animation-delay]="i * 50 + 'ms'">
                      {{ skill }}
                    </span>
                    <div *ngIf="!(guidanceResult.skillsToTrack || guidanceResult.skills_to_track)?.length"
                         class="p-8 bg-gray-50/80 rounded-xl text-center w-full">
                      <p class="text-gray-500">No skills to track available</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Full Width Sections -->
              <div class="relative z-10 mt-12 space-y-8">
                <!-- Project Ideas -->
                <div class="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100/50 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                    </div>
                    Project Ideas
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div *ngFor="let project of (guidanceResult.projectIdeas || guidanceResult.project_ideas || []); let i = index"
                         class="p-4 bg-white/80 rounded-xl shadow-sm border border-indigo-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <p class="text-gray-800 font-medium">{{ project }}</p>
                    </div>
                    <div *ngIf="!(guidanceResult.projectIdeas || guidanceResult.project_ideas)?.length"
                         class="p-8 bg-gray-50/80 rounded-xl text-center col-span-full">
                      <p class="text-gray-500">No project ideas available</p>
                    </div>
                  </div>
                </div>

                <!-- Job Market Insights -->
                <div *ngIf="guidanceResult.jobMarket || guidanceResult.job_market" class="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-100/50 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    Job Market Insights
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ (guidanceResult.jobMarket || guidanceResult.job_market)?.averageSalaryUsd ||
                            (guidanceResult.jobMarket || guidanceResult.job_market)?.average_salary_usd || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Average Salary</div>
                    </div>
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ (guidanceResult.jobMarket || guidanceResult.job_market)?.jobDemandLevel ||
                            (guidanceResult.jobMarket || guidanceResult.job_market)?.job_demand_level || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Job Demand</div>
                    </div>
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ (guidanceResult.jobMarket || guidanceResult.job_market)?.growthProjection ||
                            (guidanceResult.jobMarket || guidanceResult.job_market)?.growth_projection || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Growth Rate</div>
                    </div>
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ ((guidanceResult.jobMarket || guidanceResult.job_market)?.topCountriesHiring ||
                            (guidanceResult.jobMarket || guidanceResult.job_market)?.top_countries_hiring)?.length || 0 }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Top Markets</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div *ngIf="((guidanceResult.jobMarket || guidanceResult.job_market)?.topCountriesHiring ||
                                (guidanceResult.jobMarket || guidanceResult.job_market)?.top_countries_hiring)?.length"
                         class="bg-white/80 rounded-xl p-6 border border-teal-200/50 hover:shadow-lg transition-all duration-300">
                      <h4 class="font-bold text-gray-900 mb-4">Top Hiring Countries</h4>
                      <div class="flex flex-wrap gap-2">
                        <span *ngFor="let country of ((guidanceResult.jobMarket || guidanceResult.job_market)?.topCountriesHiring ||
                                                      (guidanceResult.jobMarket || guidanceResult.job_market)?.top_countries_hiring || []); let i = index"
                              class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium animate-slide-up"
                              [style.animation-delay]="i * 50 + 'ms'">
                          {{ country }}
                        </span>
                      </div>
                    </div>
                    <div *ngIf="((guidanceResult.jobMarket || guidanceResult.job_market)?.topCompanies ||
                                (guidanceResult.jobMarket || guidanceResult.job_market)?.top_companies)?.length"
                         class="bg-white/80 rounded-xl p-6 border border-teal-200/50 hover:shadow-lg transition-all duration-300">
                      <h4 class="font-bold text-gray-900 mb-4">Top Companies</h4>
                      <div class="flex flex-wrap gap-2">
                        <span *ngFor="let company of ((guidanceResult.jobMarket || guidanceResult.job_market)?.topCompanies ||
                                                      (guidanceResult.jobMarket || guidanceResult.job_market)?.top_companies || []); let i = index"
                              class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium animate-slide-up"
                              [style.animation-delay]="i * 50 + 'ms'">
                          {{ company }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div *ngIf="activeTab === 'history'" class="animate-fade-in">
          <div class="text-center mb-12">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
              Career Guidance
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                History
              </span>
            </h1>
            <div class="w-full flex justify-center">
              <p class="text-xl text-gray-600 max-w-3xl text-center animate-slide-up-delayed">
                View and manage all your previous career guidance sessions
              </p>
            </div>
          </div>

          <!-- History Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <div class="flex items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{{ fullGuidanceHistory.length }}</div>
                  <div class="text-sm text-gray-600 font-medium">Total Sessions</div>
                </div>
              </div>
            </div>

            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed">
              <div class="flex items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{{ getSuccessfulSessions() }}</div>
                  <div class="text-sm text-gray-600 font-medium">Successful</div>
                </div>
              </div>
            </div>

            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed-2">
              <div class="flex items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 12v-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v2M8 7a2 2 0 012-2h2a2 2 0 012 2v2H8V7z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{{ getLatestSessionDate() }}</div>
                  <div class="text-sm text-gray-600 font-medium">Latest Session</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search and Filter -->
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 mb-8 animate-slide-up">
            <div class="flex flex-col md:flex-row gap-6">
              <div class="flex-1">
                <input
                  type="text"
                  [(ngModel)]="historySearchTerm"
                  (input)="filterHistory()"
                  placeholder="Search your career guidance history..."
                  class="w-full px-6 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                />
              </div>
              <div class="flex gap-4">
                <select
                  [(ngModel)]="historyStatusFilter"
                  (change)="filterHistory()"
                  class="px-6 py-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white hover:border-blue-300 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="success">Successful</option>
                  <option value="error">Failed</option>
                  <option value="processing">Processing</option>
                </select>
                <button
                  (click)="loadFullHistory()"
                  class="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- History List -->
          <div class="space-y-6">
            <div *ngFor="let session of filteredHistory; let i = index"
                 class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] animate-slide-up"
                 [style.animation-delay]="i * 100 + 'ms'">
              <div class="p-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-3">
                      Career Guidance Session #{{ fullGuidanceHistory.length - i }}
                    </h3>
                    <div class="flex flex-wrap gap-3 mb-3">
                      <span class="text-sm text-gray-600 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 12v-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v2M8 7a2 2 0 012-2h2a2 2 0 012 2v2H8V7z"></path>
                        </svg>
                        {{ formatDate(session.createdAt) }}
                      </span>
                      <span class="text-sm px-3 py-1 rounded-full font-medium"
                            [ngClass]="{
                              'bg-green-100 text-green-800': session.status === 'success',
                              'bg-yellow-100 text-yellow-800': session.status === 'processing',
                              'bg-red-100 text-red-800': session.status === 'error'
                            }">
                        {{ session.status | titlecase }}
                      </span>
                    </div>
                    <div *ngIf="session.userProfile" class="text-sm text-gray-600">
                      <span class="font-medium">Field:</span> {{ session.userProfile.desiredField || 'Not specified' }} |
                      <span class="font-medium">Experience:</span> {{ session.userProfile.experienceLevel || 'Not specified' }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-3 mt-6 md:mt-0">
                    <button
                      (click)="viewHistorySession(session)"
                      class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-medium"
                    >
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                    <button
                      (click)="deleteHistorySession(session.id)"
                      class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-medium"
                    >
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Quick Preview -->
                <div *ngIf="session.careerSuggestions?.length" class="mt-6 p-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl border border-gray-200/50">
                  <h4 class="text-sm font-bold text-gray-700 mb-3">Career Suggestions Preview:</h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let suggestion of session.careerSuggestions.slice(0, 3); let i = index"
                          class="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium animate-slide-up"
                          [style.animation-delay]="i * 50 + 'ms'">
                      {{ suggestion }}
                    </span>
                    <span *ngIf="session.careerSuggestions.length > 3"
                          class="text-xs px-3 py-1 bg-gray-200 text-gray-600 rounded-full font-medium">
                      +{{ session.careerSuggestions.length - 3 }} more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredHistory.length === 0" class="text-center py-16 animate-fade-in">
              <div class="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">No guidance sessions found</h3>
              <p class="text-gray-600 mb-8 text-lg">
                {{ historySearchTerm || historyStatusFilter ? 'Try adjusting your search or filter criteria.' : 'Start by creating your first career guidance session.' }}
              </p>
              <button
                *ngIf="!historySearchTerm && !historyStatusFilter"
                (click)="navigateToTab('dashboard')"
                class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                Create First Session
              </button>
            </div>
          </div>
        </div>

        <!-- Statistics Tab -->
        <div *ngIf="activeTab === 'stats'" class="animate-fade-in">
          <div class="text-center mb-12">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
              Career Guidance
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Statistics
              </span>
            </h1>
            <div class="flex justify-center">
              <p class="text-xl text-gray-600 max-w-3xl text-center animate-slide-up-delayed">
                Insights and analytics about your career guidance journey
              </p>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loadingStats" class="text-center py-16 animate-fade-in">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <p class="text-gray-600 text-lg">Loading statistics...</p>
          </div>

          <!-- Stats Content -->
          <div *ngIf="!loadingStats && userStats" class="space-y-8">
            <!-- Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up">
                <div class="flex items-center">
                  <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{{ userStats.total_guidance_sessions }}</div>
                    <div class="text-sm text-gray-600 font-medium">Total Sessions</div>
                  </div>
                </div>
              </div>

              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed">
                <div class="flex items-center">
                  <div class="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{{ userStats.has_guidance ? 'Active' : 'Inactive' }}</div>
                    <div class="text-sm text-gray-600 font-medium">Status</div>
                  </div>
                </div>
              </div>

              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed-2">
                <div class="flex items-center">
                  <div class="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{{ formatDate(userStats.latest_session_date) || 'Never' }}</div>
                    <div class="text-sm text-gray-600 font-medium">Latest Session</div>
                  </div>
                </div>
              </div>

              <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 animate-slide-up-delayed-3">
                <div class="flex items-center">
                  <div class="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">{{ getSuccessRate() }}%</div>
                    <div class="text-sm text-gray-600 font-medium">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Stats -->
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 animate-slide-up">
              <h3 class="text-2xl font-bold text-gray-900 mb-8">Usage Insights</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 class="text-xl font-bold text-gray-800 mb-6">Session Activity</h4>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100/50">
                      <span class="text-gray-600 font-medium">This Month</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ getThisMonthSessions() }}</span>
                    </div>
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-100/50">
                      <span class="text-gray-600 font-medium">This Week</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{{ getThisWeekSessions() }}</span>
                    </div>
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-100/50">
                      <span class="text-gray-600 font-medium">Average per Month</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ getAverageSessionsPerMonth() }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-xl font-bold text-gray-800 mb-6">Popular Fields</h4>
                  <div class="space-y-3">
                    <div *ngFor="let field of getPopularFields(); let i = index" 
                         class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl border border-gray-200/50 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <span class="text-gray-600 font-medium">{{ field.name }}</span>
                      <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{{ field.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Stats Available -->
          <div *ngIf="!loadingStats && !userStats" class="text-center py-16 animate-fade-in">
            <div class="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">No statistics available</h3>
            <p class="text-gray-600 mb-8 text-lg">Create some career guidance sessions to see your statistics.</p>
            <button
              (click)="navigateToTab('dashboard')"
              class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-20 relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-4 mb-8">
              <h3 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AI Career Navigator
              </h3>
            </div>
            <p class="text-gray-300 leading-relaxed mb-8 max-w-md text-lg">
              Empowering professionals worldwide with AI-driven career guidance, personalized learning paths, and
              industry insights to unlock their full potential.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="group w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
                <svg class="w-6 h-6 group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" class="group w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
                <svg class="w-6 h-6 group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" class="group w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110">
                <svg class="w-6 h-6 group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-xl font-bold text-white mb-6">Platform</h4>
            <ul class="space-y-4">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Career Assessment</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Learning Paths</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Industry Insights</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Success Stories</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-xl font-bold text-white mb-6">Support</h4>
            <ul class="space-y-4">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Help Center</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Contact Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Privacy Policy</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="pt-12 border-t border-gray-800">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <p class="text-gray-400 text-base">© 2025 AI Career Navigator. All rights reserved.</p>
              <div class="hidden md:flex items-center space-x-2 text-gray-500 text-sm">
                <span>•</span>
                <span>Trusted by 50,000+ professionals worldwide</span>
              </div>
            </div>
            <div class="flex items-center space-x-3 text-gray-400">
              <span>Made with</span>
              <span class="heart-animation text-red-400 text-xl">❤️</span>
              <span>by</span>
              <a href="#" class="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 hover:scale-105 transform inline-block">
                Achraf Chalkha
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
    /* Heart animation for footer */
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    .heart-animation { animation: heartbeat 1.5s ease-in-out infinite; }
    /* Custom Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(-3deg); }
    }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up-delayed {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up-delayed-2 {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up-delayed-3 {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-down {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
    .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
    .animate-fade-in { animation: fade-in 0.8s ease-out; }
    .animate-slide-up { animation: slide-up 0.6s ease-out; }
    .animate-slide-up-delayed { animation: slide-up-delayed 0.8s ease-out; }
    .animate-slide-up-delayed-2 { animation: slide-up-delayed-2 1s ease-out; }
    .animate-slide-up-delayed-3 { animation: slide-up-delayed-3 1.2s ease-out; }
    .animate-slide-down { animation: slide-down 0.3s ease-out; }
    .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
    .animate-shimmer { animation: shimmer 2s infinite; }

    /* Backdrop Blur Support */
    .backdrop-blur-xl {
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    /* Gradient Text */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(45deg, #2563eb, #7c3aed);
    }

    /* Enhanced Shadow */
    .shadow-3xl {
      box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
    }

    /* Smooth Transitions */
    * {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  currentUser$ = this.authService.currentUser$
  currentUser: any
  careerForm: FormGroup
  isLoading = false
  guidanceResult: any = null
  guidanceHistory: any[] = []
  lastSessionDate = ""
  showResults = false

  // Navigation and UI state
  activeTab: "dashboard" | "history" | "stats" = "dashboard"
  showMobileMenu = false

  // History functionality
  fullGuidanceHistory: any[] = []
  filteredHistory: any[] = []
  historySearchTerm = ""
  historyStatusFilter = ""

  // Statistics
  userStats: any = null
  loadingStats = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient,
  ) {
    this.careerForm = this.fb.group({
      age: ["", [Validators.required, Validators.min(16), Validators.max(100)]],
      education: ["", Validators.required],
      experienceLevel: ["", Validators.required],
      currentRole: [""],
      interests: ["", Validators.required],
      desiredField: ["", Validators.required],
      softSkills: ["", Validators.required],
      additionalNotes: [""],
    })

    this.currentUser$.subscribe((user) => {
      if (!user) {
        // Don't redirect here - let the AuthService handle logout navigation
        console.log('Dashboard: User is null, but not redirecting (AuthService will handle it)')
      } else {
        this.currentUser = user
      }
    })
  }

  ngOnInit(): void {
    // Detect active tab from route
    this.route.data.subscribe((data) => {
      if (data["activeTab"]) {
        this.activeTab = data["activeTab"]
        if (this.activeTab === "history") {
          this.loadFullHistory()
        } else if (this.activeTab === "stats") {
          this.loadUserStats()
        }
      }
    })

    // Also check the current URL path
    const currentPath = this.router.url
    if (currentPath.includes("/history")) {
      this.activeTab = "history"
      this.loadFullHistory()
    } else if (currentPath.includes("/statistics")) {
      this.activeTab = "stats"
      this.loadUserStats()
    } else {
      this.activeTab = "dashboard"
    }

    this.loadGuidanceHistory()
  }

  startNewSearch(): void {
    this.showResults = false
    this.guidanceResult = null
    this.careerForm.reset()
  }

  async onSubmit(): Promise<void> {
    if (this.careerForm.valid) {
      this.isLoading = true
      this.guidanceResult = null

      try {
        const formData = this.careerForm.value

        // Prepare the request payload
        const payload = {
          age: Number.parseInt(formData.age),
          education: formData.education,
          experienceLevel: formData.experienceLevel,
          currentRole: formData.currentRole || undefined,
          interests: formData.interests,
          desiredField: formData.desiredField,
          softSkills: formData.softSkills,
          additionalNotes: formData.additionalNotes || undefined,
        }

        const token = this.authService.getToken()
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        })

        const response = await this.http
          .post<any>(`${environment.apiUrl}/career/guidance`, payload, { headers })
          .toPromise()

        console.log("Career guidance response:", response)

        if (response && response.status === "success") {
          this.guidanceResult = response.guidance
          this.showResults = true // Show results view
          console.log("Guidance result:", this.guidanceResult)
          this.toastr.success("Career guidance generated successfully!")
          this.loadGuidanceHistory() // Refresh history
        } else {
          throw new Error(response?.message || "Failed to generate career guidance")
        }
      } catch (error: any) {
        console.error("Career guidance error:", error)
        this.toastr.error(error.error?.error || error.message || "Failed to generate career guidance")
      } finally {
        this.isLoading = false
      }
    } else {
      this.toastr.error("Please fill in all required fields")
      this.markFormGroupTouched()
    }
  }

  async loadGuidanceHistory(): Promise<void> {
    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      const response = await this.http.get<any>(`${environment.apiUrl}/career/history`, { headers }).toPromise()

      if (response && response.status === "success") {
        this.guidanceHistory = response.history || []
        if (this.guidanceHistory.length > 0) {
          this.lastSessionDate = this.formatDate(this.guidanceHistory[0].createdAt)
        }
      }
    } catch (error) {
      console.error("Failed to load guidance history:", error)
    }
  }

  viewSession(session: any): void {
    // Navigate to the detailed view page
    this.router.navigate(["/ai-career-navigator/career-guidance", session.id || session._id])
  }

  formatDate(dateString: string): string {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  private markFormGroupTouched(): void {
    Object.keys(this.careerForm.controls).forEach((key) => {
      const control = this.careerForm.get(key)
      control?.markAsTouched()
    })
  }

  // History methods
  async loadFullHistory(): Promise<void> {
    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      const response = await this.http.get<any>(`${environment.apiUrl}/career/history`, { headers }).toPromise()

      if (response && response.status === "success") {
        this.fullGuidanceHistory = response.history || []
        this.filteredHistory = [...this.fullGuidanceHistory]
      }
    } catch (error) {
      console.error("Failed to load full guidance history:", error)
      this.toastr.error("Failed to load guidance history")
    }
  }

  filterHistory(): void {
    this.filteredHistory = this.fullGuidanceHistory.filter((session) => {
      const matchesSearch =
        !this.historySearchTerm ||
        session.userProfile?.desiredField?.toLowerCase().includes(this.historySearchTerm.toLowerCase()) ||
        session.userProfile?.experienceLevel?.toLowerCase().includes(this.historySearchTerm.toLowerCase()) ||
        session.careerSuggestions?.some((suggestion: string) =>
          suggestion.toLowerCase().includes(this.historySearchTerm.toLowerCase()),
        )

      const matchesStatus = !this.historyStatusFilter || session.status === this.historyStatusFilter

      return matchesSearch && matchesStatus
    })
  }

  viewHistorySession(session: any): void {
    // Navigate to the detailed view page
    this.router.navigate(["/ai-career-navigator/career-guidance", session.id || session._id])
  }

  async deleteHistorySession(sessionId: string): Promise<void> {
    if (!confirm("Are you sure you want to delete this career guidance session?")) {
      return
    }

    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      await this.http.delete(`${environment.apiUrl}/career/history/${sessionId}`, { headers }).toPromise()

      this.toastr.success("Career guidance session deleted successfully")
      this.loadFullHistory() // Refresh the list
      this.loadGuidanceHistory() // Refresh the sidebar
    } catch (error) {
      console.error("Failed to delete session:", error)
      this.toastr.error("Failed to delete career guidance session")
    }
  }

  // Statistics methods
  async loadUserStats(): Promise<void> {
    this.loadingStats = true
    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      // Load both stats and full history for Usage Insights
      const [statsResponse, historyResponse] = await Promise.all([
        this.http.get<any>(`${environment.apiUrl}/career/stats`, { headers }).toPromise(),
        this.http.get<any>(`${environment.apiUrl}/career/history`, { headers }).toPromise()
      ])

      if (statsResponse && statsResponse.status === "success") {
        this.userStats = statsResponse.stats
      }

      if (historyResponse && historyResponse.status === "success") {
        this.fullGuidanceHistory = historyResponse.history || []
      }
    } catch (error) {
      console.error("Failed to load user stats:", error)
      this.toastr.error("Failed to load statistics")
    } finally {
      this.loadingStats = false
    }
  }

  getSuccessfulSessions(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0
    return this.fullGuidanceHistory.filter((session) => session.status === "success" || session.status === "completed").length
  }

  getLatestSessionDate(): string {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return "Never"
    return this.formatDate(this.fullGuidanceHistory[0].createdAt || this.fullGuidanceHistory[0].created_at)
  }

  getSuccessRate(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0
    const successful = this.getSuccessfulSessions()
    return Math.round((successful / this.fullGuidanceHistory.length) * 100)
  }

  getThisMonthSessions(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    return this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear
    }).length
  }

  getThisWeekSessions(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    return this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate >= oneWeekAgo
    }).length
  }

  getAverageSessionsPerMonth(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const oldestSession = new Date(this.fullGuidanceHistory[this.fullGuidanceHistory.length - 1].createdAt || this.fullGuidanceHistory[this.fullGuidanceHistory.length - 1].created_at)
    const now = new Date()
    const monthsDiff =
      (now.getFullYear() - oldestSession.getFullYear()) * 12 + (now.getMonth() - oldestSession.getMonth()) + 1

    return Math.round((this.fullGuidanceHistory.length / monthsDiff) * 10) / 10
  }

  getPopularFields(): { name: string; count: number }[] {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) {
      return [{ name: 'No data available', count: 0 }]
    }

    const fieldCounts: { [key: string]: number } = {}

    this.fullGuidanceHistory.forEach((session) => {
      const field = session.userProfile?.desiredField || session.user_profile?.desired_field
      if (field) {
        fieldCounts[field] = (fieldCounts[field] || 0) + 1
      }
    })

    const result = Object.entries(fieldCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return result.length > 0 ? result : [{ name: 'No fields tracked yet', count: 0 }]
  }

  // Helper methods for styling
  getTabClasses(tab: string): string {
    const baseClasses = "text-gray-600 hover:text-blue-600 hover:bg-white/50"
    const activeClasses = "text-blue-600 bg-white/70 shadow-lg"
    return this.activeTab === tab ? activeClasses : baseClasses
  }

  getMobileTabClasses(tab: string): string {
    const baseClasses = "text-gray-600 hover:text-blue-600 hover:bg-white/50"
    const activeClasses = "text-blue-600 bg-white/70"
    return this.activeTab === tab ? activeClasses : baseClasses
  }

  // Navigation methods
  navigateToTab(tab: "dashboard" | "history" | "stats"): void {
    this.activeTab = tab
    switch (tab) {
      case "dashboard":
        this.router.navigate(["/ai-career-navigator/dashboard"])
        break
      case "history":
        this.router.navigate(["/ai-career-navigator/history"])
        break
      case "stats":
        this.router.navigate(["/ai-career-navigator/statistics"])
        break
    }
  }

  logout(): void {
    this.authService.logout()
    this.toastr.success("Logged out successfully")
  }
}
