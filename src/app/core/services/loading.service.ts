import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({ isLoading: false });
  private loadingCounter = 0;

  public loading$ = this.loadingSubject.asObservable();

  show(message?: string): void {
    this.loadingCounter++;
    this.loadingSubject.next({ isLoading: true, message });
  }

  hide(): void {
    this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    
    if (this.loadingCounter === 0) {
      this.loadingSubject.next({ isLoading: false });
    }
  }

  forceHide(): void {
    this.loadingCounter = 0;
    this.loadingSubject.next({ isLoading: false });
  }

  isLoading(): Observable<boolean> {
    return new Observable(observer => {
      this.loading$.subscribe(state => observer.next(state.isLoading));
    });
  }

  getCurrentState(): LoadingState {
    return this.loadingSubject.value;
  }

  // Convenience methods for common loading scenarios
  showAuthLoading(): void {
    this.show('Authenticating...');
  }

  showDataLoading(): void {
    this.show('Loading data...');
  }

  showSavingLoading(): void {
    this.show('Saving...');
  }

  showGuidanceLoading(): void {
    this.show('Generating career guidance...');
  }

  showUploadLoading(): void {
    this.show('Uploading file...');
  }

  showDeleteLoading(): void {
    this.show('Deleting...');
  }
}
