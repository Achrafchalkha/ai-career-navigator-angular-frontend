import { Component, OnInit, AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators, FormsModule } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { ToastrService } from "ngx-toastr"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../../environments/environment"
import * as L from 'leaflet'

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
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <!-- Left: Logo -->
          <div class="flex items-center flex-1">
            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI Career Navigator
            </h1>
          </div>

          <!-- Middle: Navigation Links (Centered) -->
          <div class="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <button
              (click)="navigateToTab('dashboard')"
              [class]="activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            >
              Dashboard
            </button>
            <button
              (click)="navigateToTab('history')"
              [class]="activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative"
            >
              History
              <span *ngIf="guidanceHistory.length > 0" class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{ guidanceHistory.length }}
              </span>
            </button>
            <button
              (click)="navigateToTab('stats')"
              [class]="activeTab === 'stats' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            >
              Statistics
            </button>
          </div>

          <!-- Right: User Menu -->
          <div class="flex items-center space-x-3 flex-1 justify-end">
            <!-- Mobile Menu Button -->
            <button
              (click)="showMobileMenu = !showMobileMenu"
              class="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <!-- User Dropdown -->
            <div class="relative">
              <button
                (click)="showUserDropdown = !showUserDropdown"
                class="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <!-- User Icon -->
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <!-- User Name -->
                <span class="hidden sm:block text-sm font-medium">
                  {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                </span>
                <!-- Dropdown Arrow -->
                <svg class="w-4 h-4 transition-transform duration-200" [class.rotate-180]="showUserDropdown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div *ngIf="showUserDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                <button
                  (click)="logout(); showUserDropdown = false"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
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

    <!-- Full Page Loading State for Career Guidance -->
    <div *ngIf="isLoading" class="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex items-center justify-center">
      <div class="text-center animate-fade-in">
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <svg class="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-ping"></div>
        </div>
        <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Generating Career Guidance
        </h3>
        <p class="text-gray-600 text-lg">Creating your personalized career roadmap...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div *ngIf="!isLoading" class="min-h-screen pt-20">
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

          <!-- Main Dashboard Grid (only show when not showing results or history details) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" *ngIf="!showResults">
            <!-- Career Form - Takes 2 columns -->
            <div class="lg:col-span-2">
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
                      [disabled]="careerForm.invalid"
                      class="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    >
                      <div class="relative z-10 flex items-center space-x-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span>Get AI Career Guidance</span>
                      </div>
                      <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Sidebar - Takes 1 column -->
            <div class="lg:col-span-1 space-y-6">
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










          <!-- Enhanced Results Section -->
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

              <!-- Enhanced Results Grid -->
              <div class="relative z-10 space-y-8">
                <!-- Career Suggestions - Enhanced Structure -->
                <div class="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 class="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-10 flex items-center">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg transform hover:scale-110 transition-all duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                      </svg>
                    </div>
                     Career Suggestions
                  </h3>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div *ngFor="let suggestion of (guidanceResult?.careerSuggestions || guidanceResult?.career_suggestions || []); let i = index"
                         class="group relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-200/50 hover:shadow-lg transition-all duration-300 animate-slide-up overflow-hidden"
                         [style.animation-delay]="i * 100 + 'ms'">
                      
                      <!-- Career Icon -->
                      <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                      </div>
                      
                      <!-- Career Title -->
                      <h4 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {{ suggestion }}
                      </h4>
                      
                      <!-- Match Indicator -->
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Match Score</span>
                        <div class="flex items-center space-x-2">
                          <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                                 [style.width]="(85 + (i * 3)) + '%'"></div>
                          </div>
                          <span class="text-sm font-semibold text-blue-600">{{ 85 + (i * 3) }}%</span>
                        </div>
                      </div>
                      
                      <!-- Hover Effect -->
                      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                    
                    <div *ngIf="!(guidanceResult?.careerSuggestions || guidanceResult?.career_suggestions)?.length"
                         class="col-span-full p-12 bg-gray-50/80 rounded-xl text-center">
                      <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <p class="text-gray-500 text-lg">No career suggestions available</p>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Learning Roadmap -->
                <div class="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100/50 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                    </div>
                    Learning Roadmap
                    <span class="ml-4 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      {{ (guidanceResult?.roadmap || []).length }} Steps
                    </span>
                  </h3>

                  <div class="relative">
                    <!-- Roadmap Timeline -->
                    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300"></div>
                    
                    <div class="space-y-6">
                      <div *ngFor="let step of (guidanceResult?.roadmap || []); let i = index; let isLast = last"
                           class="relative flex items-start group animate-slide-up"
                           [style.animation-delay]="i * 150 + 'ms'">
                        
                        <!-- Step Number Circle -->
                        <div class="relative z-10 flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                          <span class="text-white text-lg font-bold">{{ i + 1 }}</span>
                          <!-- Pulse Animation -->
                          <div class="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></div>
                        </div>
                        
                        <!-- Step Content -->
                        <div class="ml-6 flex-1 bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-purple-200/50 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                          <div class="flex items-start justify-between mb-3">
                            <h4 class="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                              Step {{ i + 1 }}
                            </h4>
                            <!-- Estimated Time -->
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>{{ getEstimatedTime(i) }}</span>
                            </div>
                          </div>
                          
                          <p class="text-gray-700 leading-relaxed mb-4">{{ step }}</p>
                          
                          <!-- Progress Bar -->
                          <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-600">Difficulty</span>
                            <div class="flex items-center space-x-2">
                              <div class="flex space-x-1">
                                <div *ngFor="let star of [1,2,3,4,5]; let j = index" 
                                     class="w-3 h-3 rounded-full transition-all duration-300"
                                     [ngClass]="j < getDifficultyLevel(i) ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-200'">
                                </div>
                              </div>
                              <span class="text-sm font-medium text-purple-600">{{ getDifficultyText(i) }}</span>
                            </div>
                          </div>
                          
                          <!-- Step Status -->
                          <div class="mt-4 flex items-center justify-between">
                            <span class="text-xs px-3 py-1 rounded-full font-medium"
                                  [ngClass]="getStepStatusClass(i)">
                              {{ getStepStatus(i) }}
                            </span>
                            <button class="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-300">
                              View Resources →
                            </button>
                          </div>
                        </div>
                        
                        <!-- Connection Line to Next Step -->
                        <div *ngIf="!isLast" class="absolute left-8 top-16 w-0.5 h-6 bg-gradient-to-b from-purple-300 to-pink-300"></div>
                      </div>
                      
                      <div *ngIf="!guidanceResult?.roadmap?.length"
                           class="p-12 bg-gray-50/80 rounded-xl text-center">
                        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                          </svg>
                        </div>
                        <p class="text-gray-500 text-lg">No learning roadmap available</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Grid for Other Sections -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Top Courses -->
                  <div class="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-8 border border-green-100/50 transform hover:scale-105 transition-all duration-300">
                    <h3 class="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-8 flex items-center">
                      <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg transform hover:scale-110 transition-all duration-300">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                       Recommended Courses
                    </h3>
                    <div class="space-y-4">
                      <div *ngFor="let course of (guidanceResult?.topCourses || guidanceResult?.top_courses || []); let i = index"
                           class="group bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-200/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                           [style.animation-delay]="i * 100 + 'ms'">
                        <div class="flex items-start space-x-4">
                          <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                          </div>
                          <div class="flex-1">
                            <h4 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors duration-300">
                              {{ course.title || course.name || 'Course Title' }}
                            </h4>
                            <p class="text-sm text-gray-600 mb-4 font-medium">{{ course.provider || 'Provider' }}</p>
                            <div class="flex items-center justify-between">
                              <div class="flex items-center space-x-3">
                                <span class="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">{{ course.level || 'Beginner' }}</span>
                                <span *ngIf="course.estimatedHours || course.duration" class="text-xs text-gray-500 flex items-center">
                                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                  {{ course.estimatedHours || course.duration }}{{ course.estimatedHours ? 'h' : '' }}
                                </span>
                              </div>
                              <a *ngIf="course.url || course.link" [href]="course.url || course.link" target="_blank"
                                 class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105">
                                View Course
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div *ngIf="!(guidanceResult?.topCourses || guidanceResult?.top_courses)?.length"
                           class="p-8 bg-gray-50/80 rounded-xl text-center">
                        <p class="text-gray-500">No course recommendations available</p>
                      </div>
                    </div>
                  </div>

                  <!-- Skills to Track -->
                  <div class="bg-gradient-to-br from-orange-50/80 to-yellow-50/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100/50 transform hover:scale-105 transition-all duration-300">
                    <h3 class="text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent mb-8 flex items-center">
                      <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg transform hover:scale-110 transition-all duration-300">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                       Skills to Develop
                    </h3>
                    <div class="grid grid-cols-1 gap-4">
                      <div *ngFor="let skill of (guidanceResult?.skillsToTrack || guidanceResult?.skills_to_track || []); let i = index"
                           class="group bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-orange-200/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                           [style.animation-delay]="i * 50 + 'ms'">
                        <div class="flex items-center space-x-3">
                          <div class="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                          </div>
                          <span class="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{{ skill }}</span>
                        </div>
                      </div>
                      <div *ngIf="!(guidanceResult?.skillsToTrack || guidanceResult?.skills_to_track)?.length"
                           class="col-span-full p-8 bg-gray-50/80 rounded-xl text-center">
                        <p class="text-gray-500">No skills to track available</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Project Ideas -->
                <div class="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-8 border border-indigo-100/50 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 class="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8 flex items-center">
                    <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg transform hover:scale-110 transition-all duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                    </div>
                     Project Ideas
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div *ngFor="let project of (guidanceResult?.projectIdeas || guidanceResult?.project_ideas || []); let i = index"
                         class="group bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-indigo-200/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <p class="text-gray-800 font-medium leading-relaxed group-hover:text-indigo-600 transition-colors duration-300">{{ project }}</p>
                        </div>
                      </div>
                    </div>
                    <div *ngIf="!(guidanceResult?.projectIdeas || guidanceResult?.project_ideas)?.length"
                         class="col-span-full p-8 bg-gray-50/80 rounded-xl text-center">
                      <p class="text-gray-500">No project ideas available</p>
                    </div>
                  </div>
                </div>

                <!-- Job Market Insights -->
                <div *ngIf="guidanceResult?.jobMarket || guidanceResult?.job_market" class="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-100/50 transform hover:scale-[1.02] transition-all duration-300">
                  <h3 class="text-4xl font-extrabold bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent mb-10 flex items-center">
                    <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg transform hover:scale-110 transition-all duration-300">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                     Job Market Insights
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ (guidanceResult?.jobMarket || guidanceResult?.job_market)?.averageSalaryUsd ||
                            (guidanceResult?.jobMarket || guidanceResult?.job_market)?.average_salary_usd || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Average Salary</div>
                    </div>
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ (guidanceResult?.jobMarket || guidanceResult?.job_market)?.jobDemandLevel ||
                            (guidanceResult?.jobMarket || guidanceResult?.job_market)?.job_demand_level || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Job Demand</div>
                    </div>
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ (guidanceResult?.jobMarket || guidanceResult?.job_market)?.growthProjection ||
                            (guidanceResult?.jobMarket || guidanceResult?.job_market)?.growth_projection || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Growth Rate</div>
                    </div>
                    <div class="text-center p-6 bg-white/80 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                      <div class="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-2">
                        {{ ((guidanceResult?.jobMarket || guidanceResult?.job_market)?.topCountriesHiring ||
                            (guidanceResult?.jobMarket || guidanceResult?.job_market)?.top_countries_hiring)?.length || 0 }}
                      </div>
                      <div class="text-sm text-gray-600 font-medium">Top Markets</div>
                    </div>
                  </div>
                  <!-- Full Width Interactive World Map -->
                  <div class="bg-white/80 rounded-xl p-6 border border-teal-200/50 hover:shadow-lg transition-all duration-300 mb-8">
                    <h4 class="font-bold text-gray-900 mb-6 text-xl">Top Hiring Countries - Interactive World Map</h4>

                    <!-- Real Interactive Leaflet World Map -->
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 relative overflow-hidden">
                      <!-- Debug button for testing -->
                      <button
                        (click)="refreshMap()"
                        class="absolute top-2 right-2 z-10 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                        Initialize Map
                      </button>
                      <div id="world-map" class="w-full h-96 rounded-lg shadow-lg"></div>

                      <!-- Map Legend -->
                      <div class="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-sm shadow-lg border border-gray-200">
                        <div class="flex flex-col space-y-2">
                          <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                            <span class="font-medium">15k+ jobs</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                            <span class="font-medium">10k+ jobs</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                            <span class="font-medium">5k+ jobs</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                            <span class="font-medium">1k+ jobs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                      <!-- Country Statistics -->
                      <div class="grid grid-cols-2 gap-2">
                        <div class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                          <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span class="text-sm font-medium">United States</span>
                          </div>
                          <span class="text-sm text-red-600 font-semibold">15.4k</span>
                        </div>
                        <div class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                          <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span class="text-sm font-medium">United Kingdom</span>
                          </div>
                          <span class="text-sm text-blue-600 font-semibold">12.3k</span>
                        </div>
                        <div class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                          <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span class="text-sm font-medium">India</span>
                          </div>
                          <span class="text-sm text-green-600 font-semibold">11.2k</span>
                        </div>
                        <div class="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                          <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span class="text-sm font-medium">Germany</span>
                          </div>
                          <span class="text-sm text-yellow-600 font-semibold">9.9k</span>
                        </div>
                      </div>

                      <!-- Fallback for when guidance result has countries -->
                      <div *ngIf="((guidanceResult?.jobMarket || guidanceResult?.job_market)?.topCountriesHiring ||
                                  (guidanceResult?.jobMarket || guidanceResult?.job_market)?.top_countries_hiring)?.length"
                           class="mt-4 pt-4 border-t border-gray-200">
                        <h5 class="text-sm font-semibold text-gray-700 mb-2">AI Recommended Countries:</h5>
                        <div class="flex flex-wrap gap-2">
                          <span *ngFor="let country of ((guidanceResult?.jobMarket || guidanceResult?.job_market)?.topCountriesHiring ||
                                                        (guidanceResult?.jobMarket || guidanceResult?.job_market)?.top_countries_hiring || []); let i = index"
                                class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium animate-slide-up"
                                [style.animation-delay]="i * 50 + 'ms'">
                            {{ country }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Top Companies Section - Full Width Below Map -->
                    <div *ngIf="((guidanceResult?.jobMarket || guidanceResult?.job_market)?.topCompanies ||
                                (guidanceResult?.jobMarket || guidanceResult?.job_market)?.top_companies)?.length"
                         class="bg-white/80 rounded-xl p-6 border border-teal-200/50 hover:shadow-lg transition-all duration-300">
                      <h4 class="font-bold text-gray-900 mb-4 text-xl">Top Companies Hiring</h4>
                      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        <div *ngFor="let company of ((guidanceResult?.jobMarket || guidanceResult?.job_market)?.topCompanies ||
                                                      (guidanceResult?.jobMarket || guidanceResult?.job_market)?.top_companies || []); let i = index"
                              class="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-up"
                              [style.animation-delay]="i * 100 + 'ms'">
                          <div class="text-sm font-semibold text-teal-800">{{ company }}</div>
                          <div class="text-xs text-teal-600 mt-1">Actively Hiring</div>
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

          <!-- Loading State for History -->
          <div *ngIf="loadingHistory" class="text-center py-16 animate-fade-in">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <p class="text-gray-600 text-lg">Loading history...</p>
          </div>

          <!-- History Content (only show when not loading) -->
          <div *ngIf="!loadingHistory">
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
                 class="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 animate-slide-up overflow-hidden"
                 [style.animation-delay]="i * 100 + 'ms'">

              <!-- Session Header with Gradient Background -->
              <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border-b border-gray-100">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div class="flex-1">
                    <!-- Session Title with Enhanced Typography -->
                    <div class="flex items-center mb-4">
                      <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          Career Guidance Session #{{ fullGuidanceHistory.length - i }}
                        </h3>
                        <p class="text-sm text-gray-500 font-medium">AI-Powered Career Analysis</p>
                      </div>
                    </div>

                    <!-- Session Metadata with Enhanced Design -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Date & Time -->
                      <div class="flex items-center p-3 bg-white/60 rounded-xl border border-gray-200/50">
                        <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 font-medium">Created</p>
                          <p class="text-sm font-bold text-gray-700">{{ formatDate(session.createdAt) }}</p>
                        </div>
                      </div>

                      <!-- Status -->
                      <div class="flex items-center p-3 bg-white/60 rounded-xl border border-gray-200/50">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                             [class]="session.status === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : session.status === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path *ngIf="session.status === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            <path *ngIf="session.status === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            <path *ngIf="session.status === 'processing'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 font-medium">Status</p>
                          <p class="text-sm font-bold" [class]="session.status === 'success' ? 'text-green-600' : session.status === 'error' ? 'text-red-600' : 'text-yellow-600'">
                            {{ session.status === 'success' ? 'Completed' : session.status === 'error' ? 'Failed' : 'Processing' }}
                          </p>
                        </div>
                      </div>

                      <!-- Field & Experience -->
                      <div class="flex items-center p-3 bg-white/60 rounded-xl border border-gray-200/50">
                        <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500 font-medium">Profile</p>
                          <p class="text-sm font-bold text-gray-700">{{ session.userProfile?.desiredField || 'Not specified' }}</p>
                          <p class="text-xs text-gray-500">{{ session.userProfile?.experienceLevel || 'Not specified' }} Level</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-3 mt-6 lg:mt-0 lg:ml-6">
                    <button
                      (click)="viewHistorySession(session)"
                      class="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg font-medium flex items-center space-x-2 overflow-hidden"
                    >
                      <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <span class="relative z-10">View Details</span>
                    </button>
                    <button
                      (click)="deleteHistorySession(session.id)"
                      class="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg font-medium flex items-center space-x-2 overflow-hidden"
                    >
                      <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <svg class="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span class="relative z-10">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Career Suggestions Preview -->
              <div *ngIf="session.careerSuggestions?.length" class="p-6">
                <div class="flex items-center mb-4">
                  <div class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h4 class="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Career Suggestions Preview
                  </h4>
                </div>
                <div class="flex flex-wrap gap-3">
                  <div *ngFor="let suggestion of session.careerSuggestions.slice(0, 3)"
                       class="group relative px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-xl hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      <span class="text-sm font-semibold text-gray-700">{{ suggestion }}</span>
                    </div>
                  </div>
                  <div *ngIf="session.careerSuggestions.length > 3"
                       class="flex items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl">
                    <span class="text-sm font-medium text-gray-600">
                      +{{ session.careerSuggestions.length - 3 }} more suggestions
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
          </div> <!-- End History Content -->
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

            <!-- Enhanced Usage Insights -->
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 animate-slide-up">
              <h3 class="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-10 flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                 Usage Insights
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                    Session Activity
                  </h4>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-100/50 hover:shadow-lg transition-all duration-300">
                      <span class="text-gray-600 font-medium">This Month</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ getThisMonthSessions() }}</span>
                    </div>
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-100/50 hover:shadow-lg transition-all duration-300">
                      <span class="text-gray-600 font-medium">This Week</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{{ getThisWeekSessions() }}</span>
                    </div>
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <span class="text-gray-600 font-medium">Average per Month</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ getAverageSessionsPerMonth() }}</span>
                    </div>
                    <div class="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50/80 to-red-50/80 rounded-xl border border-orange-100/50 hover:shadow-lg transition-all duration-300">
                      <span class="text-gray-600 font-medium">Today</span>
                      <span class="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{{ getTodaySessions() }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                      </svg>
                    </div>
                    Popular Career Fields
                  </h4>
                  <div class="space-y-3">
                    <div *ngFor="let field of getPopularFields(); let i = index"
                         class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                         [style.animation-delay]="i * 100 + 'ms'">
                      <span class="text-gray-600 font-medium">{{ field.name }}</span>
                      <span class="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full font-bold shadow-md">{{ field.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance Analytics -->
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 animate-slide-up">
              <h3 class="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent mb-10 flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                 Performance Analytics
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold text-gray-800">Success Metrics</h4>
                    <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Successful Sessions</span>
                      <span class="font-bold text-green-600">{{ getSuccessfulSessions() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Success Rate</span>
                      <span class="font-bold text-green-600">{{ getSuccessRate() }}%</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Failed Sessions</span>
                      <span class="font-bold text-red-500">{{ getFailedSessions() }}</span>
                    </div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold text-gray-800">Time Analytics</h4>
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Days Active</span>
                      <span class="font-bold text-blue-600">{{ getDaysActive() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Avg. Sessions/Day</span>
                      <span class="font-bold text-blue-600">{{ getAverageSessionsPerDay() }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Most Active Day</span>
                      <span class="font-bold text-blue-600">{{ getMostActiveDay() }}</span>
                    </div>
                  </div>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-bold text-gray-800">Growth Trends</h4>
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Last 7 Days</span>
                      <span class="font-bold" [class]="getWeeklyTrend() >= 0 ? 'text-green-600' : 'text-red-500'">
                        {{ getWeeklyTrend() >= 0 ? '+' : '' }}{{ getWeeklyTrend() }}%
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Last 30 Days</span>
                      <span class="font-bold" [class]="getMonthlyTrend() >= 0 ? 'text-green-600' : 'text-red-500'">
                        {{ getMonthlyTrend() >= 0 ? '+' : '' }}{{ getMonthlyTrend() }}%
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Streak</span>
                      <span class="font-bold text-purple-600">{{ getCurrentStreak() }} days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Insights Dashboard -->
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 animate-slide-up">
              <h3 class="text-4xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 bg-clip-text text-transparent mb-10 flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                 Detailed Analytics
              </h3>

              <!-- Session Timeline -->
              <div class="mb-12">
                <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  Session Timeline (Last 7 Days)
                </h4>
                <div class="grid grid-cols-7 gap-2">
                  <div *ngFor="let day of getLast7DaysActivity(); let i = index"
                       class="text-center p-4 rounded-xl border transition-all duration-300 hover:shadow-lg"
                       [class]="day.sessions > 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gray-50 border-gray-200'">
                    <div class="text-xs font-medium text-gray-600 mb-2">{{ day.dayName }}</div>
                    <div class="text-lg font-bold" [class]="day.sessions > 0 ? 'text-blue-600' : 'text-gray-400'">{{ day.sessions }}</div>
                    <div class="text-xs text-gray-500">{{ day.date }}</div>
                  </div>
                </div>
              </div>

              <!-- Career Field Distribution -->
              <div class="mb-12">
                <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  Career Field Distribution
                </h4>
                <div class="space-y-4">
                  <div *ngFor="let field of getFieldDistribution(); let i = index"
                       class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div class="flex items-center space-x-4">
                      <div class="w-4 h-4 rounded-full" [style.background-color]="getFieldColor(i)"></div>
                      <span class="font-medium text-gray-700">{{ field.name }}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                      <div class="w-32 bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all duration-500"
                             [style.width.%]="field.percentage"
                             [style.background-color]="getFieldColor(i)"></div>
                      </div>
                      <span class="text-sm font-bold text-gray-600 min-w-[3rem]">{{ field.percentage }}%</span>
                      <span class="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{{ field.count }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Stats Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200/50 text-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <div class="text-2xl font-bold text-rose-600 mb-1">{{ getFavoriteField() }}</div>
                  <div class="text-sm text-gray-600">Favorite Field</div>
                </div>
                <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50 text-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <div class="text-2xl font-bold text-amber-600 mb-1">{{ getBestDay() }}</div>
                  <div class="text-sm text-gray-600">Best Day</div>
                </div>
                <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200/50 text-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <div class="text-2xl font-bold text-violet-600 mb-1">{{ getProductivityScore() }}%</div>
                  <div class="text-sm text-gray-600">Productivity</div>
                </div>
                <div class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200/50 text-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div class="text-2xl font-bold text-teal-600 mb-1">{{ getLongestStreak() }}</div>
                  <div class="text-sm text-gray-600">Longest Streak</div>
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
    <footer class="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-12 mt-20 relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Brand Section -->
          <div>
            <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              AI Career Navigator
            </h3>
            <p class="text-gray-300 leading-relaxed text-base">
              Empowering professionals with AI-driven career guidance and personalized learning paths.
            </p>
          </div>
          <!-- Platform -->
          <div>
            <h4 class="text-lg font-bold text-white mb-4">Platform</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Career Assessment</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Learning Paths</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Industry Insights</a></li>
            </ul>
          </div>
          <!-- Support -->
          <div>
            <h4 class="text-lg font-bold text-white mb-4">Support</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Help Center</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Contact Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <!-- Bottom Section -->
        <div class="pt-8 border-t border-gray-800">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-gray-400 text-sm">© 2025 AI Career Navigator. All rights reserved.</p>
            <div class="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <span class="heart-animation text-red-400">❤️</span>
              <span>by Achraf Chalkha</span>
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

    /* Leaflet Map Styles */
    #world-map {
      border-radius: 0.5rem;
      overflow: hidden;
      height: 400px !important;
      width: 100% !important;
      position: relative;
      z-index: 1;
    }

    /* Custom Marker Styles */
    .custom-marker {
      background: transparent !important;
      border: none !important;
    }

    .custom-marker div {
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .custom-marker:hover div {
      transform: scale(1.1);
    }

    /* Custom Popup Styles */
    .leaflet-popup-content-wrapper {
      border-radius: 0.75rem !important;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
      border: 1px solid rgba(229, 231, 235, 0.5) !important;
    }

    .leaflet-popup-tip {
      background: white !important;
      border: 1px solid rgba(229, 231, 235, 0.5) !important;
    }

    .leaflet-popup-content {
      margin: 0 !important;
      font-family: 'Inter', sans-serif !important;
    }

    /* Map Controls */
    .leaflet-control-zoom {
      border-radius: 0.5rem !important;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
    }

    .leaflet-control-zoom a {
      background: rgba(255, 255, 255, 0.95) !important;
      border: none !important;
      color: #374151 !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
    }

    .leaflet-control-zoom a:hover {
      background: rgba(59, 130, 246, 0.1) !important;
      color: #2563eb !important;
    }
  `,
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit {
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
  showUserDropdown = false

  // History functionality
  fullGuidanceHistory: any[] = []
  filteredHistory: any[] = []
  historySearchTerm = ""
  historyStatusFilter = ""

  // Statistics
  userStats: any = null
  loadingStats = false

  // History loading
  loadingHistory = false

  // Map functionality
  private map: L.Map | null = null
  private mapInitialized = false

  // Top hiring countries data with coordinates
  private topHiringCountries = [
    { name: 'United States', lat: 39.8283, lng: -98.5795, jobs: 15420, color: '#ef4444' },
    { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, jobs: 12300, color: '#3b82f6' },
    { name: 'India', lat: 20.5937, lng: 78.9629, jobs: 11200, color: '#10b981' },
    { name: 'Germany', lat: 51.1657, lng: 10.4515, jobs: 9850, color: '#f59e0b' },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, jobs: 8750, color: '#8b5cf6' },
    { name: 'Japan', lat: 36.2048, lng: 138.2529, jobs: 7300, color: '#ec4899' },
    { name: 'Australia', lat: -25.2744, lng: 133.7751, jobs: 6400, color: '#06b6d4' },
    { name: 'Netherlands', lat: 52.1326, lng: 5.2913, jobs: 5200, color: '#f97316' },
    { name: 'France', lat: 46.6034, lng: 1.8883, jobs: 4800, color: '#84cc16' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, jobs: 3900, color: '#a855f7' }
  ]

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public router: Router,  // Made public for template access
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

  ngAfterViewInit(): void {
    // Initialize map after view is ready when results are shown
    setTimeout(() => {
      if (this.showResults && this.guidanceResult) {
        this.initializeMap()
      }
    }, 100)
  }







  // Helper methods for roadmap enhancements
  getEstimatedTime(index: number): string {
    const times = ['2-3 weeks', '1-2 months', '3-4 weeks', '2-3 months', '1-2 weeks', '4-6 weeks']
    return times[index % times.length]
  }

  getDifficultyLevel(index: number): number {
    const levels = [2, 3, 2, 4, 1, 3]
    return levels[index % levels.length]
  }

  getDifficultyText(index: number): string {
    const texts = ['Easy', 'Medium', 'Easy', 'Hard', 'Beginner', 'Medium']
    return texts[index % texts.length]
  }

  getStepStatus(index: number): string {
    const statuses = ['Ready to Start', 'In Progress', 'Recommended', 'Advanced', 'Quick Win', 'Essential']
    return statuses[index % statuses.length]
  }

  getStepStatusClass(index: number): string {
    const classes = [
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800', 
      'bg-purple-100 text-purple-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800'
    ]
    return classes[index % classes.length]
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

          // Scroll to top to show results
          window.scrollTo({ top: 0, behavior: 'smooth' })

          // Initialize map for the job market insights
          setTimeout(() => {
            this.initializeMap()
          }, 500)
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
    // Navigate to the detailed view page (original approach)
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
    this.loadingHistory = true
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
    } finally {
      this.loadingHistory = false
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
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Navigate to the detailed view page with history route
    this.router.navigate(["/ai-career-navigator/career-guidance/history", session.id || session._id])
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

  // Enhanced statistics methods
  getTodaySessions(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate >= today && sessionDate < tomorrow
    }).length
  }

  getFailedSessions(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0
    return this.fullGuidanceHistory.filter((session) =>
      session.status === "failed" || session.status === "error" || session.status === "cancelled"
    ).length
  }

  getDaysActive(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0
    const uniqueDates = new Set()

    this.fullGuidanceHistory.forEach((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      const dateString = sessionDate.toDateString()
      uniqueDates.add(dateString)
    })

    return uniqueDates.size
  }

  getAverageSessionsPerDay(): number {
    const daysActive = this.getDaysActive()
    if (daysActive === 0) return 0
    return Math.round((this.fullGuidanceHistory.length / daysActive) * 10) / 10
  }

  getMostActiveDay(): string {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 'N/A'

    const dayCounts: { [key: string]: number } = {}
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    this.fullGuidanceHistory.forEach((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      const dayName = dayNames[sessionDate.getDay()]
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
    })

    const mostActiveDay = Object.entries(dayCounts)
      .sort(([,a], [,b]) => b - a)[0]

    return mostActiveDay ? mostActiveDay[0] : 'N/A'
  }

  getWeeklyTrend(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const thisWeek = this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate >= oneWeekAgo
    }).length

    const lastWeek = this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate >= twoWeeksAgo && sessionDate < oneWeekAgo
    }).length

    if (lastWeek === 0) return thisWeek > 0 ? 100 : 0
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
  }

  getMonthlyTrend(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())

    const thisMonth = this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate >= oneMonthAgo
    }).length

    const lastMonth = this.fullGuidanceHistory.filter((session) => {
      const sessionDate = new Date(session.createdAt || session.created_at)
      return sessionDate >= twoMonthsAgo && sessionDate < oneMonthAgo
    }).length

    if (lastMonth === 0) return thisMonth > 0 ? 100 : 0
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
  }

  getCurrentStreak(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const sortedSessions = [...this.fullGuidanceHistory].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at)
      const dateB = new Date(b.createdAt || b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let streak = 0
    let currentDate = new Date(today)

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const hasSessionOnDate = sortedSessions.some(session => {
        const sessionDate = new Date(session.createdAt || session.created_at)
        sessionDate.setHours(0, 0, 0, 0)
        return sessionDate.getTime() === currentDate.getTime()
      })

      if (hasSessionOnDate) {
        streak++
      } else if (streak > 0) {
        break
      }

      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  // Additional detailed analytics methods
  getLast7DaysActivity(): { dayName: string; date: string; sessions: number }[] {
    const result = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const dayName = dayNames[date.getDay()]
      const dateString = `${date.getMonth() + 1}/${date.getDate()}`

      const sessions = this.fullGuidanceHistory?.filter(session => {
        const sessionDate = new Date(session.createdAt || session.created_at)
        return sessionDate.toDateString() === date.toDateString()
      }).length || 0

      result.push({ dayName, date: dateString, sessions })
    }

    return result
  }

  getFieldDistribution(): { name: string; count: number; percentage: number }[] {
    const fields = this.getPopularFields()
    const total = this.fullGuidanceHistory?.length || 0

    if (total === 0) return []

    return fields.map(field => ({
      ...field,
      percentage: Math.round((field.count / total) * 100)
    }))
  }

  getFieldColor(index: number): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ]
    return colors[index % colors.length]
  }

  getFavoriteField(): string {
    const fields = this.getPopularFields()
    return fields.length > 0 && fields[0].count > 0 ? fields[0].name : 'N/A'
  }

  getBestDay(): string {
    return this.getMostActiveDay()
  }

  getProductivityScore(): number {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return 0

    const successRate = this.getSuccessRate()
    const consistency = Math.min(100, (this.getDaysActive() / 30) * 100)
    const activity = Math.min(100, (this.fullGuidanceHistory.length / 10) * 100)

    return Math.round((successRate + consistency + activity) / 3)
  }

  getLongestStreak(): string {
    if (!this.fullGuidanceHistory || this.fullGuidanceHistory.length === 0) return '0 days'

    const sortedSessions = [...this.fullGuidanceHistory].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at)
      const dateB = new Date(b.createdAt || b.created_at)
      return dateA.getTime() - dateB.getTime()
    })

    let longestStreak = 0
    let currentStreak = 1
    let lastDate = new Date(sortedSessions[0]?.createdAt || sortedSessions[0]?.created_at)

    for (let i = 1; i < sortedSessions.length; i++) {
      const currentDate = new Date(sortedSessions[i].createdAt || sortedSessions[i].created_at)
      const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 1) {
        currentStreak++
      } else if (daysDiff > 1) {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }

      lastDate = currentDate
    }

    longestStreak = Math.max(longestStreak, currentStreak)
    return `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`
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
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' })

    switch (tab) {
      case "dashboard":
        this.router.navigate(["/ai-career-navigator/dashboard"])
        break
      case "history":
        this.loadFullHistory() // Trigger loading when navigating to history
        this.router.navigate(["/ai-career-navigator/history"])
        break
      case "stats":
        this.loadUserStats() // Keep existing stats loading
        this.router.navigate(["/ai-career-navigator/statistics"])
        break
    }
  }

  // Map initialization
  private initializeMap(): void {
    console.log('Attempting to initialize map...')

    if (this.mapInitialized) {
      console.log('Map already initialized, skipping...')
      return
    }

    const mapContainer = document.getElementById('world-map')
    if (!mapContainer) {
      console.log('Map container not found, skipping map initialization')
      return
    }

    try {
      console.log('Creating Leaflet map...')

      // Clean up existing map if any
      if (this.map) {
        this.map.remove()
        this.map = null
      }

      // Initialize the map with proper world view
      this.map = L.map('world-map', {
        center: [20, 0], // Center on equator
        zoom: 2,
        minZoom: 1,
        maxZoom: 10,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true,
        worldCopyJump: true
      })

      console.log('Map created, adding tile layer...')

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        tileSize: 256,
        zoomOffset: 0
      }).addTo(this.map)

      console.log('Tile layer added, adding country markers...')

      // Get countries from guidance result or use default
      let countriesToShow = this.topHiringCountries

      // If we have guidance data with countries, use those instead
      if (this.guidanceResult?.jobMarket?.topCountriesHiring || this.guidanceResult?.job_market?.top_countries_hiring) {
        const guidanceCountries = this.guidanceResult.jobMarket?.topCountriesHiring || this.guidanceResult.job_market?.top_countries_hiring
        console.log('Using guidance countries:', guidanceCountries)

        // Map guidance countries to our coordinate data
        countriesToShow = guidanceCountries.map((countryName: string, index: number) => {
          const existingCountry = this.topHiringCountries.find(c =>
            c.name.toLowerCase().includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(c.name.toLowerCase())
          )

          if (existingCountry) {
            return { ...existingCountry, jobs: 10000 - (index * 1000) }
          }

          // Fallback coordinates for unknown countries
          return {
            name: countryName,
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180,
            jobs: 5000 - (index * 500),
            color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]
          }
        }).slice(0, 10)
      }

      // Add markers for countries
      countriesToShow.forEach((country, index) => {
        const radius = Math.max(8, Math.min(25, Math.sqrt(country.jobs) / 100))

        const marker = L.circleMarker([country.lat, country.lng], {
          radius: radius,
          fillColor: country.color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map!)

        // Create popup content
        const popupContent = `
          <div class="text-center p-2">
            <h4 class="font-bold text-lg text-gray-800 mb-1">${country.name}</h4>
            <p class="text-gray-600 text-sm">${country.jobs.toLocaleString()} jobs available</p>
            <div class="mt-2 text-xs text-gray-500">
              Click to explore opportunities
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 200,
          className: 'custom-popup'
        })

        // Add hover effects
        marker.on('mouseover', function(this: L.CircleMarker) {
          this.setStyle({
            fillOpacity: 1,
            radius: radius * 1.2
          })
        })

        marker.on('mouseout', function(this: L.CircleMarker) {
          this.setStyle({
            fillOpacity: 0.8,
            radius: radius
          })
        })
      })

      this.mapInitialized = true
      console.log('Map initialization completed successfully')

      // Force map to resize after a short delay
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize()
          console.log('Map size invalidated')
        }
      }, 100)

    } catch (error) {
      console.error('Error initializing map:', error)
      this.mapInitialized = false
    }
  }

  // Method to refresh/reinitialize the map
  refreshMap(): void {
    console.log('Refreshing map...')
    this.mapInitialized = false
    if (this.map) {
      this.map.remove()
      this.map = null
    }
    setTimeout(() => {
      this.initializeMap()
    }, 100)
  }

  logout(): void {
    this.authService.logout()
  }
}
