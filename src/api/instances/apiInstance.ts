import axios from 'axios';
import { useAuthStore } from '../../features/auth/authStore';
import { authService } from '../services/authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Access token from Zustand (In-Memory)
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token attached`);
    } else {
      console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url} - NO TOKEN FOUND`);
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
