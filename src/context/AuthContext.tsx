import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (callback?: () => void) => void;
  closeAuthModal: () => void;
  proceedToReviewCheckout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure unauthenticated state by default — no fake Google credentials
  const [user] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState<(() => void) | null>(null);

  const openAuthModal = (callback?: () => void) => {
    if (callback) {
      setPostAuthCallback(() => callback);
    } else {
      setPostAuthCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostAuthCallback(null);
  };

  // Phase 1 testing action: explicitly labeled as Review Mode so testing can proceed without claiming real OAuth
  const proceedToReviewCheckout = () => {
    setIsAuthModalOpen(false);
    if (postAuthCallback) {
      setTimeout(() => {
        postAuthCallback();
        setPostAuthCallback(null);
      }, 200);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: false, // Honestly unauthenticated in Phase 1
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        proceedToReviewCheckout,
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
