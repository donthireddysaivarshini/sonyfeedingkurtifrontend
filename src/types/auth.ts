/**
 * SONY COLLECTIONS - Authentication Types
 * 
 * Prepares the frontend for future Django REST Framework + Google OAuth integration.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface GoogleAuthPayload {
  token: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

