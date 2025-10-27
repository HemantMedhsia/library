// src/services/api.ts
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../store/store";
import {
  clearAuth as logoutAction,
  setAuthUser,
} from "../features/auth/slices/authSlice";
import authService from "../features/auth/services/authService";

/**
 * Create a single Axios instance for the app.
 * - withCredentials:true so browser sends HttpOnly cookies (access_token, refresh_token if set by backend)
 * - baseURL: change to your backend base url
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

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
      p.resolve(await api(p.config));
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (originalRequest?.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await authService.refresh();

      if (refreshResponse?.user) {
        store.dispatch(setAuthUser(refreshResponse.user));
      }

      processQueue(null, refreshResponse);
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      store.dispatch(logoutAction());
      // handleLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

const handleLogout = async () => {
  try {
    await authService.logout(); // Backend cookies clear
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    store.dispatch(logoutAction()); // Redux cleanup (ek hi sufficient hai)
    window.location.href = "/auth"; // Global redirect (no React dependency)
  }
};

export default api;
