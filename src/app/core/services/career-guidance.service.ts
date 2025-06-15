import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  CareerGuidanceRequest,
  CareerGuidanceResponse,
  CareerGuidanceHistory
} from '../models/career-guidance.model';
import { ApiResponse, PaginatedResponse } from '../models/api.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareerGuidanceService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createGuidance(request: CareerGuidanceRequest): Observable<CareerGuidanceResponse> {
    return this.http.post<ApiResponse<CareerGuidanceResponse>>(`${this.API_URL}/career/guidance`, request)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to create career guidance');
        }),
        catchError(this.handleError)
      );
  }

  getGuidanceById(id: string): Observable<CareerGuidanceResponse> {
    return this.http.get<ApiResponse<CareerGuidanceResponse>>(`${this.API_URL}/career/guidance/${id}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to get career guidance');
        }),
        catchError(this.handleError)
      );
  }

  getGuidanceHistory(page: number = 1, limit: number = 10): Observable<PaginatedResponse<CareerGuidanceHistory>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<CareerGuidanceHistory>>>(`${this.API_URL}/career/history`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to get guidance history');
        }),
        catchError(this.handleError)
      );
  }

  deleteGuidance(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/career/guidance/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete guidance');
          }
        }),
        catchError(this.handleError)
      );
  }

  exportGuidance(id: string, format: 'pdf' | 'json' = 'pdf'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    
    return this.http.get(`${this.API_URL}/career/guidance/${id}/export`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  searchGuidanceHistory(query: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<CareerGuidanceHistory>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<CareerGuidanceHistory>>>(`${this.API_URL}/career/search`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to search guidance history');
        }),
        catchError(this.handleError)
      );
  }

  getCareerStatistics(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/career/stats`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to get career statistics');
        }),
        catchError(this.handleError)
      );
  }

  // Utility methods for form data
  getInterestOptions(): string[] {
    return [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'Artificial Intelligence',
      'Cybersecurity',
      'Cloud Computing',
      'DevOps',
      'UI/UX Design',
      'Product Management',
      'Digital Marketing',
      'Business Analysis',
      'Project Management',
      'Quality Assurance',
      'Database Administration',
      'Network Administration',
      'Game Development',
      'Blockchain',
      'IoT Development',
      'Robotics'
    ];
  }

  getDesiredFieldOptions(): string[] {
    return [
      'Software Engineering',
      'Data Science & Analytics',
      'Cybersecurity',
      'Cloud & Infrastructure',
      'AI & Machine Learning',
      'Product Management',
      'UI/UX Design',
      'Digital Marketing',
      'Business Intelligence',
      'Quality Assurance',
      'DevOps & Site Reliability',
      'Mobile Development',
      'Game Development',
      'Blockchain & Web3',
      'IoT & Embedded Systems',
      'Consulting',
      'Technical Writing',
      'Sales Engineering',
      'Research & Development',
      'Entrepreneurship'
    ];
  }

  getSoftSkillOptions(): string[] {
    return [
      'Communication',
      'Leadership',
      'Problem Solving',
      'Critical Thinking',
      'Teamwork',
      'Adaptability',
      'Time Management',
      'Creativity',
      'Emotional Intelligence',
      'Conflict Resolution',
      'Presentation Skills',
      'Negotiation',
      'Decision Making',
      'Analytical Thinking',
      'Customer Service',
      'Mentoring',
      'Project Management',
      'Strategic Planning',
      'Innovation',
      'Cultural Awareness'
    ];
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid request data';
          break;
        case 401:
          errorMessage = 'Authentication required';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  };
}
