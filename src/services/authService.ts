/**
 * SONY COLLECTIONS - Authentication Service
 * 
 * Provides typed contract boundaries for customer authentication, Google OAuth token exchange,
 * and profile management.
 * In Phase 3, this interfaces with sessionStorage and React AuthContext.
 * In Stage 5, this will make REST calls to Django endpoints:
 * - POST /api/auth/google/
 * - GET /api/auth/me/
 * - PUT /api/auth/profile/
 * - GET /api/customers/addresses/
 * - POST /api/customers/addresses/
 */

import { UserProfile, GoogleAuthPayload } from '../types/auth';
import { DeliveryAddress } from '../types/order';

const AUTH_STORAGE_KEY = 'sony_feeding_kurtis_auth_user';
const ADDRESS_STORAGE_KEY = 'sony_feeding_kurtis_saved_address';

export const authService = {
  /**
   * Google OAuth token exchange (Stage 5 Target)
   */
  async exchangeGoogleToken(_payload: GoogleAuthPayload): Promise<{ user: UserProfile | null; error?: string }> {
    // When Django is connected:
    // return axios.post('/api/auth/google/', payload);
    return {
      user: null,
      error: 'Backend Google OAuth token exchange requires Django client credentials.',
    };
  },

  /**
   * Get current authenticated user profile
   */
  getCurrentUser(): UserProfile | null {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Update profile details
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const current = this.getCurrentUser();
      if (!current) return null;
      const updated: UserProfile = { ...current, ...updates };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return null;
    }
  },

  /**
   * Get saved delivery address
   */
  getSavedAddress(): DeliveryAddress | null {
    try {
      const raw = sessionStorage.getItem(ADDRESS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save or update delivery address
   */
  saveAddress(address: DeliveryAddress): boolean {
    try {
      sessionStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Remove saved address
   */
  removeAddress(): boolean {
    try {
      sessionStorage.removeItem(ADDRESS_STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * End session
   */
  logout(): void {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // storage unavailable
    }
  },
};
