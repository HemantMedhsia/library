// src/services/api.ts
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../store/store";
import { clearAuth as logoutAction, setAuthUser } from "../features/auth/slices/authSlice";
import authService from "../features/auth/services/authService";

/**
 * Create a single Axios instance for the app.
 * - withCredentials:true so browser sends HttpOnly cookies (access_token, refresh_token if set by backend)
 * - baseURL: change to your backend base url
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Refresh-token control:
 * - when a 401 happens we call /auth/refresh once and queue other requests until it's resolved.
 */
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: AxiosResponse<any>) => void;
  reject: (err: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = async (error: any, tokenResponse?: any) => {
  failedQueue.forEach(async (p) => {
    if (error) {
      p.reject(error);
    } else {
      // we don't mutate headers here since backend uses cookie-based access token,
      // but if you're setting Authorization header, set it here using tokenResponse
      p.resolve(await api(p.config));
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If the error is not 401, pass it through
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      // queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      /**
       * Preferred flow:
       * - call /auth/refresh with withCredentials (refresh token in secure HttpOnly cookie)
       * - backend sets new access_token cookie and returns token info (optional)
       */
      const refreshResponse = await authService.refresh();

      // If backend provides new user data, update it. Otherwise keep current.
      if (refreshResponse?.user) {
        store.dispatch(setAuthUser(refreshResponse.user));
      }

      processQueue(null, refreshResponse);
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // dispatch logout and redirect to login
      store.dispatch(logoutAction());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;