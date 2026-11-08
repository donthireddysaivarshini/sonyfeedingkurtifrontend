import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  returnUrl: string | null;
  openAuthModal: (callback?: () => void, returnPath?: string) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  devLogin: (customProfile?: Partial<UserProfile>) => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  logout: () => void;
  setReturnUrl: (url: string | null) => void;
}

const AUTH_STORAGE_KEY = 'sony_feeding_kurtis_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load session from storage if previously authenticated in demo session
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState<(() => void) | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // storage unavailable
    }
  }, [user]);

  const openAuthModal = (callback?: () => void, returnPath?: string) => {
    if (callback) {
      setPostAuthCallback(() => callback);
    } else {
      setPostAuthCallback(null);
    }
    if (returnPath) {
      setReturnUrl(returnPath);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostAuthCallback(null);
  };

  /**
   * Google OAuth Entrypoint (Stage 5 Integration Target)
   * 
   * When Django backend is connected, this redirects to:
   * GET /api/auth/google/ -> Google Accounts -> /api/auth/google/callback/
   */
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    // In current frontend-only phase, return clean status without fabricating fake OAuth tokens
    return {
      success: false,
      message: 'Google OAuth token exchange requires Django backend with client ID and secret configured. Backend integration scheduled for Stage 5.',
    };
  };

  /**
   * Development Mode Authentication for Interface Review & Testing
   * 
   * Transparently signs in with a sample customer profile so reviewers
   * can test the checkout, address forms, and account dashboards without fake OAuth.
   */
  const devLogin = (customProfile?: Partial<UserProfile>) => {
    // Restricted strictly to development builds only
    if (!import.meta.env.DEV) {
      console.warn('devLogin is restricted to development builds only.');
      return;
    }

    const sampleUser: UserProfile = {
      id: 'cust-demo-01',
      name: customProfile?.name || 'Pooja Sharma',
      email: customProfile?.email || 'pooja.sharma@example.com',
      phone: customProfile?.phone || '9876543210',
      createdAt: '2026-11-01',
    };

    setUser(sampleUser);
    setIsAuthModalOpen(false);

    if (postAuthCallback) {
      setTimeout(() => {
        postAuthCallback();
        setPostAuthCallback(null);
      }, 150);
    }
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        returnUrl,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        devLogin,
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
