import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="header-toolbar bg-white shadow-sm border-b border-gray-200">
      <div class="container-custom flex items-center justify-between w-full">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-4">
          <a routerLink="/" class="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <mat-icon class="text-2xl">psychology</mat-icon>
            <span class="text-xl font-bold hidden sm:block">AI Career Navigator</span>
          </a>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden md:flex items-center space-x-6" *ngIf="currentUser">
          <a routerLink="/dashboard" 
             routerLinkActive="text-primary-600 border-b-2 border-primary-600"
             class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
            Dashboard
          </a>
          <a routerLink="/career-guidance" 
             routerLinkActive="text-primary-600 border-b-2 border-primary-600"
             class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
            Career Guidance
          </a>
          <a routerLink="/history" 
             routerLinkActive="text-primary-600 border-b-2 border-primary-600"
             class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
            History
          </a>
        </nav>

        <!-- User Menu or Auth Buttons -->
        <div class="flex items-center space-x-4">
          <!-- Authenticated User Menu -->
          <div *ngIf="currentUser" class="flex items-center space-x-4">
            <!-- Notifications -->
            <button mat-icon-button [matBadge]="notificationCount" matBadgeColor="accent" 
                    [matBadgeHidden]="notificationCount === 0"
                    class="text-gray-600 hover:text-primary-600">
              <mat-icon>notifications</mat-icon>
            </button>

            <!-- User Profile Menu -->
            <button mat-button [matMenuTriggerFor]="userMenu" 
                    class="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {{ getUserInitials() }}
              </div>
              <span class="hidden sm:block">{{ currentUser.firstName }}</span>
              <mat-icon class="text-sm">keyboard_arrow_down</mat-icon>
            </button>

            <mat-menu #userMenu="matMenu" class="mt-2">
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item routerLink="/settings">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>

          <!-- Guest User Buttons -->
          <div *ngIf="!currentUser" class="flex items-center space-x-3">
            <a routerLink="/login" 
               class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Login
            </a>
            <a routerLink="/register" 
               class="btn-primary text-sm">
              Get Started
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button mat-icon-button 
                  class="md:hidden text-gray-600 hover:text-primary-600"
                  (click)="toggleMobileMenu()">
            <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div *ngIf="isMobileMenuOpen && currentUser" 
           class="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <nav class="container-custom py-4 space-y-2">
          <a routerLink="/dashboard" 
             (click)="closeMobileMenu()"
             class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
            Dashboard
          </a>
          <a routerLink="/career-guidance" 
             (click)="closeMobileMenu()"
             class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
            Career Guidance
          </a>
          <a routerLink="/history" 
             (click)="closeMobileMenu()"
             class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
            History
          </a>
          <hr class="my-2">
          <a routerLink="/profile" 
             (click)="closeMobileMenu()"
             class="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
            Profile
          </a>
          <button (click)="logout()" 
                  class="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
            Logout
          </button>
        </nav>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 64px;
    }

    .mat-toolbar {
      padding: 0;
    }

    .router-link-active {
      color: var(--primary-color) !important;
    }

    @media (max-width: 768px) {
      .header-toolbar {
        height: 56px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  notificationCount = 0;
  isMobileMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // TODO: Subscribe to notification service for real-time count
    // this.notificationService.getUnreadCount()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(count => this.notificationCount = count);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstInitial = this.currentUser.firstName?.charAt(0) || '';
    const lastInitial = this.currentUser.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
