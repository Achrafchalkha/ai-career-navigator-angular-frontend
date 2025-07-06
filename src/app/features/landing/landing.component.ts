import { Component, type OnInit, type OnDestroy, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { trigger, state, style, transition, animate, keyframes, query, stagger, group } from "@angular/animations"

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger("fadeInUp", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(60px)" }),
        animate("0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
    trigger("slideInLeft", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(-100px)" }),
        animate("0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ opacity: 1, transform: "translateX(0)" })),
      ]),
    ]),
    trigger("scaleIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.8)" }),
        animate("0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", style({ opacity: 1, transform: "scale(1)" })),
      ]),
    ]),
    trigger("staggerCards", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(80px) scale(0.9)" }),
            stagger(200, [
              animate(
                "0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                style({ opacity: 1, transform: "translateY(0) scale(1)" }),
              ),
            ]),
          ],
          { optional: true },
        ),
      ]),
    ]),
    trigger("floatingOrb", [
      transition("* => *", [
        animate(
          "12s ease-in-out",
          keyframes([
            style({ transform: "translate(0, 0) scale(1) rotate(0deg)", offset: 0 }),
            style({ transform: "translate(150px, 80px) scale(1.3) rotate(180deg)", offset: 0.33 }),
            style({ transform: "translate(-100px, 120px) scale(0.8) rotate(270deg)", offset: 0.66 }),
            style({ transform: "translate(0, 0) scale(1) rotate(360deg)", offset: 1 }),
          ]),
        ),
      ]),
    ]),
    trigger("heroAnimation", [
      transition(":enter", [
        group([
          query(".hero-title", [
            style({ opacity: 0, transform: "translateY(100px)" }),
            animate("1s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ opacity: 1, transform: "translateY(0)" })),
          ]),
          query(".hero-subtitle", [
            style({ opacity: 0, transform: "translateY(60px)" }),
            animate("1s 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ opacity: 1, transform: "translateY(0)" })),
          ]),
          query(".hero-buttons", [
            style({ opacity: 0, transform: "translateY(40px)" }),
            animate("1s 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)", style({ opacity: 1, transform: "translateY(0)" })),
          ]),
        ]),
      ]),
    ]),
    trigger("cardHover", [
      state("normal", style({ transform: "translateY(0) scale(1)" })),
      state("hovered", style({ transform: "translateY(-20px) scale(1.05)" })),
      transition("normal <=> hovered", animate("0.3s cubic-bezier(0.34, 1.56, 0.64, 1)")),
    ]),
    trigger("testimonialSlide", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100px) rotateY(90deg)" }),
        animate(
          "0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          style({ opacity: 1, transform: "translateX(0) rotateY(0deg)" }),
        ),
      ]),
    ]),
    trigger("scrollingTestimonials", [
      transition("* => *", [
        animate(
          "30s linear",
          keyframes([
            style({ transform: "translateX(0%)", offset: 0 }),
            style({ transform: "translateX(-100%)", offset: 1 }),
          ]),
        ),
      ]),
    ]),
  ],
  template: `
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-2xl z-50 border-b border-gray-200/30 shadow-xl shadow-blue-500/10" [@slideInLeft]>
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="flex justify-between items-center h-16">

          <!-- Navbar Brand -->
          <div class="flex items-center group">
            <h1 class="text-lg font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-500 relative py-2">
              AI Career Navigator
              <div class="absolute -inset-2 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
            </h1>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <div class="flex items-center space-x-6">
              <button (click)="scrollToSection('features')" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-50 relative group">
                Features
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button (click)="scrollToSection('how-it-works')" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-50 relative group">
                How It Works
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button (click)="scrollToSection('testimonials')" class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-50 relative group">
                Testimonials
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
            <div class="flex items-center space-x-6">
              <button (click)="navigateToLogin()"
                 class="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-transparent hover:border-blue-200">
                Sign In
              </button>
              <button (click)="navigateToRegister()"
                 class="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25">
                <span class="relative z-10 flex items-center">
                  Get Started
                  <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300" (click)="toggleMobileMenu()">
            <div class="w-6 h-6 relative">
              <span class="absolute top-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300" 
                    [class.rotate-45]="isMobileMenuOpen" [class.translate-y-2.5]="isMobileMenuOpen"></span>
              <span class="absolute top-2.5 left-0 w-full h-0.5 bg-current transition-all duration-300" 
                    [class.opacity-0]="isMobileMenuOpen"></span>
              <span class="absolute top-5 left-0 w-full h-0.5 bg-current transform transition-all duration-300" 
                    [class.-rotate-45]="isMobileMenuOpen" [class.-translate-y-2.5]="isMobileMenuOpen"></span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="md:hidden overflow-hidden transition-all duration-300" [class.max-h-96]="isMobileMenuOpen" [class.max-h-0]="!isMobileMenuOpen">
        <div class="bg-white/95 backdrop-blur-xl border-t border-gray-100/50 shadow-lg">
          <div class="px-6 py-6 space-y-4">
            <button (click)="scrollToSection('features'); toggleMobileMenu()" class="block w-full text-left text-gray-700 hover:text-blue-600 py-3 text-base font-medium transition-colors duration-300">Features</button>
            <button (click)="scrollToSection('how-it-works'); toggleMobileMenu()" class="block w-full text-left text-gray-700 hover:text-blue-600 py-3 text-base font-medium transition-colors duration-300">How It Works</button>
            <button (click)="scrollToSection('testimonials'); toggleMobileMenu()" class="block w-full text-left text-gray-700 hover:text-blue-600 py-3 text-base font-medium transition-colors duration-300">Testimonials</button>
            <div class="pt-4 border-t border-gray-200 space-y-3">
              <a routerLink="/ai-career-navigator/login"
                 class="block text-center text-gray-700 hover:text-blue-600 py-2 text-base font-medium transition-colors duration-300">
                Sign In
              </a>
              <a routerLink="/ai-career-navigator/register"
                 class="block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50 pt-24 pb-20" [@heroAnimation]>
      <!-- Enhanced Animated Background -->
      <div class="absolute inset-0">
        <!-- Dynamic Gradient Mesh -->
        <div class="absolute inset-0 bg-gradient-mesh opacity-40"></div>
        
        <!-- Multiple Floating Orbs with Different Sizes -->
        <div class="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div class="absolute top-60 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-2xl animate-float-delayed"></div>
        <div class="absolute bottom-40 left-1/4 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-2xl animate-float-reverse"></div>
        <div class="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-r from-pink-400/25 to-rose-400/25 rounded-full blur-2xl animate-float-slow"></div>
        <div class="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        
        <!-- Enhanced Grid Pattern -->
        <div class="absolute inset-0 opacity-[0.03]">
          <div class="w-full h-full bg-grid-pattern animate-grid-move"></div>
        </div>
        
        <!-- Particle Effects -->
        <div class="absolute inset-0">
          <div *ngFor="let particle of particles" 
               class="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 animate-particle"
               [style.left.%]="particle.x"
               [style.top.%]="particle.y"
               [style.animation-delay.s]="particle.delay">
          </div>
        </div>
        
        <!-- Geometric Shapes -->
        <div class="absolute top-1/4 left-1/6 w-4 h-4 bg-blue-500/20 rotate-45 animate-pulse"></div>
        <div class="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500/20 rounded-full animate-bounce-slow"></div>
        <div class="absolute bottom-1/3 left-3/4 w-3 h-8 bg-gradient-to-b from-pink-500/20 to-transparent animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div class="text-center">
          <!-- Enhanced Hero Badge -->
          <div class="hero-title inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-indigo-50/90 backdrop-blur-lg rounded-full px-10 py-5 mb-6 border border-blue-200/60 shadow-xl hover:shadow-2xl transition-all duration-700 group cursor-pointer">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping opacity-30"></div>
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse opacity-40"></div>
              <svg class="w-7 h-7 text-yellow-500 relative z-10 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <span class="text-lg font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Powered by Advanced AI Technology
            </span>
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
              <div class="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
            </div>
          </div>

          <!-- Enhanced Main Title -->
          <h1 class="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-10 leading-tight tracking-tight">
            <span class="block text-gray-900 mb-6 drop-shadow-sm">Your AI-Powered</span>
            <span class="block bg-gradient-to-r from-blue-600 via-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-x bg-size-400 relative">
              Career Navigator
              <div class="absolute -inset-6 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 blur-3xl -z-10 animate-pulse"></div>
              <div class="absolute -inset-2 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 blur-xl -z-10 animate-pulse" style="animation-delay: 1s;"></div>
            </span>
          </h1>

          <!-- Enhanced Subtitle -->
          <p class="hero-subtitle text-2xl sm:text-3xl md:text-4xl text-gray-600 mb-16 max-w-6xl mx-auto leading-relaxed font-light">
            Discover your perfect career path with 
            <span class="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">personalized AI recommendations</span>,
            comprehensive learning roadmaps, and real-time industry insights that transform your professional journey.
          </p>

          <!-- Enhanced CTA Buttons -->
          <div class="hero-buttons flex flex-col sm:flex-row gap-8 justify-center items-center mb-24">
            <button (click)="navigateToRegister()"
               class="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 relative overflow-hidden">
              <span class="flex items-center relative z-10">
                <svg class="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Start Your Journey
                <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button (click)="navigateToLogin()"
               class="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-white/80 backdrop-blur-lg hover:bg-white/95 hover:shadow-xl flex items-center">
              <svg class="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-40 bg-gradient-to-br from-white via-blue-50/40 to-purple-50/40 relative overflow-hidden">
      
      <!-- Enhanced Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-slow"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float-reverse"></div>
        <!-- Geometric patterns -->
        <div class="absolute top-20 right-20 w-32 h-32 border border-blue-200/30 rounded-3xl rotate-12 animate-pulse"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 border border-purple-200/30 rounded-full animate-bounce-slow"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20" [@fadeInUp]="featuresVisible">
          <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-8 border border-blue-200/50">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span class="text-sm font-semibold text-blue-700">Powerful Features</span>
          </div>
          
          <h2 class="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-10 leading-tight relative">
            Why Choose Our
            <span class="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI Platform?
            </span>
            <div class="absolute -inset-4 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5 blur-2xl rounded-3xl"></div>
          </h2>
          <div class="w-full flex justify-center">
            <p class="text-xl md:text-2xl text-gray-600 max-w-4xl leading-relaxed text-center">
              Powered by cutting-edge AI technology to provide personalized career guidance
              tailored to your unique profile and aspirations.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12" [@staggerCards]="featuresVisible">
          <div *ngFor="let feature of features; let i = index"
               class="group relative bg-white/80 backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 overflow-hidden"
               [@cardHover]="feature.hovered ? 'hovered' : 'normal'"
               (mouseenter)="feature.hovered = true"
               (mouseleave)="feature.hovered = false">
            
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-br {{feature.bgGradient}} opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Icon -->
            <div class="relative z-10 w-20 h-20 bg-gradient-to-r {{feature.gradient}} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
              <ng-container [ngSwitch]="feature.icon">
                <svg *ngSwitchCase="'zap'" class="w-10 h-10 text-white transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <svg *ngSwitchCase="'book'" class="w-10 h-10 text-white transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <svg *ngSwitchCase="'chart'" class="w-10 h-10 text-white transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 002 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </ng-container>
            </div>
            
            <!-- Content -->
            <div class="relative z-10 text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors duration-300">{{feature.title}}</h3>
              <p class="text-gray-600 leading-relaxed text-lg group-hover:text-white/90 transition-colors duration-300">{{feature.description}}</p>
            </div>
            
            <!-- Hover Effects -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-r {{feature.gradient}} opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r {{feature.gradient}} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-40 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-purple-50/60 relative overflow-hidden">
      
      <!-- Enhanced Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/12 to-purple-400/12 rounded-full blur-3xl animate-float-slow"></div>
        <div class="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-r from-purple-400/12 to-pink-400/12 rounded-full blur-3xl animate-float-delayed"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-indigo-400/8 to-emerald-400/8 rounded-full blur-3xl animate-float-reverse"></div>
        <!-- Modern geometric elements -->
        <div class="absolute top-10 right-1/4 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl rotate-45 animate-pulse"></div>
        <div class="absolute bottom-10 left-1/4 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full animate-bounce-slow"></div>
        <div class="absolute top-1/3 right-10 w-12 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20" [@fadeInUp]="howItWorksVisible">
          <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-8 border border-purple-200/50">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span class="text-sm font-semibold text-purple-700">Simple Process</span>
          </div>
          
          <h2 class="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-10 leading-tight relative">
            How It
            <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <div class="w-full flex justify-center">
            <p class="text-xl md:text-2xl text-gray-600 max-w-4xl leading-relaxed text-center">
              Get personalized career guidance in three simple steps
            </p>
          </div>
        </div>

        <div class="relative">
          <!-- Connection Lines -->
          <div class="hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transform -translate-y-1/2 rounded-full">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          </div>
          <div class="hidden lg:block absolute top-1/2 right-1/3 w-1/3 h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 transform -translate-y-1/2 rounded-full">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div *ngFor="let step of steps; let i = index"
                 class="text-center relative group" [@fadeInUp]="howItWorksVisible">
            
              <!-- Modern Icon Instead of Number -->
              <div class="relative mx-auto mb-8">
                <div class="w-20 h-20 bg-gradient-to-r {{step.gradient}} rounded-3xl flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                  <ng-container [ngSwitch]="i">
                    <!-- Profile Creation Icon -->
                    <svg *ngSwitchCase="0" class="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <!-- AI Analysis Icon -->
                    <svg *ngSwitchCase="1" class="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    <!-- Roadmap Icon -->
                    <svg *ngSwitchCase="2" class="w-10 h-10 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                  </ng-container>
                  <div class="absolute inset-0 bg-white/20 rounded-3xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                </div>
                <div class="absolute -inset-6 bg-gradient-to-r {{step.gradient}} rounded-3xl opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <!-- Floating Elements -->
                <div class="absolute -top-2 -right-2 w-4 h-4 bg-white/80 rounded-full animate-bounce-slow"></div>
                <div class="absolute -bottom-2 -left-2 w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
              </div>
              
              <!-- Content -->
              <div class="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-xl group-hover:shadow-3xl transition-all duration-700 transform group-hover:-translate-y-4 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br {{step.bgGradient}} opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative z-10">
                  <h3 class="text-3xl font-black text-gray-900 mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:{{step.gradient}} group-hover:bg-clip-text transition-all duration-300 leading-tight">
                    {{step.title}}
                  </h3>
                  <p class="text-gray-600 leading-relaxed text-xl font-medium">{{step.description}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-indigo-600/50"></div>
        <div class="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16" [@fadeInUp]="statisticsVisible">
          <h2 class="text-4xl sm:text-5xl font-bold mb-6">
            Trusted by Professionals
            <span class="block text-white/80">Worldwide</span>
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8" [@staggerCards]="statisticsVisible">
          <div *ngFor="let stat of statistics; let i = index"
               class="group text-center bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div class="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r {{stat.textGradient}} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              {{stat.value}}
            </div>
            <div class="{{stat.textColor}} font-semibold text-lg group-hover:text-white transition-colors duration-300">{{stat.label}}</div>
            <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20" [@fadeInUp]="testimonialsVisible">
          <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3 mb-8 border border-yellow-200/50">
            <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span class="text-sm font-semibold text-yellow-700">Success Stories</span>
          </div>
          
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            What Our Users
            <span class="block bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>
          <div class="w-full flex justify-center">
            <p class="text-xl md:text-2xl text-gray-600 max-w-4xl leading-relaxed text-center">
              Join thousands of professionals who have transformed their careers with AI-powered guidance
            </p>
          </div>
        </div>

        <!-- Scrolling Testimonials Container -->
        <div class="relative overflow-hidden">
          <div class="flex space-x-8 animate-scroll-testimonials">
            <!-- First set of testimonials -->
            <div *ngFor="let testimonial of testimonials; let i = index"
                 class="flex-shrink-0 w-80 md:w-96 group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-gray-200/50 relative overflow-hidden">
              
              <!-- Background Gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Stars -->
              <div class="relative z-10 flex justify-center mb-6">
                <div class="flex space-x-1">
                  <svg *ngFor="let star of getStars(testimonial.rating)" 
                       class="w-6 h-6 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-300"
                       style="transition-delay: {{star * 100}}ms">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>

              <!-- Quote -->
              <div class="relative z-10 mb-8">
                <svg class="w-8 h-8 text-blue-500/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p class="text-gray-700 text-lg leading-relaxed italic group-hover:text-gray-900 transition-colors duration-300">
                  "{{testimonial.content}}"
                </p>
              </div>

              <!-- Author -->
              <div class="relative z-10 flex items-center space-x-4">
                <div class="relative">
                  <img [src]="testimonial.image" 
                       [alt]="testimonial.name"
                       class="w-16 h-16 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">

                </div>
                <div>
                  <h4 class="text-gray-900 font-bold text-lg">{{testimonial.name}}</h4>
                  <p class="text-blue-600 font-medium">{{testimonial.role}}</p>
                </div>
              </div>
            </div>
            
            <!-- Duplicate set for seamless loop -->
            <div *ngFor="let testimonial of testimonials; let i = index"
                 class="flex-shrink-0 w-80 md:w-96 group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-gray-200/50 relative overflow-hidden">
              
              <!-- Background Gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Stars -->
              <div class="relative z-10 flex justify-center mb-6">
                <div class="flex space-x-1">
                  <svg *ngFor="let star of getStars(testimonial.rating)" 
                       class="w-6 h-6 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-300"
                       style="transition-delay: {{star * 100}}ms">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>

              <!-- Quote -->
              <div class="relative z-10 mb-8">
                <svg class="w-8 h-8 text-blue-500/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p class="text-gray-700 text-lg leading-relaxed italic group-hover:text-gray-900 transition-colors duration-300">
                  "{{testimonial.content}}"
                </p>
              </div>

              <!-- Author -->
              <div class="relative z-10 flex items-center space-x-4">
                <div class="relative">
                  <img [src]="testimonial.image" 
                       [alt]="testimonial.name"
                       class="w-16 h-16 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">

                </div>
                <div>
                  <h4 class="text-gray-900 font-bold text-lg">{{testimonial.name}}</h4>
                  <p class="text-blue-600 font-medium">{{testimonial.role}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-xl rounded-3xl p-12 lg:p-16 border border-gray-200/50 shadow-2xl" [@fadeInUp]="ctaVisible">
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Ready to Transform Your
            <span class="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Career Journey?
            </span>
          </h2>
          <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have discovered their ideal career path
            with AI Career Navigator. Start your transformation today!
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button (click)="navigateToRegister()"
               class="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 relative overflow-hidden">
              <span class="flex items-center relative z-10">
                <svg class="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Start Your Journey Today
                <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button (click)="navigateToLogin()"
               class="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-xl">
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </section>

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
            <div class="mb-4">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AI Career Navigator
              </h3>
            </div>
            <p class="text-gray-300 leading-relaxed mb-4 max-w-md">
              Empowering professionals with AI-driven career guidance and personalized learning paths.
            </p>
          </div>

          <!-- Quick Links -->
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
              <span class="text-red-400">❤️</span>
              <span>by</span>
              <a href="#" class="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300">
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
    /* Custom Animations */
    @keyframes gradient-x {
      0%, 100% { background-size: 200% 200%; background-position: left center; }
      50% { background-size: 200% 200%; background-position: right center; }
    }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(-180deg); }
    }

    @keyframes float-reverse {
      0%, 100% { transform: translateY(-10px) rotate(0deg); }
      50% { transform: translateY(10px) rotate(180deg); }
    }

    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes scroll-indicator {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(12px); opacity: 0; }
    }

    @keyframes particle {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes grid-move {
      0% { background-position: 0px 0px; }
      100% { background-position: 50px 50px; }
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @keyframes scroll-testimonials {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* Animation Classes */
    .animate-gradient-x { animation: gradient-x 15s ease infinite; }
    .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
    .animate-float-reverse { animation: float-reverse 7s ease-in-out infinite 1s; }
    .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
    .animate-scroll-indicator { animation: scroll-indicator 2s ease-in-out infinite; }
    .animate-particle { animation: particle 10s linear infinite; }
    .animate-grid-move { animation: grid-move 20s linear infinite; }
    .animate-scroll-testimonials { animation: scroll-testimonials 30s linear infinite; }
    .heart-animation { animation: heartbeat 1.5s ease-in-out infinite; }

    /* Background Patterns */
    .bg-gradient-mesh {
      background-image: 
        radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px);
      background-size: 100px 100px;
    }

    .bg-grid-pattern {
      background-image: 
        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    /* Replace the problematic CSS class definition */
    .bg-size-300 { background-size: 300% 300%; }
    .bg-size-400 { background-size: 400% 400%; }
    .shadow-4xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.25); }
    .border-3 { border-width: 3px; }

    /* Smooth scrolling */
    html { scroll-behavior: smooth; }

    /* Custom backdrop blur */
    .backdrop-blur-xl {
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
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

    /* Custom shadows */
    .shadow-3xl {
      box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
    }

    /* Mobile menu transitions */
    .max-h-0 { max-height: 0; }
    .max-h-96 { max-height: 24rem; }

    /* Responsive text sizes */
    @media (max-width: 640px) {
      .text-8xl { font-size: 4rem; line-height: 1; }
      .text-7xl { font-size: 3.5rem; line-height: 1; }
      .text-6xl { font-size: 3rem; line-height: 1; }
    }

    /* Enhanced hover effects */
    .group:hover .group-hover\\:scale-110 {
      transform: scale(1.1);
    }

    .group:hover .group-hover\\:rotate-12 {
      transform: rotate(12deg);
    }

    .group:hover .group-hover\\:translate-x-2 {
      transform: translateX(0.5rem);
    }

    /* Focus states for accessibility */
    .focus-visible:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Print styles */
    @media print {
      .no-print { display: none !important; }
    }
  `,
  ],
})
export class LandingComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false

  // Animation states
  statsVisible = false
  featuresVisible = false
  howItWorksVisible = false
  statisticsVisible = false
  ctaVisible = false
  testimonialsVisible = false

  // Particle system
  particles: Array<{ x: number; y: number; delay: number }> = []



  features = [
    {
      icon: "zap",
      title: "AI-Powered Matching",
      description:
        "Advanced algorithms analyze your skills, interests, and experience to suggest the perfect career paths tailored just for you.",
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50/80 to-indigo-50/80",
      borderColor: "border-blue-100",
      hovered: false,
    },
    {
      icon: "book",
      title: "Learning Roadmaps",
      description:
        "Get step-by-step learning paths with curated resources, courses, and milestones to achieve your career goals efficiently.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50/80 to-pink-50/80",
      borderColor: "border-purple-100",
      hovered: false,
    },
    {
      icon: "chart",
      title: "Market Insights",
      description: "Stay ahead with real-time data on salary trends, job demand, and emerging skills in your industry.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50/80 to-emerald-50/80",
      borderColor: "border-green-100",
      hovered: false,
    },
  ]

  steps = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Share your background, skills, interests, and career aspirations with our intelligent system.",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50/80 to-blue-100/80",
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our advanced AI analyzes your profile and matches you with the most suitable career paths.",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50/80 to-purple-100/80",
    },
    {
      step: 3,
      title: "Get Your Roadmap",
      description: "Receive personalized recommendations and actionable learning roadmaps to achieve your goals.",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50/80 to-green-100/80",
    },
  ]

  statistics = [
    { value: "10K+", label: "Users Helped", textGradient: "from-white to-blue-100", textColor: "text-blue-100" },
    { value: "95%", label: "Success Rate", textGradient: "from-white to-purple-100", textColor: "text-purple-100" },
    { value: "500+", label: "Career Paths", textGradient: "from-white to-indigo-100", textColor: "text-indigo-100" },
    { value: "24/7", label: "AI Support", textGradient: "from-white to-blue-100", textColor: "text-blue-100" },
  ]

  testimonials = [
    {
      name: "Sacha Baron",
      role: "Software Engineer at Google",
      image: "assets/features/profiles pictures/Sacha.jpg", 
      content:
        "AI Career Navigator helped me transition from marketing to tech. The personalized roadmap was incredibly detailed and accurate!",
      rating: 5,
    },
    {
      name: "Fogell",
      role: "Data Scientist at Microsoft",
      image: "assets/features/profiles pictures/fogell.jpg",
      content:
        "The AI matching was spot-on. I discovered career paths I never knew existed and landed my dream job in 6 months.",
      rating: 5,
    },
    {
      name: "Gustaf Caspar",
      role: "UX Designer at Airbnb",
      image: "assets/features/profiles pictures/flooki.jpg",
      content:
        "The learning roadmap feature is game-changing. It saved me months of research and guided me step by step.",
      rating: 5,
    },
    {
      name: "Peter Dinklage",
      role: "Product Manager at Tesla",
      image: "assets/features/profiles pictures/peter.jpg",
      content:
        "The AI insights were incredibly accurate. I found my perfect role and increased my salary by 40% in just 4 months!",
      rating: 5,
    },
    {
      name: "Jorge Garcia",
      role: "Data Analyst at Netflix",
      image: "assets/features/profiles pictures/lghlid.jpg",
      content:
        "The platform's career guidance is unmatched. It helped me pivot from finance to tech seamlessly with a clear roadmap.",
      rating: 5,
    },
  ]

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('🏠 Landing Component Initialized');
    console.log('📍 Current URL:', this.router.url);
    console.log('🌐 Browser URL:', window.location.href);
    console.log('📚 History Length:', window.history.length);
    // Initialize particles
    this.generateParticles()

    // Trigger animations on load
    setTimeout(() => {
      this.statsVisible = true
      this.featuresVisible = true
      this.howItWorksVisible = true
      this.statisticsVisible = true
      this.ctaVisible = true
      this.testimonialsVisible = true
    }, 1000)
  }

  ngOnDestroy() {}

  generateParticles() {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
      })
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0)
  }

  // Debug navigation methods
  navigateToLogin() {
    console.log('🔐 Sign In button clicked');
    console.log('📍 Current URL before navigation:', this.router.url);
    console.log('🌐 Browser URL before navigation:', window.location.href);
    console.log('📚 History Length before navigation:', window.history.length);

    this.router.navigate(['/ai-career-navigator/login']).then(success => {
      console.log('✅ Navigation to login successful:', success);
      console.log('📍 URL after navigation:', this.router.url);
      console.log('🌐 Browser URL after navigation:', window.location.href);
      console.log('📚 History Length after navigation:', window.history.length);
    }).catch(error => {
      console.error('❌ Navigation to login failed:', error);
    });
  }

  navigateToRegister() {
    console.log('📝 Get Started button clicked');
    console.log('📍 Current URL before navigation:', this.router.url);
    console.log('🌐 Browser URL before navigation:', window.location.href);
    console.log('📚 History Length before navigation:', window.history.length);

    this.router.navigate(['/ai-career-navigator/register']).then(success => {
      console.log('✅ Navigation to register successful:', success);
      console.log('📍 URL after navigation:', this.router.url);
      console.log('🌐 Browser URL after navigation:', window.location.href);
      console.log('📚 History Length after navigation:', window.history.length);
    }).catch(error => {
      console.error('❌ Navigation to register failed:', error);
    });
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string) {
    console.log(`🎯 Scrolling to section: ${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      console.log(`✅ Scrolled to ${sectionId} section`);
    } else {
      console.warn(`⚠️ Section with ID '${sectionId}' not found`);
    }
  }

  @HostListener("window:scroll", ["$event"])
  onScroll() {
    const scrollPosition = window.pageYOffset
    const windowHeight = window.innerHeight

    // Trigger animations based on scroll position
    if (scrollPosition > windowHeight * 0.2) {
      this.featuresVisible = true
    }
    if (scrollPosition > windowHeight * 0.6) {
      this.howItWorksVisible = true
    }
    if (scrollPosition > windowHeight * 1.2) {
      this.statisticsVisible = true
    }
    if (scrollPosition > windowHeight * 1.6) {
      this.ctaVisible = true
    }
    if (scrollPosition > windowHeight * 2) {
      this.testimonialsVisible = true
    }
  }
}
