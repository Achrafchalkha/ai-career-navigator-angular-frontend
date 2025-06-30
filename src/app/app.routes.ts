import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'ai-career-navigator',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
      },
      {
        path: 'history',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard],
        data: { activeTab: 'history' }
      },
      {
        path: 'statistics',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard],
        data: { activeTab: 'stats' }
      },
      {
        path: 'career-guidance/:id',
        loadComponent: () => import('./features/career-guidance-details/career-guidance-details.component').then(m => m.CareerGuidanceDetailsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'career-guidance/history/:id',
        loadComponent: () => import('./features/career-guidance-details/career-guidance-details.component').then(m => m.CareerGuidanceDetailsComponent),
        canActivate: [authGuard],
        data: { activeTab: 'history' }
      }
    ]
  },
  // Legacy routes for backward compatibility
  {
    path: 'login',
    redirectTo: 'ai-career-navigator/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: 'ai-career-navigator/register',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    redirectTo: 'ai-career-navigator/dashboard',
    pathMatch: 'full'
  }
];
