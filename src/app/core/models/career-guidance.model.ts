export interface CareerGuidanceRequest {
  personalInfo: PersonalInfo;
  experienceLevel: ExperienceLevel;
  interests: string[];
  desiredField: string;
  softSkills: string[];
  additionalNotes?: string;
}

export interface PersonalInfo {
  age: number;
  educationLevel: EducationLevel;
  currentRole?: string;
  yearsOfExperience?: number;
}

export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum EducationLevel {
  HIGH_SCHOOL = 'High School',
  BACHELOR = 'Bachelor\'s Degree',
  MASTER = 'Master\'s Degree',
  PHD = 'PhD',
  BOOTCAMP = 'Bootcamp/Certification',
  SELF_TAUGHT = 'Self-taught'
}

export interface CareerGuidanceResponse {
  id: string;
  userId: string;
  request: CareerGuidanceRequest;
  recommendations: CareerRecommendation[];
  learningRoadmap: LearningRoadmap;
  jobMarketInsights: JobMarketInsights;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  averageSalary?: SalaryRange;
  growthProspects: 'Low' | 'Medium' | 'High';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface LearningRoadmap {
  phases: LearningPhase[];
  estimatedDuration: string;
  totalCost?: number;
}

export interface LearningPhase {
  title: string;
  description: string;
  duration: string;
  resources: LearningResource[];
  skills: string[];
  order: number;
}

export interface LearningResource {
  title: string;
  type: 'Course' | 'Book' | 'Tutorial' | 'Project' | 'Certification';
  url?: string;
  cost?: number;
  duration?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface JobMarketInsights {
  demandLevel: 'Low' | 'Medium' | 'High';
  averageSalary: SalaryRange;
  topCompanies: string[];
  requiredSkills: SkillDemand[];
  growthRate: number;
  jobOpenings: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface SkillDemand {
  skill: string;
  demandLevel: number; // 1-10 scale
  averageSalaryImpact: number; // percentage
}

export interface CareerGuidanceHistory {
  id: string;
  title: string;
  createdAt: Date;
  summary: string;
  status: 'Completed' | 'In Progress' | 'Archived';
}
