import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface NotificationOptions {
  title?: string;
  timeout?: number;
  enableHtml?: boolean;
  closeButton?: boolean;
  progressBar?: boolean;
  positionClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultOptions: NotificationOptions = {
    timeout: 5000,
    enableHtml: false,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right'
  };

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, options?: NotificationOptions): void {
    const config = { ...this.defaultOptions, ...options };
    this.toastr.success(message, config.title, {
      timeOut: config.timeout,
      enableHtml: config.enableHtml,
      closeButton: config.closeButton,
      progressBar: config.progressBar,
      positionClass: config.positionClass
    });
  }

  showError(message: string, options?: NotificationOptions): void {
    const config = { ...this.defaultOptions, ...options };
    this.toastr.error(message, config.title, {
      timeOut: config.timeout,
      enableHtml: config.enableHtml,
      closeButton: config.closeButton,
      progressBar: config.progressBar,
      positionClass: config.positionClass
    });
  }

  showWarning(message: string, options?: NotificationOptions): void {
    const config = { ...this.defaultOptions, ...options };
    this.toastr.warning(message, config.title, {
      timeOut: config.timeout,
      enableHtml: config.enableHtml,
      closeButton: config.closeButton,
      progressBar: config.progressBar,
      positionClass: config.positionClass
    });
  }

  showInfo(message: string, options?: NotificationOptions): void {
    const config = { ...this.defaultOptions, ...options };
    this.toastr.info(message, config.title, {
      timeOut: config.timeout,
      enableHtml: config.enableHtml,
      closeButton: config.closeButton,
      progressBar: config.progressBar,
      positionClass: config.positionClass
    });
  }

  clear(): void {
    this.toastr.clear();
  }

  // Convenience methods for common scenarios

  showRegistrationSuccess(): void {
    this.showSuccess('Account created successfully! Welcome to AI Career Navigator.');
  }

  showProfileUpdateSuccess(): void {
    this.showSuccess('Your profile has been updated successfully.');
  }

  showPasswordChangeSuccess(): void {
    this.showSuccess('Your password has been changed successfully.');
  }

  showGuidanceCreatedSuccess(): void {
    this.showSuccess('Career guidance has been generated successfully!');
  }

  showGuidanceDeletedSuccess(): void {
    this.showSuccess('Career guidance has been deleted successfully.');
  }

  showNetworkError(): void {
    this.showError('Network error. Please check your internet connection and try again.');
  }

  showValidationError(message: string): void {
    this.showError(message, { title: 'Validation Error' });
  }

  showServerError(): void {
    this.showError('Server error. Please try again later or contact support if the problem persists.');
  }
}
