import axios from 'axios';
import { useAuthStore } from '../../features/auth/authStore';
import { authService } from '../services/authService';

const api = axios.create({
  baseURL: '/api/proxy',
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Support credentials (cookies/tokens) as requested
});

// Request Interceptor: Transform /auth/login -> ?path=auth/login
api.interceptors.request.use(
  (config) => {
    if (config.url && !config.url.startsWith('http')) {
      // Remove leading slash if exists
      const cleanPath = config.url.startsWith('/') ? config.url.substring(1) : config.url;

      // Update the URL to the proxy format
      config.params = { ...config.params, path: cleanPath };
      config.url = ''; // baseURL takes care of /api/proxy
    }

    // Access token from Zustand (In-Memory)
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.params.path} - Token attached`);
    } else {
      console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.params?.path || config.url} - NO TOKEN FOUND`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Auth/Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error(`API Error [${error.response?.status || 'Network'}]:`, {
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });

    const { logout, setAccessToken } = useAuthStore.getState();

    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt silent refresh
        const { token } = await authService.refreshToken();
        setAccessToken(token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, force logout
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
