// src/features/auth/services/authService.ts
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export interface LoginPayload {
  email: string;
  password: string;
}

// Use plain axios and pass withCredentials so server can set cookies
const login = async (payload: LoginPayload) => {
  const res = await axios.post(`${BASE}/auth/login`, payload, { withCredentials: true });
  console.log("Login response:", res.status, res.data);
  return res.data;
};

// Logout — plain axios + withCredentials so backend can clear cookie
const logout = async () => {
  try {
    await axios.post(`${BASE}/auth/logout`, {}, { withCredentials: true });
  } catch (e) {
    console.warn("Logout request failed:", e);
  }
};

// Refresh — plain axios + withCredentials (IMPORTANT: must bypass interceptor)
const refresh = async () => {
  try {
    console.log("Attempting refresh...");
    const res = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true });
    console.log("Refresh response:", res.status, res.data);
    return res.data;
  } catch (err:any) {
    console.error("Refresh token error:", err?.data ?? err.message);
    throw err;
  }
};

const forgotPassword = async (email: string) => {
  try {
    const res = await axios.post(`${BASE}/auth/forgot-password`, { email });
    console.log("Forgot Password response:", res.status, res.data);
    return res.data;
  } catch (err: any) {
    console.error("Forgot password error:", err?.response?.data ?? err.message);
    throw err;
  }
};

const resetPassword = async (token: string, password: string) => {
  try {
    const res = await axios.post(`${BASE}/auth/reset-password`, { token, password });
    console.log("Reset Password response:", res.status, res.data);
    return res.data;
  } catch (err: any) {
    console.error("Reset password error:", err?.response?.data ?? err.message);
    throw err;
  }
};

export default {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
};
