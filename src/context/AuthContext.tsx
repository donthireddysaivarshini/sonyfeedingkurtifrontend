import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/auth';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authLoading: boolean;
  returnUrl: string | null;
  openAuthModal: (callback?: () => void, returnPath?: string) => void;
  closeAuthModal: () => void;
  loginWithGoogle: (credentialOrCode: string, isCode?: boolean) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  updateUser: (updated: Partial<UserProfile>) => void;
  logout: () => void;
  setReturnUrl: (url: string | null) => void;
  // Backward compatibility stub (deprecated)
  devLogin?: (customProfile?: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => tokenStorage.getUser());
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState<(() => void) | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  // Synchronize profile on initial mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getAccess();
      if (token) {
        try {
          const profile = await authService.fetchProfile();
          setUser(profile);
        } catch {
          // Token expired or invalid, keep existing user or clear
          const localUser = tokenStorage.getUser();
          setUser(localUser);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    };

    initAuth();

    const handleSessionExpired = () => {
      setUser(null);
      tokenStorage.clear();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  const openAuthModal = useCallback((callback?: () => void, returnPath?: string) => {
    if (callback) {
      setPostAuthCallback(() => callback);
    } else {
      setPostAuthCallback(null);
    }
    if (returnPath) {
      setReturnUrl(returnPath);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPostAuthCallback(null);
  }, []);

  const executePostAuth = useCallback(() => {
    setIsAuthModalOpen(false);
    if (postAuthCallback) {
      setTimeout(() => {
        postAuthCallback();
        setPostAuthCallback(null);
      }, 100);
    }
  }, [postAuthCallback]);

function extractAuthErrorMessage(err: any, defaultMsg: string): string {
  if (typeof err === 'string') return err;
  if (err?.error) return String(err.error);
  if (err?.detail) return String(err.detail);
  if (err?.response?.data?.error) return String(err.response.data.error);
  if (err?.response?.data?.detail) return String(err.response.data.detail);
  if (err?.email) return Array.isArray(err.email) ? String(err.email[0]) : String(err.email);
  if (err?.password) return Array.isArray(err.password) ? String(err.password[0]) : String(err.password);
  if (err?.non_field_errors) return Array.isArray(err.non_field_errors) ? String(err.non_field_errors[0]) : String(err.non_field_errors);
  if (err?.message && !err.message.includes('status code')) return String(err.message);
  return defaultMsg;
}

  /**
   * Google OAuth login
   */
  const loginWithGoogle = async (
    credentialOrCode: string,
    isCode: boolean = false
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const payload = isCode ? { code: credentialOrCode } : { id_token: credentialOrCode };
      const profile = await authService.googleLogin(payload);
      setUser(profile);
      executePostAuth();
      return { success: true };
    } catch (err: any) {
      const msg = extractAuthErrorMessage(err, 'Google sign-in could not be completed. Please try again.');
      return { success: false, message: msg };
    }
  };

  /**
   * Email & Password login
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const profile = await authService.login(email, password);
      setUser(profile);
      executePostAuth();
      return { success: true };
    } catch (err: any) {
      const msg = extractAuthErrorMessage(err, 'Invalid email or password. Please try again.');
      return { success: false, message: msg };
    }
  };

  /**
   * Customer registration
   */
  const signup = async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const profile = await authService.signup(data);
      setUser(profile);
      executePostAuth();
      return { success: true };
    } catch (err: any) {
      const msg = extractAuthErrorMessage(err, 'Registration failed. Please verify your details.');
      return { success: false, message: msg };
    }
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        authLoading,
        returnUrl,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        login,
        signup,
        updateUser,
        logout,
        setReturnUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { UserProfile };
