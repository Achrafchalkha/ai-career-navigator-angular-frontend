import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-career-guidance-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Loading State -->
    <div *ngIf="isLoading" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading career guidance details...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div *ngIf="!isLoading" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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
                  class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors border-b-2 border-transparent"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  Dashboard
                </button>

                <button
                  (click)="navigateToTab('history')"
                  class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors border-b-2 border-transparent"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  History
                </button>

                <button
                  (click)="navigateToTab('stats')"
                  class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors border-b-2 border-transparent"
                >
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"></path>
                  </svg>
                  Statistics
                </button>

                <div class="h-6 w-px bg-gray-300"></div>

                <span class="text-sm text-gray-500 font-medium">Session Details</span>
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

              <!-- Session ID -->
              <span class="hidden sm:block text-sm text-gray-500">Session: {{ sessionId?.slice(-8) }}</span>

              <!-- Action Buttons -->
              <button
                (click)="goBack()"
                class="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="hidden sm:inline">Back</span>
              </button>

              <button
                (click)="deleteSession()"
                class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span class="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <div *ngIf="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
            <div class="flex flex-col space-y-2">
              <button
                (click)="navigateToTab('dashboard'); showMobileMenu = false"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Dashboard
              </button>
              <button
                (click)="navigateToTab('history'); showMobileMenu = false"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                History
              </button>
              <button
                (click)="navigateToTab('stats'); showMobileMenu = false"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600"
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

      <!-- Error State -->
      <div *ngIf="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Session</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            (click)="goBack()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      <!-- Session Details -->
      <div *ngIf="guidanceData && !error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Session Header -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 mb-8">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Career Guidance Session
              </h1>
              <p class="text-gray-600">Generated on {{ formatDate(guidanceData.createdAt) }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <span class="text-sm px-3 py-2 rounded-full font-medium" 
                    [ngClass]="{
                      'bg-green-100 text-green-800': guidanceData.status === 'success',
                      'bg-yellow-100 text-yellow-800': guidanceData.status === 'processing',
                      'bg-red-100 text-red-800': guidanceData.status === 'error'
                    }">
                {{ guidanceData.status | titlecase }}
              </span>
            </div>
          </div>

          <!-- User Profile Summary -->
          <div *ngIf="guidanceData.userProfile" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Your Profile Summary
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngIf="guidanceData.userProfile.age">
                <span class="text-sm font-medium text-gray-700">Age:</span>
                <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.age }}</span>
              </div>
              <div *ngIf="guidanceData.userProfile.education">
                <span class="text-sm font-medium text-gray-700">Education:</span>
                <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.education }}</span>
              </div>
              <div *ngIf="guidanceData.userProfile.experienceLevel">
                <span class="text-sm font-medium text-gray-700">Experience:</span>
                <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.experienceLevel }}</span>
              </div>
              <div *ngIf="guidanceData.userProfile.currentRole">
                <span class="text-sm font-medium text-gray-700">Current Role:</span>
                <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.currentRole }}</span>
              </div>
              <div *ngIf="guidanceData.userProfile.desiredField">
                <span class="text-sm font-medium text-gray-700">Desired Field:</span>
                <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.desiredField }}</span>
              </div>
              <div *ngIf="guidanceData.userProfile.interests">
                <span class="text-sm font-medium text-gray-700">Interests:</span>
                <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.interests }}</span>
              </div>
            </div>
            <div *ngIf="guidanceData.userProfile.softSkills" class="mt-4">
              <span class="text-sm font-medium text-gray-700">Soft Skills:</span>
              <span class="text-sm text-gray-900 ml-2">{{ guidanceData.userProfile.softSkills }}</span>
            </div>
            <div *ngIf="guidanceData.userProfile.additionalNotes" class="mt-4">
              <span class="text-sm font-medium text-gray-700">Additional Notes:</span>
              <p class="text-sm text-gray-900 mt-1">{{ guidanceData.userProfile.additionalNotes }}</p>
            </div>
          </div>
        </div>

        <!-- Detailed Results -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Career Suggestions -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
              Career Suggestions
            </h3>
            <div class="space-y-3">
              <div *ngFor="let suggestion of (guidanceData.careerSuggestions || guidanceData.career_suggestions || []); let i = index"
                   class="p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span class="text-white text-sm font-bold">{{ i + 1 }}</span>
                  </div>
                  <p class="text-gray-800 font-medium">{{ suggestion }}</p>
                </div>
              </div>
              <div *ngIf="!(guidanceData.careerSuggestions || guidanceData.career_suggestions)?.length"
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
              <div *ngFor="let step of (guidanceData.roadmap || []); let i = index"
                   class="flex items-start p-4 bg-white rounded-lg shadow-sm border border-purple-200">
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-white text-sm font-bold">{{ i + 1 }}</span>
                </div>
                <p class="text-gray-800">{{ step }}</p>
              </div>
              <div *ngIf="!guidanceData.roadmap?.length"
                   class="p-4 bg-gray-50 rounded-lg text-center">
                <p class="text-gray-500">No learning roadmap available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Recommendations -->
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            Recommended Courses
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let course of (guidanceData.topCourses || guidanceData.top_courses || [])"
                 class="p-6 bg-white rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-shadow">
              <h4 class="font-semibold text-gray-900 text-lg mb-2">{{ course.title || course.name || 'Course Title' }}</h4>
              <p class="text-sm text-green-600 mb-3 font-medium">{{ course.provider || 'Provider' }}</p>
              <p class="text-sm text-gray-700 mb-4">{{ course.description || 'Course description not available' }}</p>
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">{{ course.level || 'Beginner' }}</span>
                <span *ngIf="course.estimatedHours || course.duration" class="text-xs text-gray-500 font-medium">
                  {{ course.estimatedHours || course.duration }}{{ course.estimatedHours ? 'h' : '' }}
                </span>
              </div>
              <a *ngIf="course.url || course.link" [href]="course.url || course.link" target="_blank"
                 class="inline-flex items-center w-full justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                View Course
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
            <div *ngIf="!(guidanceData.topCourses || guidanceData.top_courses)?.length"
                 class="col-span-full p-6 bg-gray-50 rounded-lg text-center">
              <p class="text-gray-500">No course recommendations available</p>
            </div>
          </div>
        </div>

        <!-- Skills and Projects Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Skills to Track -->
          <div class="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Skills to Develop
            </h3>
            <div class="flex flex-wrap gap-3">
              <span *ngFor="let skill of (guidanceData.skillsToTrack || guidanceData.skills_to_track || [])"
                    class="px-4 py-2 bg-white text-orange-700 rounded-lg text-sm font-medium border border-orange-200 hover:bg-orange-50 transition-colors shadow-sm">
                {{ skill }}
              </span>
              <div *ngIf="!(guidanceData.skillsToTrack || guidanceData.skills_to_track)?.length"
                   class="p-4 bg-gray-50 rounded-lg text-center w-full">
                <p class="text-gray-500">No skills to track available</p>
              </div>
            </div>
          </div>

          <!-- Project Ideas -->
          <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
            <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              Project Ideas
            </h3>
            <div class="space-y-3">
              <div *ngFor="let project of (guidanceData.projectIdeas || guidanceData.project_ideas || []); let i = index"
                   class="p-4 bg-white rounded-lg shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span class="text-white text-sm font-bold">{{ i + 1 }}</span>
                  </div>
                  <p class="text-gray-800">{{ project }}</p>
                </div>
              </div>
              <div *ngIf="!(guidanceData.projectIdeas || guidanceData.project_ideas)?.length"
                   class="p-4 bg-gray-50 rounded-lg text-center">
                <p class="text-gray-500">No project ideas available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Market Insights -->
        <div *ngIf="guidanceData.jobMarket || guidanceData.job_market" class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100 mb-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"></path>
            </svg>
            Job Market Insights
          </h3>

          <!-- Market Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="text-center p-6 bg-white rounded-lg border border-teal-200 shadow-sm">
              <div class="text-3xl font-bold text-teal-600 mb-2">
                {{ (guidanceData.jobMarket || guidanceData.job_market)?.averageSalaryUsd ||
                    (guidanceData.jobMarket || guidanceData.job_market)?.average_salary_usd || 'N/A' }}
              </div>
              <div class="text-sm text-gray-600 font-medium">Average Salary (USD)</div>
            </div>
            <div class="text-center p-6 bg-white rounded-lg border border-teal-200 shadow-sm">
              <div class="text-3xl font-bold text-teal-600 mb-2">
                {{ (guidanceData.jobMarket || guidanceData.job_market)?.jobDemandLevel ||
                    (guidanceData.jobMarket || guidanceData.job_market)?.job_demand_level || 'N/A' }}
              </div>
              <div class="text-sm text-gray-600 font-medium">Job Demand Level</div>
            </div>
            <div class="text-center p-6 bg-white rounded-lg border border-teal-200 shadow-sm">
              <div class="text-3xl font-bold text-teal-600 mb-2">
                {{ (guidanceData.jobMarket || guidanceData.job_market)?.growthProjection ||
                    (guidanceData.jobMarket || guidanceData.job_market)?.growth_projection || 'N/A' }}
              </div>
              <div class="text-sm text-gray-600 font-medium">Growth Projection</div>
            </div>
            <div class="text-center p-6 bg-white rounded-lg border border-teal-200 shadow-sm">
              <div class="text-3xl font-bold text-teal-600 mb-2">
                {{ ((guidanceData.jobMarket || guidanceData.job_market)?.topCountriesHiring ||
                    (guidanceData.jobMarket || guidanceData.job_market)?.top_countries_hiring)?.length || 0 }}
              </div>
              <div class="text-sm text-gray-600 font-medium">Top Markets</div>
            </div>
          </div>

          <!-- Market Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngIf="((guidanceData.jobMarket || guidanceData.job_market)?.topCountriesHiring ||
                        (guidanceData.jobMarket || guidanceData.job_market)?.top_countries_hiring)?.length"
                 class="bg-white rounded-lg p-6 border border-teal-200 shadow-sm">
              <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Top Hiring Countries
              </h4>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let country of ((guidanceData.jobMarket || guidanceData.job_market)?.topCountriesHiring ||
                                              (guidanceData.jobMarket || guidanceData.job_market)?.top_countries_hiring || [])"
                      class="px-3 py-2 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium">
                  {{ country }}
                </span>
              </div>
            </div>
            <div *ngIf="((guidanceData.jobMarket || guidanceData.job_market)?.topCompanies ||
                        (guidanceData.jobMarket || guidanceData.job_market)?.top_companies)?.length"
                 class="bg-white rounded-lg p-6 border border-teal-200 shadow-sm">
              <h4 class="font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Top Companies
              </h4>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let company of ((guidanceData.jobMarket || guidanceData.job_market)?.topCompanies ||
                                              (guidanceData.jobMarket || guidanceData.job_market)?.top_companies || [])"
                      class="px-3 py-2 bg-teal-100 text-teal-800 rounded-lg text-sm font-medium">
                  {{ company }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Raw AI Response -->
        <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
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
            <pre class="bg-white p-4 rounded-lg border border-gray-300 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">{{ guidanceData.rawAiResponse || guidanceData.raw_ai_response || 'No raw response available' }}</pre>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            (click)="goBack()"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </button>
          <button
            (click)="deleteSession()"
            class="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete Session
          </button>
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
  `]
})
export class CareerGuidanceDetailsComponent implements OnInit {
  sessionId: string = '';
  guidanceData: any = null;
  isLoading = true;
  error: string = '';
  showRawResponse = false;
  showMobileMenu = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      if (this.sessionId) {
        this.loadGuidanceDetails();
      } else {
        this.error = 'No session ID provided';
        this.isLoading = false;
      }
    });
  }

  async loadGuidanceDetails(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response = await this.http.get<any>(
        `${environment.apiUrl}/career/history/${this.sessionId}`,
        { headers }
      ).toPromise();

      if (response && response.status === 'success') {
        this.guidanceData = response.guidance;
      } else {
        throw new Error(response?.message || 'Failed to load guidance details');
      }
    } catch (error: any) {
      console.error('Failed to load guidance details:', error);
      this.error = error.error?.error || error.message || 'Failed to load guidance details';
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  goBack(): void {
    this.router.navigate(['/ai-career-navigator/dashboard']);
  }

  async deleteSession(): Promise<void> {
    if (!confirm('Are you sure you want to delete this career guidance session? This action cannot be undone.')) {
      return;
    }

    try {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      await this.http.delete(
        `${environment.apiUrl}/career/history/${this.sessionId}`,
        { headers }
      ).toPromise();

      this.toastr.success('Career guidance session deleted successfully');
      this.router.navigate(['/ai-career-navigator/dashboard']);
    } catch (error) {
      console.error('Failed to delete session:', error);
      this.toastr.error('Failed to delete career guidance session');
    }
  }
}
