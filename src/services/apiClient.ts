import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const ACCESS_TOKEN_KEY = 'sony_access_token';
const REFRESH_TOKEN_KEY = 'sony_refresh_token';
const USER_STORAGE_KEY = 'sony_auth_user';

export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return null;

    // Check if token has expired before sending it in request headers
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (payload.exp && payload.exp < Date.now() / 1000) {
          // Token expired: clear expired access token proactively
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          return null;
        }
      }
    } catch {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      return null;
    }

    return token;
  },
  getRefresh: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  set: (access: string, refresh?: string, user?: unknown) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (!token && config.headers && config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

const AUTH_EXCLUDED_URLS = ['/auth/login/', '/auth/signup/', '/auth/google/', '/auth/token/refresh/'];
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;
  try {
    const res = await axios.post(`${baseURL}/auth/token/refresh/`, { refresh });
    const newAccess = res.data.access as string;
    tokenStorage.set(newAccess);
    return newAccess;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = originalRequest?.url || '';
    const isExcluded = AUTH_EXCLUDED_URLS.some((u) => url.includes(u));

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isExcluded) {
      originalRequest._retry = true;
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccess = await refreshPromise;
      if (newAccess) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      }

      // Refresh failed or token expired
      tokenStorage.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }

      // If this was a public request (like catalog, products, categories, site config),
      // retry immediately without the Authorization header so the page loads normally!
      if (originalRequest.headers?.Authorization) {
        delete originalRequest.headers.Authorization;
        try {
          return await axios(originalRequest);
        } catch (retryErr: any) {
          return Promise.reject(retryErr?.response?.data ?? retryErr);
        }
      }
    }
    return Promise.reject(error.response?.data ?? error);
  }
);
