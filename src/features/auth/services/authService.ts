// src/features/auth/services/authService.ts
import api from "../../../services/api";

export interface LoginPayload {
  email: string;
  password: string;
}

const login = async (payload: LoginPayload) => {
  /**
   * Backend returns:
   * - sets access_token cookie (HttpOnly)
   * - optionally returns { data: { user: {...}, tokenResponse: {...} } }
   * We return the response data object (user/tokenResponse) to the caller.
   */
  const res = await api.post("/auth/login", payload);
  // your backend seems to wrap response in a structure: { status, message, data: { ... } }
  return res.data?.data;
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
  /**
   * Preferred backend: /auth/refresh reads refresh token from HttpOnly cookie and
   * returns a new access token (and optionally new user data). Use withCredentials.
   */
  const res = await api.post("/auth/refresh", null); // no body — cookies are used
  // return the data (maybe TokenResponse or user)
  return res.data;
};

export default {
  login,
  logout,
  refresh,
};
