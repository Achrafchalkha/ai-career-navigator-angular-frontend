export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthError {
  error: string;
}

export interface UserProfile extends User {
  preferences?: UserPreferences;
  statistics?: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface UserStatistics {
  totalGuidanceSessions: number;
  lastSessionDate?: Date;
  completedAssessments: number;
}
