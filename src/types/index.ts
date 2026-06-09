export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'employer';
  created_at?: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  status: 'open' | 'closed';
  created_at: string;
  employer?: {
    name: string;
  };
}

export interface JobFormData {
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
}

export interface JobFilters {
  search: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
}

export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected';

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  created_at: string;
  job?: {
    id: string;
    title: string;
    location: string;
    employer?: {
      name: string;
    };
  };
  candidate?: {
    id: string;
    name: string;
    email: string;
  };
}
