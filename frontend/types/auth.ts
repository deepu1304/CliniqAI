export type UserRole = 'doctor' | 'nurse' | 'admin';

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;         
  tokenExpiry: number;  
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}