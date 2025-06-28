import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { AuthService } from "../../core/services/auth.service"
import { ToastrService } from "ngx-toastr"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-career-guidance-details",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Animated Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 -z-10">
      <div class="absolute inset-0 opacity-40" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
      <div class="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-2xl animate-float-delayed"></div>
      <div class="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" class="min-h-screen flex items-center justify-center">
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
          Loading Career Guidance
        </h3>
        <p class="text-gray-600 text-lg">Retrieving your personalized insights...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div *ngIf="!isLoading" class="min-h-screen">
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

      <!-- Error State -->
      <div *ngIf="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
        <div class="text-center">
          <div class="w-24 h-24 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-3xl font-bold text-gray-900 mb-4">Error Loading Session</h3>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{{ error }}</p>
          <button
            (click)="goBack()"
            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>

      <!-- Session Details -->
      <div *ngIf="guidanceData && !error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <!-- Session Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden animate-slide-up">
          <!-- Background Pattern -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl"></div>
          
          <div class="relative z-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div class="flex items-center space-x-6">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    Career Guidance Session
                  </h1>
                  <p class="text-xl text-gray-600">Generated on {{ formatDate(guidanceData.createdAt) }}</p>
                </div>
              </div>
              <div class="mt-6 md:mt-0">
                <span class="text-sm px-6 py-3 rounded-2xl font-bold shadow-lg" 
                      [ngClass]="{
                        'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200': guidanceData.status === 'success',
                        'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200': guidanceData.status === 'processing',
                        'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200': guidanceData.status === 'error'
                      }">
                  {{ guidanceData.status | titlecase }}
                </span>
              </div>
            </div>

            <!-- User Profile Summary -->
            <div *ngIf="guidanceData.userProfile" class="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50 transform hover:scale-[1.02] transition-all duration-300">
              <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                Your Profile Summary
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div *ngIf="guidanceData.userProfile.age" class="bg-white/80 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Age</span>
                  <div class="text-lg font-semibold text-gray-900 mt-1">{{ guidanceData.userProfile.age }}</div>
                </div>
                <div *ngIf="guidanceData.userProfile.education" class="bg-white/80 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Education</span>
                  <div class="text-lg font-semibold text-gray-900 mt-1">{{ guidanceData.userProfile.education }}</div>
                </div>
                <div *ngIf="guidanceData.userProfile.experienceLevel" class="bg-white/80 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Experience</span>
                  <div class="text-lg font-semibold text-gray-900 mt-1">{{ guidanceData.userProfile.experienceLevel }}</div>
                </div>
                <div *ngIf="guidanceData.userProfile.currentRole" class="bg-white/80 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Current Role</span>
                  <div class="text-lg font-semibold text-gray-900 mt-1">{{ guidanceData.userProfile.currentRole }}</div>
                </div>
                <div *ngIf="guidanceData.userProfile.desiredField" class="bg-white/80 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Desired Field</span>
                  <div class="text-lg font-semibold text-gray-900 mt-1">{{ guidanceData.userProfile.desiredField }}</div>
                </div>
                <div *ngIf="guidanceData.userProfile.interests" class="bg-white/80 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Interests</span>
                  <div class="text-lg font-semibold text-gray-900 mt-1">{{ guidanceData.userProfile.interests }}</div>
                </div>
              </div>
              <div *ngIf="guidanceData.userProfile.softSkills" class="mt-6 bg-white/80 rounded-xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Soft Skills</span>
                <div class="text-lg font-semibold text-gray-900 mt-2">{{ guidanceData.userProfile.softSkills }}</div>
              </div>
              <div *ngIf="guidanceData.userProfile.additionalNotes" class="mt-6 bg-white/80 rounded-xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <span class="text-sm font-bold text-blue-600 uppercase tracking-wide">Additional Notes</span>
                <p class="text-lg text-gray-900 mt-2 leading-relaxed">{{ guidanceData.userProfile.additionalNotes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Results Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Career Suggestions -->
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-slide-up">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                </div>
                Career Suggestions
              </h3>
              <div class="space-y-4">
                <div *ngFor="let suggestion of (guidanceData.careerSuggestions || guidanceData.career_suggestions || []); let i = index"
                     class="p-6 bg-white/80 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up"
                     [style.animation-delay]="i * 100 + 'ms'">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span class="text-white text-lg font-bold">{{ i + 1 }}</span>
                    </div>
                    <p class="text-gray-800 font-medium text-lg leading-relaxed">{{ suggestion }}</p>
                  </div>
                </div>
                <div *ngIf="!(guidanceData.careerSuggestions || guidanceData.career_suggestions)?.length"
                     class="p-8 bg-gray-50/80 rounded-2xl text-center">
                  <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <p class="text-gray-500 text-lg">No career suggestions available</p>
                </div>
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
                {{ (guidanceData.roadmap || []).length }} Steps
              </span>
            </h3>

            <div class="relative">
              <!-- Roadmap Timeline -->
              <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300"></div>

              <div class="space-y-6">
                <div *ngFor="let step of (guidanceData.roadmap || []); let i = index; let isLast = last"
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
                          <div *ngFor="let star of getDifficultyStars(i); let j = index"
                               class="w-3 h-3 rounded-full transition-all duration-300"
                               [ngClass]="{
                                 'bg-gradient-to-r from-purple-400 to-pink-400': star,
                                 'bg-gray-200': !star
                               }"></div>
                        </div>
                        <span class="text-sm font-semibold text-purple-600">{{ getDifficultyLevel(i) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="!guidanceData.roadmap?.length"
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
        </div>

        <!-- Course Recommendations -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden transform hover:scale-[1.01] transition-all duration-300 animate-slide-up">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl"></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              Recommended Courses
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let course of (guidanceData.topCourses || guidanceData.top_courses || []); let i = index"
                   class="p-6 bg-white/80 rounded-2xl shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up"
                   [style.animation-delay]="i * 100 + 'ms'">
                <h4 class="font-bold text-gray-900 text-xl mb-3">{{ course.title || course.name || 'Course Title' }}</h4>
                <p class="text-sm text-green-600 mb-4 font-semibold">{{ course.provider || 'Provider' }}</p>
                <p class="text-gray-700 mb-6 leading-relaxed">{{ course.description || 'Course description not available' }}</p>
                <div class="flex justify-between items-center mb-6">
                  <span class="text-xs px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold">{{ course.level || 'Beginner' }}</span>
                  <span *ngIf="course.estimatedHours || course.duration" class="text-sm text-gray-500 font-semibold">
                    {{ course.estimatedHours || course.duration }}{{ course.estimatedHours ? 'h' : '' }}
                  </span>
                </div>
                <a *ngIf="course.url || course.link" [href]="course.url || course.link" target="_blank"
                   class="group relative inline-flex items-center w-full justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden">
                  <span class="relative z-10 flex items-center">
                    View Course
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
              <div *ngIf="!(guidanceData.topCourses || guidanceData.top_courses)?.length"
                   class="col-span-full p-8 bg-gray-50/80 rounded-2xl text-center">
                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <p class="text-gray-500 text-lg">No course recommendations available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills and Projects Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Skills to Track -->
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-slide-up">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-yellow-500/5 to-amber-500/5 rounded-3xl"></div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                Skills to Develop
              </h3>
              <div class="flex flex-wrap gap-4">
                <span *ngFor="let skill of (guidanceData.skillsToTrack || guidanceData.skills_to_track || []); let i = index"
                      class="px-6 py-3 bg-white/80 text-orange-700 rounded-2xl text-sm font-semibold border border-orange-200/50 hover:bg-orange-50 transition-all duration-300 shadow-lg transform hover:scale-105 animate-slide-up"
                      [style.animation-delay]="i * 50 + 'ms'">
                  {{ skill }}
                </span>
                <div *ngIf="!(guidanceData.skillsToTrack || guidanceData.skills_to_track)?.length"
                     class="p-8 bg-gray-50/80 rounded-2xl text-center w-full">
                  <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <p class="text-gray-500 text-lg">No skills to track available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Ideas -->
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-slide-up-delayed">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl"></div>
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                Project Ideas
              </h3>
              <div class="space-y-4">
                <div *ngFor="let project of (guidanceData.projectIdeas || guidanceData.project_ideas || []); let i = index"
                     class="p-6 bg-white/80 rounded-2xl shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up"
                     [style.animation-delay]="i * 100 + 'ms'">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span class="text-white text-lg font-bold">{{ i + 1 }}</span>
                    </div>
                    <p class="text-gray-800 font-medium text-lg leading-relaxed">{{ project }}</p>
                  </div>
                </div>
                <div *ngIf="!(guidanceData.projectIdeas || guidanceData.project_ideas)?.length"
                     class="p-8 bg-gray-50/80 rounded-2xl text-center">
                  <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                  <p class="text-gray-500 text-lg">No project ideas available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Job Market Insights -->
        <div *ngIf="guidanceData.jobMarket || guidanceData.job_market" class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 relative overflow-hidden transform hover:scale-[1.01] transition-all duration-300 animate-slide-up">
          <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-blue-500/5 rounded-3xl"></div>
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              Job Market Insights
            </h3>

            <!-- Market Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="text-center p-6 bg-white/80 rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-3">
                  {{ (guidanceData.jobMarket || guidanceData.job_market)?.averageSalaryUsd ||
                      (guidanceData.jobMarket || guidanceData.job_market)?.average_salary_usd || 'N/A' }}
                </div>
                <div class="text-sm text-gray-600 font-semibold">Average Salary (USD)</div>
              </div>
              <div class="text-center p-6 bg-white/80 rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-3">
                  {{ (guidanceData.jobMarket || guidanceData.job_market)?.jobDemandLevel ||
                      (guidanceData.jobMarket || guidanceData.job_market)?.job_demand_level || 'N/A' }}
                </div>
                <div class="text-sm text-gray-600 font-semibold">Job Demand Level</div>
              </div>
              <div class="text-center p-6 bg-white/80 rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-3">
                  {{ (guidanceData.jobMarket || guidanceData.job_market)?.growthProjection ||
                      (guidanceData.jobMarket || guidanceData.job_market)?.growth_projection || 'N/A' }}
                </div>
                <div class="text-sm text-gray-600 font-semibold">Growth Projection</div>
              </div>
              <div class="text-center p-6 bg-white/80 rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-3">
                  {{ ((guidanceData.jobMarket || guidanceData.job_market)?.topCountriesHiring ||
                      (guidanceData.jobMarket || guidanceData.job_market)?.top_countries_hiring)?.length || 0 }}
                </div>
                <div class="text-sm text-gray-600 font-semibold">Top Markets</div>
              </div>
            </div>

            <!-- Market Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div *ngIf="((guidanceData.jobMarket || guidanceData.job_market)?.topCountriesHiring ||
                          (guidanceData.jobMarket || guidanceData.job_market)?.top_countries_hiring)?.length"
                   class="bg-white/80 rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h4 class="font-bold text-gray-900 mb-6 flex items-center text-lg">
                  <svg class="w-6 h-6 mr-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Top Hiring Countries
                </h4>
                <div class="flex flex-wrap gap-3">
                  <span *ngFor="let country of ((guidanceData.jobMarket || guidanceData.job_market)?.topCountriesHiring ||
                                                (guidanceData.jobMarket || guidanceData.job_market)?.top_countries_hiring || []); let i = index"
                        class="px-4 py-2 bg-teal-100 text-teal-800 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-up"
                        [style.animation-delay]="i * 50 + 'ms'">
                    {{ country }}
                  </span>
                </div>
              </div>
              <div *ngIf="((guidanceData.jobMarket || guidanceData.job_market)?.topCompanies ||
                          (guidanceData.jobMarket || guidanceData.job_market)?.top_companies)?.length"
                   class="bg-white/80 rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h4 class="font-bold text-gray-900 mb-6 flex items-center text-lg">
                  <svg class="w-6 h-6 mr-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Top Companies
                </h4>
                <div class="flex flex-wrap gap-3">
                  <span *ngFor="let company of ((guidanceData.jobMarket || guidanceData.job_market)?.topCompanies ||
                                                (guidanceData.jobMarket || guidanceData.job_market)?.top_companies || []); let i = index"
                        class="px-4 py-2 bg-teal-100 text-teal-800 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-slide-up"
                        [style.animation-delay]="i * 50 + 'ms'">
                    {{ company }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
          <button
            (click)="goBack()"
            class="group relative px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 overflow-hidden"
          >
            <div class="flex items-center space-x-3 relative z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Back to Dashboard</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
          </button>
          <button
            (click)="deleteSession()"
            class="group relative px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 overflow-hidden"
          >
            <div class="flex items-center space-x-3 relative z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Delete Session</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
          </button>
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

    @keyframes slide-down {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
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
    .animate-slide-down { animation: slide-down 0.3s ease-out; }
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
export class CareerGuidanceDetailsComponent implements OnInit {
  sessionId = ""
  guidanceData: any = null
  isLoading = true
  error = ""
  showMobileMenu = false

  // Dashboard navbar properties
  activeTab: "dashboard" | "history" | "stats" = "dashboard"
  guidanceHistory: any[] = []
  currentUser: any = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    // Get current user
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.sessionId = params["id"]
      if (this.sessionId) {
        this.loadGuidanceDetails()
        this.loadGuidanceHistory() // Load history for navbar badge
      } else {
        this.error = "No session ID provided"
        this.isLoading = false
      }
    })
  }

  async loadGuidanceDetails(): Promise<void> {
    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      const response = await this.http
        .get<any>(`${environment.apiUrl}/career/history/${this.sessionId}`, { headers })
        .toPromise()

      if (response && response.status === "success") {
        this.guidanceData = response.guidance
      } else {
        throw new Error(response?.message || "Failed to load guidance details")
      }
    } catch (error: any) {
      console.error("Failed to load guidance details:", error)
      this.error = error.error?.error || error.message || "Failed to load guidance details"
    } finally {
      this.isLoading = false
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Navigation methods
  navigateToTab(tab: "dashboard" | "history" | "stats"): void {
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

  goBack(): void {
    this.router.navigate(["/ai-career-navigator/dashboard"])
  }

  async deleteSession(): Promise<void> {
    if (!confirm("Are you sure you want to delete this career guidance session? This action cannot be undone.")) {
      return
    }

    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      await this.http.delete(`${environment.apiUrl}/career/history/${this.sessionId}`, { headers }).toPromise()

      this.toastr.success("Career guidance session deleted successfully")
      this.router.navigate(["/ai-career-navigator/dashboard"])
    } catch (error) {
      console.error("Failed to delete session:", error)
      this.toastr.error("Failed to delete career guidance session")
    }
  }

  // Dashboard navbar methods
  async loadGuidanceHistory(): Promise<void> {
    try {
      const token = this.authService.getToken()
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      })

      const response = await this.http.get<any>(`${environment.apiUrl}/career/history`, { headers }).toPromise()

      if (response && response.status === "success") {
        this.guidanceHistory = response.history || []
      }
    } catch (error) {
      console.error("Failed to load guidance history:", error)
    }
  }

  getTabClasses(tab: string): string {
    if (this.activeTab === tab) {
      return "text-blue-600 bg-white/50 shadow-lg"
    }
    return "text-gray-600 hover:text-blue-600 hover:bg-white/50"
  }

  getMobileTabClasses(tab: string): string {
    if (this.activeTab === tab) {
      return "text-blue-600 bg-white/50 shadow-lg"
    }
    return "text-gray-600 hover:text-blue-600 hover:bg-white/50"
  }

  // Helper methods for roadmap styling (matching dashboard component)
  getEstimatedTime(index: number): string {
    const times = ["2-3 weeks", "1-2 months", "3-4 weeks", "2-3 months", "1-2 weeks", "4-6 weeks"]
    return times[index % times.length]
  }

  getDifficultyStars(index: number): boolean[] {
    const difficulties = [
      [true, false, false, false, false], // Easy
      [true, true, false, false, false],  // Medium-Easy
      [true, true, true, false, false],   // Medium
      [true, true, true, true, false],    // Medium-Hard
      [true, true, true, true, true],     // Hard
    ]
    const difficultyIndex = (index + 1) % 5
    return difficulties[difficultyIndex]
  }

  getDifficultyLevel(index: number): string {
    const levels = ["Easy", "Medium", "Medium", "Hard", "Expert"]
    return levels[index % levels.length]
  }

  logout(): void {
    this.authService.logout()
  }
}
