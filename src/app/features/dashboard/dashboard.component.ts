import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <!-- Enhanced Navigation -->
    <nav class="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Career Navigator
            </h1>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-6">
              <button
                (click)="navigateToTab('dashboard')"
                [class]="activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
                class="px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Dashboard
              </button>

              <button
                (click)="navigateToTab('history')"
                [class]="activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
                class="px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent relative"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                History
                <span *ngIf="guidanceHistory.length > 0"
                      class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ guidanceHistory.length }}
                </span>
              </button>

              <button
                (click)="navigateToTab('stats')"
                [class]="activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'"
                class="px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"></path>
                </svg>
                Statistics
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Mobile Menu Button -->
            <button
              (click)="showMobileMenu = !showMobileMenu"
              class="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <!-- User Info -->
            <div class="hidden sm:block text-right">
              <div class="text-sm font-medium text-gray-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
              <div class="text-xs text-gray-500">{{ currentUser?.email }}</div>
            </div>

            <!-- Logout Button -->
            <button
              (click)="logout()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
          <div class="flex flex-col space-y-2">
            <button
              (click)="navigateToTab('dashboard'); showMobileMenu = false"
              [class]="activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard
            </button>
            <button
              (click)="navigateToTab('history'); showMobileMenu = false"
              [class]="activeTab === 'history' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              History ({{ guidanceHistory.length }})
            </button>
            <button
              (click)="navigateToTab('stats'); showMobileMenu = false"
              [class]="activeTab === 'stats' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"></path>
              </svg>
              Statistics
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Dashboard Tab -->
        <div *ngIf="activeTab === 'dashboard'">

        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your AI Career
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Guidance Dashboard
            </span>
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized career recommendations, learning roadmaps, and market insights powered by AI
          </p>
        </div>

        <!-- Career Guidance Form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Input Form -->
          <div class="lg:col-span-2">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Career Profile</h2>
              </div>

              <form [formGroup]="careerForm" (ngSubmit)="onSubmit()" class="space-y-6">
                <!-- Personal Information -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Personal Information
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input
                        type="number"
                        formControlName="age"
                        min="16"
                        max="100"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                      <select
                        formControlName="education"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                    </svg>
                    Experience & Skills
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                      <select
                        formControlName="experienceLevel"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select experience level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Current Role (Optional)</label>
                      <input
                        type="text"
                        formControlName="currentRole"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Software Developer, Student"
                      />
                    </div>
                  </div>
                </div>

                <!-- Interests & Goals -->
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    Interests & Career Goals
                  </h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Areas of Interest</label>
                      <input
                        type="text"
                        formControlName="interests"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Web Development, Data Science, AI/ML, Mobile Apps"
                      />
                      <p class="text-xs text-gray-500 mt-1">Separate multiple interests with commas</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Desired Field/Role</label>
                      <input
                        type="text"
                        formControlName="desiredField"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Frontend Developer, Data Analyst, Product Manager"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                      <input
                        type="text"
                        formControlName="softSkills"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Problem-solving, Communication, Leadership, Teamwork"
                      />
                      <p class="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
                    </div>
                  </div>
                </div>

                <!-- Additional Notes -->
                <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Additional Information
                  </h3>
                  <textarea
                    formControlName="additionalNotes"
                    rows="4"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Any additional information about your career goals, preferences, or specific requirements..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-center pt-6">
                  <button
                    type="submit"
                    [disabled]="careerForm.invalid || isLoading"
                    class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span class="relative z-10 flex items-center">
                      <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg *ngIf="!isLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      {{ isLoading ? 'Generating Guidance...' : 'Get AI Career Guidance' }}
                    </span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Quick Stats & History -->
          <div class="space-y-6">
            <!-- Quick Stats -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Quick Stats
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-700">Guidance Sessions</span>
                  <span class="text-lg font-bold text-blue-600">{{ guidanceHistory.length }}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-700">Last Session</span>
                  <span class="text-sm font-medium text-green-600">
                    {{ lastSessionDate || 'Never' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Recent History -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Recent Sessions
              </h3>
              <div class="space-y-3">
                <div *ngFor="let session of guidanceHistory.slice(0, 3)"
                     class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                     (click)="viewSession(session)">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ session.userProfile?.desiredField || 'Career Guidance' }}</p>
                      <p class="text-xs text-gray-500">{{ formatDate(session.createdAt) }}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full"
                          [ngClass]="{
                            'bg-green-100 text-green-800': session.status === 'success',
                            'bg-yellow-100 text-yellow-800': session.status === 'processing',
                            'bg-red-100 text-red-800': session.status === 'error'
                          }">
                      {{ session.status }}
                    </span>
                  </div>
                </div>
                <div *ngIf="guidanceHistory.length === 0" class="text-center py-4">
                  <p class="text-gray-500 text-sm">No sessions yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div *ngIf="guidanceResult" class="mt-12">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
            <div class="flex items-center mb-8">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900">Your AI Career Guidance</h2>
                <p class="text-gray-600">Personalized recommendations based on your profile</p>
              </div>
            </div>

            <!-- Results Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Career Suggestions -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                  Career Suggestions
                </h3>
                <div class="space-y-3">
                  <div *ngFor="let suggestion of (guidanceResult.careerSuggestions || guidanceResult.career_suggestions || [])"
                       class="p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                    <p class="text-gray-800 font-medium">{{ suggestion }}</p>
                  </div>
                  <div *ngIf="!(guidanceResult.careerSuggestions || guidanceResult.career_suggestions)?.length"
                       class="p-4 bg-gray-50 rounded-lg text-center">
                    <p class="text-gray-500">No career suggestions available</p>
                  </div>
                </div>
              </div>

              <!-- Learning Roadmap -->
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                  Learning Roadmap
                </h3>
                <div class="space-y-3">
                  <div *ngFor="let step of (guidanceResult.roadmap || []); let i = index"
                       class="flex items-start p-4 bg-white rounded-lg shadow-sm border border-purple-200">
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span class="text-white text-sm font-bold">{{ i + 1 }}</span>
                    </div>
                    <p class="text-gray-800">{{ step }}</p>
                  </div>
                  <div *ngIf="!guidanceResult.roadmap?.length"
                       class="p-4 bg-gray-50 rounded-lg text-center">
                    <p class="text-gray-500">No learning roadmap available</p>
                  </div>
                </div>
              </div>

              <!-- Top Courses -->
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  Recommended Courses
                </h3>
                <div class="space-y-3">
                  <div *ngFor="let course of (guidanceResult.topCourses || guidanceResult.top_courses || [])"
                       class="p-4 bg-white rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-shadow">
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
                       class="p-4 bg-gray-50 rounded-lg text-center">
                    <p class="text-gray-500">No course recommendations available</p>
                  </div>
                </div>
              </div>

              <!-- Skills to Track -->
              <div class="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Skills to Develop
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let skill of (guidanceResult.skillsToTrack || guidanceResult.skills_to_track || [])"
                        class="px-3 py-2 bg-white text-orange-700 rounded-lg text-sm font-medium border border-orange-200 hover:bg-orange-50 transition-colors">
                    {{ skill }}
                  </span>
                  <div *ngIf="!(guidanceResult.skillsToTrack || guidanceResult.skills_to_track)?.length"
                       class="p-4 bg-gray-50 rounded-lg text-center w-full">
                    <p class="text-gray-500">No skills to track available</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Full Width Sections -->
            <div class="mt-8 space-y-8">
              <!-- Project Ideas -->
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  Project Ideas
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div *ngFor="let project of (guidanceResult.projectIdeas || guidanceResult.project_ideas || [])"
                       class="p-4 bg-white rounded-lg shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                    <p class="text-gray-800">{{ project }}</p>
                  </div>
                  <div *ngIf="!(guidanceResult.projectIdeas || guidanceResult.project_ideas)?.length"
                       class="p-4 bg-gray-50 rounded-lg text-center col-span-full">
                    <p class="text-gray-500">No project ideas available</p>
                  </div>
                </div>
              </div>

              <!-- Job Market Insights -->
              <div *ngIf="guidanceResult.jobMarket || guidanceResult.job_market" class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Job Market Insights
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div class="text-center p-4 bg-white rounded-lg border border-teal-200">
                    <div class="text-2xl font-bold text-teal-600 mb-2">
                      {{ (guidanceResult.jobMarket || guidanceResult.job_market)?.averageSalaryUsd ||
                          (guidanceResult.jobMarket || guidanceResult.job_market)?.average_salary_usd || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-600">Average Salary</div>
                  </div>
                  <div class="text-center p-4 bg-white rounded-lg border border-teal-200">
                    <div class="text-2xl font-bold text-teal-600 mb-2">
                      {{ (guidanceResult.jobMarket || guidanceResult.job_market)?.jobDemandLevel ||
                          (guidanceResult.jobMarket || guidanceResult.job_market)?.job_demand_level || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-600">Job Demand</div>
                  </div>
                  <div class="text-center p-4 bg-white rounded-lg border border-teal-200">
                    <div class="text-2xl font-bold text-teal-600 mb-2">
                      {{ (guidanceResult.jobMarket || guidanceResult.job_market)?.growthProjection ||
                          (guidanceResult.jobMarket || guidanceResult.job_market)?.growth_projection || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-600">Growth Rate</div>
                  </div>
                  <div class="text-center p-4 bg-white rounded-lg border border-teal-200">
                    <div class="text-2xl font-bold text-teal-600 mb-2">
                      {{ ((guidanceResult.jobMarket || guidanceResult.job_market)?.topCountriesHiring ||
                          (guidanceResult.jobMarket || guidanceResult.job_market)?.top_countries_hiring)?.length || 0 }}
                    </div>
                    <div class="text-sm text-gray-600">Top Markets</div>
                  </div>
                </div>

                <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div *ngIf="((guidanceResult.jobMarket || guidanceResult.job_market)?.topCountriesHiring ||
                              (guidanceResult.jobMarket || guidanceResult.job_market)?.top_countries_hiring)?.length"
                       class="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 class="font-semibold text-gray-900 mb-3">Top Hiring Countries</h4>
                    <div class="space-y-2">
                      <span *ngFor="let country of ((guidanceResult.jobMarket || guidanceResult.job_market)?.topCountriesHiring ||
                                                    (guidanceResult.jobMarket || guidanceResult.job_market)?.top_countries_hiring || [])"
                            class="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm mr-2 mb-2">
                        {{ country }}
                      </span>
                    </div>
                  </div>
                  <div *ngIf="((guidanceResult.jobMarket || guidanceResult.job_market)?.topCompanies ||
                              (guidanceResult.jobMarket || guidanceResult.job_market)?.top_companies)?.length"
                       class="bg-white rounded-lg p-4 border border-teal-200">
                    <h4 class="font-semibold text-gray-900 mb-3">Top Companies</h4>
                    <div class="space-y-2">
                      <span *ngFor="let company of ((guidanceResult.jobMarket || guidanceResult.job_market)?.topCompanies ||
                                                    (guidanceResult.jobMarket || guidanceResult.job_market)?.top_companies || [])"
                            class="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm mr-2 mb-2">
                        {{ company }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Debug Response Structure -->
              <div class="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <button
                  (click)="showDebugResponse = !showDebugResponse"
                  class="flex items-center justify-between w-full text-left">
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Debug: Response Structure
                  </h3>
                  <svg class="w-5 h-5 text-gray-400 transform transition-transform"
                       [class.rotate-180]="showDebugResponse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div *ngIf="showDebugResponse" class="mt-4">
                  <pre class="bg-white p-4 rounded-lg border border-gray-300 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">{{ guidanceResult | json }}</pre>
                </div>
              </div>

              <!-- Raw AI Response (Collapsible) -->
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <button
                  (click)="showRawResponse = !showRawResponse"
                  class="flex items-center justify-between w-full text-left">
                  <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    Raw AI Response
                  </h3>
                  <svg class="w-5 h-5 text-gray-400 transform transition-transform"
                       [class.rotate-180]="showRawResponse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div *ngIf="showRawResponse" class="mt-4">
                  <pre class="bg-white p-4 rounded-lg border border-gray-300 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">{{ guidanceResult.rawAiResponse || guidanceResult.raw_ai_response || 'No raw response available' }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- History Tab -->
        <div *ngIf="activeTab === 'history'">
          <div class="mb-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Career Guidance
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                History
              </span>
            </h1>
            <p class="text-xl text-gray-600">
              View and manage all your previous career guidance sessions
            </p>
          </div>

          <!-- History Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ fullGuidanceHistory.length }}</div>
                  <div class="text-sm text-gray-600">Total Sessions</div>
                </div>
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ getSuccessfulSessions() }}</div>
                  <div class="text-sm text-gray-600">Successful</div>
                </div>
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 12v-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v2M8 7a2 2 0 012-2h2a2 2 0 012 2v2H8V7z"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-2xl font-bold text-gray-900">{{ getLatestSessionDate() }}</div>
                  <div class="text-sm text-gray-600">Latest Session</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search and Filter -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 mb-8">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <input
                  type="text"
                  [(ngModel)]="historySearchTerm"
                  (input)="filterHistory()"
                  placeholder="Search your career guidance history..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div class="flex gap-2">
                <select
                  [(ngModel)]="historyStatusFilter"
                  (change)="filterHistory()"
                  class="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Status</option>
                  <option value="success">Successful</option>
                  <option value="error">Failed</option>
                  <option value="processing">Processing</option>
                </select>
                <button
                  (click)="loadFullHistory()"
                  class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- History List -->
          <div class="space-y-4">
            <div *ngFor="let session of filteredHistory; let i = index"
                 class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div class="p-6">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">
                      Career Guidance Session #{{ fullGuidanceHistory.length - i }}
                    </h3>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span class="text-sm text-gray-600">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 12v-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v2M8 7a2 2 0 012-2h2a2 2 0 012 2v2H8V7z"></path>
                        </svg>
                        {{ formatDate(session.createdAt) }}
                      </span>
                      <span class="text-sm px-2 py-1 rounded-full"
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
                  <div class="flex items-center space-x-2 mt-4 md:mt-0">
                    <button
                      (click)="viewHistorySession(session)"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                    <button
                      (click)="deleteHistorySession(session.id)"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                <!-- Quick Preview -->
                <div *ngIf="session.careerSuggestions?.length" class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Career Suggestions Preview:</h4>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let suggestion of session.careerSuggestions.slice(0, 3)"
                          class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {{ suggestion }}
                    </span>
                    <span *ngIf="session.careerSuggestions.length > 3"
                          class="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                      +{{ session.careerSuggestions.length - 3 }} more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredHistory.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No guidance sessions found</h3>
              <p class="text-gray-600 mb-4">
                {{ historySearchTerm || historyStatusFilter ? 'Try adjusting your search or filter criteria.' : 'Start by creating your first career guidance session.' }}
              </p>
              <button
                *ngIf="!historySearchTerm && !historyStatusFilter"
                (click)="navigateToTab('dashboard')"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Session
              </button>
            </div>
          </div>
        </div>

        <!-- Statistics Tab -->
        <div *ngIf="activeTab === 'stats'">
          <div class="mb-8">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Career Guidance
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Statistics
              </span>
            </h1>
            <p class="text-xl text-gray-600">
              Insights and analytics about your career guidance journey
            </p>
          </div>

          <!-- Loading State -->
          <div *ngIf="loadingStats" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Loading statistics...</p>
          </div>

          <!-- Stats Content -->
          <div *ngIf="!loadingStats && userStats" class="space-y-8">
            <!-- Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ userStats.total_guidance_sessions }}</div>
                    <div class="text-sm text-gray-600">Total Sessions</div>
                  </div>
                </div>
              </div>

              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ userStats.has_guidance ? 'Active' : 'Inactive' }}</div>
                    <div class="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>

              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ formatDate(userStats.latest_session_date) || 'Never' }}</div>
                    <div class="text-sm text-gray-600">Latest Session</div>
                  </div>
                </div>
              </div>

              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-gray-900">{{ getSuccessRate() }}%</div>
                    <div class="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Stats -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">Usage Insights</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 class="text-lg font-medium text-gray-800 mb-4">Session Activity</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">This Month</span>
                      <span class="font-semibold">{{ getThisMonthSessions() }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">This Week</span>
                      <span class="font-semibold">{{ getThisWeekSessions() }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Average per Month</span>
                      <span class="font-semibold">{{ getAverageSessionsPerMonth() }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-medium text-gray-800 mb-4">Popular Fields</h4>
                  <div class="space-y-2">
                    <div *ngFor="let field of getPopularFields()" class="flex justify-between items-center">
                      <span class="text-gray-600">{{ field.name }}</span>
                      <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{{ field.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Stats Available -->
          <div *ngIf="!loadingStats && !userStats" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No statistics available</h3>
            <p class="text-gray-600 mb-4">Create some career guidance sessions to see your statistics.</p>
            <button
              (click)="navigateToTab('dashboard')"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .backdrop-blur-md {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }

    pre {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;
  currentUser: any;
  careerForm: FormGroup;
  isLoading = false;
  guidanceResult: any = null;
  guidanceHistory: any[] = [];
  lastSessionDate: string = '';
  showRawResponse = false;
  showDebugResponse = false;

  // Navigation and UI state
  activeTab: 'dashboard' | 'history' | 'stats' = 'dashboard';
  showMobileMenu = false;

  // History functionality
  fullGuidanceHistory: any[] = [];
  filteredHistory: any[] = [];
  historySearchTerm = '';
  historyStatusFilter = '';

  // Statistics
  userStats: any = null;
  loadingStats = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.careerForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      education: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      currentRole: [''],
      interests: ['', Validators.required],
      desiredField: ['', Validators.required],
      softSkills: ['', Validators.required],
      additionalNotes: ['']
    });

    this.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.currentUser = user;
      }
    });
  }

  ngOnInit(): void {
    // Detect active tab from route
    this.route.data.subscribe(data => {
      if (data['activeTab']) {
        this.activeTab = data['activeTab'];
        if (this.activeTab === 'history') {
          this.loadFullHistory();
        } else if (this.activeTab === 'stats') {
          this.loadUserStats();
        }
      }
    });

    // Also check the current URL path
    const currentPath = this.router.url;
    if (currentPath.includes('/history')) {
      this.activeTab = 'history';
      this.loadFullHistory();
    } else if (currentPath.includes('/statistics')) {
      this.activeTab = 'stats';
      this.loadUserStats();
    } else {
      this.activeTab = 'dashboard';
    }

    this.loadGuidanceHistory();
  }

  async onSubmit(): Promise<void> {
    if (this.careerForm.valid) {
      this.isLoading = true;
      this.guidanceResult = null;

      try {
        const formData = this.careerForm.value;

        // Prepare the request payload
        const payload = {
          age: parseInt(formData.age),
          education: formData.education,
          experienceLevel: formData.experienceLevel,
          currentRole: formData.currentRole || undefined,
          interests: formData.interests,
          desiredField: formData.desiredField,
          softSkills: formData.softSkills,
          additionalNotes: formData.additionalNotes || undefined
        };

        const token = this.authService.getToken();
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const response = await this.http.post<any>(
          `${environment.apiUrl}/career/guidance`,
          payload,
          { headers }
        ).toPromise();

        console.log('Career guidance response:', response);

        if (response && response.status === 'success') {
          this.guidanceResult = response.guidance;
          console.log('Guidance result:', this.guidanceResult);
          this.toastr.success('Career guidance generated successfully!');
          this.loadGuidanceHistory(); // Refresh history
        } else {
          throw new Error(response?.message || 'Failed to generate career guidance');
        }

      } catch (error: any) {
        console.error('Career guidance error:', error);
        this.toastr.error(error.error?.error || error.message || 'Failed to generate career guidance');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.toastr.error('Please fill in all required fields');
      this.markFormGroupTouched();
    }
  }

  async loadGuidanceHistory(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response = await this.http.get<any>(
        `${environment.apiUrl}/career/history`,
        { headers }
      ).toPromise();

      if (response && response.status === 'success') {
        this.guidanceHistory = response.history || [];
        if (this.guidanceHistory.length > 0) {
          this.lastSessionDate = this.formatDate(this.guidanceHistory[0].createdAt);
        }
      }
    } catch (error) {
      console.error('Failed to load guidance history:', error);
    }
  }

  viewSession(session: any): void {
    // Navigate to the detailed view page
    this.router.navigate(['/ai-career-navigator/career-guidance', session.id || session._id]);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.careerForm.controls).forEach(key => {
      const control = this.careerForm.get(key);
      control?.markAsTouched();
    });
  }

  // History methods
  async loadFullHistory(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response = await this.http.get<any>(
        `${environment.apiUrl}/career/history`,
        { headers }
      ).toPromise();

      if (response && response.status === 'success') {
        this.fullGuidanceHistory = response.history || [];
        this.filteredHistory = [...this.fullGuidanceHistory];
      }
    } catch (error) {
      console.error('Failed to load full guidance history:', error);
      this.toastr.error('Failed to load guidance history');
    }
  }

  filterHistory(): void {
    this.filteredHistory = this.fullGuidanceHistory.filter(session => {
      const matchesSearch = !this.historySearchTerm ||
        (session.userProfile?.desiredField?.toLowerCase().includes(this.historySearchTerm.toLowerCase()) ||
         session.userProfile?.experienceLevel?.toLowerCase().includes(this.historySearchTerm.toLowerCase()) ||
         session.careerSuggestions?.some((suggestion: string) =>
           suggestion.toLowerCase().includes(this.historySearchTerm.toLowerCase())));

      const matchesStatus = !this.historyStatusFilter || session.status === this.historyStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  viewHistorySession(session: any): void {
    // Navigate to the detailed view page
    this.router.navigate(['/ai-career-navigator/career-guidance', session.id || session._id]);
  }

  async deleteHistorySession(sessionId: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this career guidance session?')) {
      return;
    }

    try {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      await this.http.delete(
        `${environment.apiUrl}/career/history/${sessionId}`,
        { headers }
      ).toPromise();

      this.toastr.success('Career guidance session deleted successfully');
      this.loadFullHistory(); // Refresh the list
      this.loadGuidanceHistory(); // Refresh the sidebar
    } catch (error) {
      console.error('Failed to delete session:', error);
      this.toastr.error('Failed to delete career guidance session');
    }
  }

  // Statistics methods
  async loadUserStats(): Promise<void> {
    this.loadingStats = true;
    try {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response = await this.http.get<any>(
        `${environment.apiUrl}/career/stats`,
        { headers }
      ).toPromise();

      if (response && response.status === 'success') {
        this.userStats = response.stats;
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
      this.toastr.error('Failed to load statistics');
    } finally {
      this.loadingStats = false;
    }
  }

  getSuccessfulSessions(): number {
    return this.fullGuidanceHistory.filter(session => session.status === 'success').length;
  }

  getLatestSessionDate(): string {
    if (this.fullGuidanceHistory.length === 0) return 'Never';
    return this.formatDate(this.fullGuidanceHistory[0].createdAt);
  }

  getSuccessRate(): number {
    if (this.fullGuidanceHistory.length === 0) return 0;
    const successful = this.getSuccessfulSessions();
    return Math.round((successful / this.fullGuidanceHistory.length) * 100);
  }

  getThisMonthSessions(): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return this.fullGuidanceHistory.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate.getMonth() === thisMonth && sessionDate.getFullYear() === thisYear;
    }).length;
  }

  getThisWeekSessions(): number {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return this.fullGuidanceHistory.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= oneWeekAgo;
    }).length;
  }

  getAverageSessionsPerMonth(): number {
    if (this.fullGuidanceHistory.length === 0) return 0;

    const oldestSession = new Date(this.fullGuidanceHistory[this.fullGuidanceHistory.length - 1].createdAt);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - oldestSession.getFullYear()) * 12 +
                      (now.getMonth() - oldestSession.getMonth()) + 1;

    return Math.round(this.fullGuidanceHistory.length / monthsDiff * 10) / 10;
  }

  getPopularFields(): { name: string; count: number }[] {
    const fieldCounts: { [key: string]: number } = {};

    this.fullGuidanceHistory.forEach(session => {
      const field = session.userProfile?.desiredField;
      if (field) {
        fieldCounts[field] = (fieldCounts[field] || 0) + 1;
      }
    });

    return Object.entries(fieldCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Navigation methods
  navigateToTab(tab: 'dashboard' | 'history' | 'stats'): void {
    switch (tab) {
      case 'dashboard':
        this.router.navigate(['/ai-career-navigator/dashboard']);
        break;
      case 'history':
        this.router.navigate(['/ai-career-navigator/history']);
        break;
      case 'stats':
        this.router.navigate(['/ai-career-navigator/statistics']);
        break;
    }
  }

  logout(): void {
    this.authService.logout();
    this.toastr.success('Logged out successfully');
    this.router.navigate(['/ai-career-navigator/login']);
  }
}
