import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Career Navigator
              </h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <a routerLink="/ai-career-navigator/login"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Sign In
            </a>
            <a routerLink="/ai-career-navigator/register"
               class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0), radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 0); background-size: 100px 100px;"></div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
      <div class="absolute top-40 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-20 left-20 w-12 h-12 bg-indigo-400 rounded-full opacity-20 animate-pulse" style="animation-delay: 2s;"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Your AI-Powered
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
              Career Navigator
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover your perfect career path with personalized AI recommendations,
            comprehensive learning roadmaps, and real-time industry insights.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a routerLink="/ai-career-navigator/register"
               class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <span class="relative z-10">Start Your Journey</span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a routerLink="/ai-career-navigator/login"
               class="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
              Sign In
            </a>
          </div>

          <!-- Demo Card -->
          <div class="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div class="text-left">
                <h3 class="text-lg font-semibold text-gray-800">AI Career Analysis</h3>
                <p class="text-gray-600 text-sm">Intelligent matching in progress...</p>
              </div>
            </div>
            <div class="bg-gray-100 rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">Software Engineer</span>
                <span class="text-sm font-bold text-blue-600">95% Match</span>
              </div>
              <div class="w-full bg-gray-300 rounded-full h-2">
                <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style="width: 95%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powered by cutting-edge AI technology to provide personalized career guidance
            tailored to your unique profile and aspirations.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">AI-Powered Matching</h3>
            <p class="text-gray-600 leading-relaxed text-center">
              Advanced algorithms analyze your skills, interests, and experience to suggest
              the perfect career paths tailored just for you.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">Learning Roadmaps</h3>
            <p class="text-gray-600 leading-relaxed text-center">
              Get step-by-step learning paths with curated resources, courses, and
              milestones to achieve your career goals efficiently.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">Market Insights</h3>
            <p class="text-gray-600 leading-relaxed text-center">
              Stay ahead with real-time data on salary trends, job demand,
              and emerging skills in your industry.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get personalized career guidance in three simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Connection Lines -->
          <div class="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2"></div>
          <div class="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-green-300 transform -translate-y-1/2"></div>

          <!-- Step 1 -->
          <div class="text-center relative">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg relative z-10">
              1
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Create Your Profile</h3>
            <p class="text-gray-600 leading-relaxed">
              Share your background, skills, interests, and career aspirations with our intelligent system.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center relative">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg relative z-10">
              2
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">AI Analysis</h3>
            <p class="text-gray-600 leading-relaxed">
              Our advanced AI analyzes your profile and matches you with the most suitable career paths.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center relative">
            <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg relative z-10">
              3
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Get Your Roadmap</h3>
            <p class="text-gray-600 leading-relaxed">
              Receive personalized recommendations and actionable learning roadmaps to achieve your goals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="group">
            <div class="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">10K+</div>
            <div class="text-blue-100 font-medium">Users Helped</div>
          </div>
          <div class="group">
            <div class="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">95%</div>
            <div class="text-purple-100 font-medium">Success Rate</div>
          </div>
          <div class="group">
            <div class="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
            <div class="text-indigo-100 font-medium">Career Paths</div>
          </div>
          <div class="group">
            <div class="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div class="text-blue-100 font-medium">AI Support</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-12 border border-gray-100 shadow-xl">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career?</span>
          </h2>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have discovered their ideal career path
            with AI Career Navigator. Start your journey today!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/ai-career-navigator/register"
               class="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              <span class="relative z-10">Start Your Journey Today</span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a routerLink="/ai-career-navigator/login"
               class="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-white">
              Already have an account?
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Career Navigator
          </h3>
          <p class="text-gray-400 mb-6">
            Empowering careers through intelligent guidance
          </p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-800">
            <p class="text-gray-400 text-sm">
              © 2025 AI Career Navigator. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% {
        opacity: 0.2;
      }
      50% {
        opacity: 0.4;
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Custom backdrop blur for better browser support */
    .backdrop-blur-md {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    /* Gradient text fallback */
    .bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
    }

    /* Enhanced hover effects */
    .group:hover .group-hover\\:scale-110 {
      transform: scale(1.1);
    }

    /* Custom shadow for cards */
    .shadow-xl {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  `]
})
export class LandingComponent {}
