// src/features/auth/services/authService.ts
import api from "../../../services/api";

export interface LoginPayload {
  email: string;
  password: string;
}

const login = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload);
  console.log("Login response data:", res.data);
  return res?.data;
};

const logout = async () => {
  /**
   * If you have an API endpoint to clear server side cookies (recommended),
   * call it. Otherwise just clear client state + navigate to login.
   */
  try {
    // call a backend logout endpoint to clear cookies server-side (if implemented)
    await api.post("/auth/logout");
  } catch (e) {
    // ignore network errors for logout
  }
};

const refresh = async () => {
  try {
    console.log("Attempting to refresh token...");
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};

export default {
  login,
  logout,
  refresh,
};
