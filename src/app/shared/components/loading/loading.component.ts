import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';

import { LoadingService, LoadingState } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div *ngIf="loadingState.isLoading" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl max-w-sm mx-4">
        <!-- Spinner -->
        <mat-spinner diameter="40" strokeWidth="4" color="primary"></mat-spinner>
        
        <!-- Loading Message -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">
            {{ loadingState.message || 'Loading...' }}
          </h3>
          <p class="text-sm text-gray-600">
            Please wait while we process your request
          </p>
        </div>
        
        <!-- Progress Dots Animation -->
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
          <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
          <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    .animate-bounce {
      animation: bounce 1.4s infinite ease-in-out both;
    }

    /* Prevent body scroll when loading */
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    :host > div {
      pointer-events: auto;
    }
  `]
})
export class LoadingComponent implements OnInit, OnDestroy {
  loadingState: LoadingState = { isLoading: false };
  private destroy$ = new Subject<void>();

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.loadingState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
