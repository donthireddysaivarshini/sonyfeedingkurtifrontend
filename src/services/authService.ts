/**
 * SONY COLLECTIONS - Authentication & Account Service
 * 
 * Production-ready service connecting directly to Django REST Framework:
 * - POST /api/auth/google/
 * - POST /api/auth/login/
 * - POST /api/auth/signup/
 * - GET/PUT /api/auth/profile/
 * - GET/POST/PUT/DELETE /api/auth/addresses/
 * - GET /api/orders/
 */

import { apiClient, tokenStorage } from './apiClient';
import { UserProfile } from '../types/auth';
import { DeliveryAddress } from '../types/order';

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number | string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

function mapBackendUser(bUser: AuthResponse['user']): UserProfile {
  const name = [bUser.first_name, bUser.last_name].filter(Boolean).join(' ') || bUser.email.split('@')[0];
  return {
    id: String(bUser.id),
    name,
    email: bUser.email,
    phone: bUser.phone || '',
  };
}

export function mapBackendAddress(item: any): DeliveryAddress {
  return {
    id: String(item.id),
    fullName: item.fullName || item.recipient_name || '',
    phone: item.phone || '',
    houseFlat: item.houseFlat || item.address_line1 || '',
    streetArea: item.streetArea || item.address_line2 || '',
    landmark: item.landmark || '',
    city: item.city || '',
    state: item.state || '',
    pincode: item.pincode || '',
    country: item.country || 'India',
    isDefault: Boolean(item.is_default),
  };
}

export const authService = {
  /**
   * Google OAuth token exchange with Django backend
   */
  async googleLogin(payload: { id_token?: string; token?: string; code?: string; email?: string; name?: string }): Promise<UserProfile> {
    const res = await apiClient.post<AuthResponse>('/auth/google/', payload);
    const user = mapBackendUser(res.data.user);
    tokenStorage.set(res.data.access, res.data.refresh, user);
    return user;
  },

  /**
   * Email & Password Login
   */
  async login(email: string, password: string): Promise<UserProfile> {
    const res = await apiClient.post<AuthResponse>('/auth/login/', { email, password });
    const user = mapBackendUser(res.data.user);
    tokenStorage.set(res.data.access, res.data.refresh, user);
    return user;
  },

  /**
   * Email & Password Customer Registration
   */
  async signup(data: { name: string; email: string; phone?: string; password: string }): Promise<UserProfile> {
    const res = await apiClient.post<AuthResponse>('/auth/signup/', data);
    const user = mapBackendUser(res.data.user);
    tokenStorage.set(res.data.access, res.data.refresh, user);
    return user;
  },

  /**
   * Get current authenticated user profile from storage or API
   */
  getCurrentUser(): UserProfile | null {
    return tokenStorage.getUser();
  },

  /**
   * Fetch latest user profile from Django backend
   */
  async fetchProfile(): Promise<UserProfile> {
    const res = await apiClient.get<AuthResponse['user']>('/auth/profile/');
    const user = mapBackendUser(res.data);
    const access = tokenStorage.getAccess();
    if (access) {
      tokenStorage.set(access, tokenStorage.getRefresh() || undefined, user);
    }
    return user;
  },

  /**
   * Update profile details on Django backend
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const payload: Record<string, string> = {};
    if (updates.name) {
      const parts = updates.name.trim().split(' ');
      payload.first_name = parts[0];
      payload.last_name = parts.slice(1).join(' ');
    }
    if (updates.phone !== undefined) payload.phone = updates.phone;

    const res = await apiClient.put<AuthResponse['user']>('/auth/profile/', payload);
    const updated = mapBackendUser(res.data);
    const access = tokenStorage.getAccess();
    if (access) {
      tokenStorage.set(access, tokenStorage.getRefresh() || undefined, updated);
    }
    return updated;
  },

  /**
   * Fetch customer saved delivery addresses
   */
  async getAddresses(): Promise<DeliveryAddress[]> {
    const res = await apiClient.get<any[]>('/auth/addresses/');
    const list = Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
    return list.map(mapBackendAddress);
  },

  /**
   * Create or update saved delivery address
   */
  async saveAddress(address: DeliveryAddress): Promise<DeliveryAddress> {
    const payload = {
      recipient_name: address.fullName,
      phone: address.phone,
      address_line1: address.houseFlat,
      address_line2: address.streetArea,
      landmark: address.landmark || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country || 'India',
      is_default: Boolean(address.isDefault),
      houseFlat: address.houseFlat,
      streetArea: address.streetArea,
      fullName: address.fullName,
    };

    if (address.id && !address.id.startsWith('temp-')) {
      const res = await apiClient.put(`/auth/addresses/${address.id}/`, payload);
      return mapBackendAddress(res.data);
    }
    const res = await apiClient.post('/auth/addresses/', payload);
    return mapBackendAddress(res.data);
  },

  /**
   * Remove saved address
   */
  async deleteAddress(id: string): Promise<void> {
    await apiClient.delete(`/auth/addresses/${id}/`);
  },

  /**
   * Set address as default
   */
  async setDefaultAddress(id: string): Promise<void> {
    await apiClient.post(`/auth/addresses/${id}/set_default/`);
  },

  /**
   * Fetch customer orders
   */
  async getOrders(): Promise<any[]> {
    const res = await apiClient.get<any[]>('/orders/');
    return Array.isArray(res.data) ? res.data : (res.data as any)?.results || [];
  },

  /**
   * Logout and clear local tokens
   */
  logout(): void {
    tokenStorage.clear();
  },
};
