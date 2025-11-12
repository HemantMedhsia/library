import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../features/auth/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../features/auth/services/authService";

// Validation Schemas
const loginSchema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const forgotSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;
type ForgotFormData = yup.InferType<typeof forgotSchema>;

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Forms
  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const forgotForm = useForm<ForgotFormData>({
    resolver: yupResolver(forgotSchema),
  });

  // Login handler
  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");
    try {
      const response = await authService.login(data);
      if (response?.data) {
        dispatch(setAuthUser(response.data));
        setApiSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid credentials.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (data: ForgotFormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");
    alert("data.email: " + data.email);
    try {
      const response = await authService.forgotPassword(data.email);
      if (response?.data?.message) {
        setApiSuccess(response.data.message);
      } else {
        setApiSuccess("Password reset link sent to your email!");
      }
      forgotForm.reset();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Unable to send reset link. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  // Shared animations and styles
  const containerAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <motion.div
      key="login"
      {...containerAnimation}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg border border-emerald-100"
    >
      {!showForgotPassword ? (
        <>
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
            Login to Your Account
          </h2>

          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-3 text-emerald-800/70" />
              <input
                {...loginForm.register("email")}
                type="text"
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-emerald-800/70" />
              <input
                {...loginForm.register("password")}
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-70"
            >
              {loading ? "Please wait..." : "Login"}
            </button>

            <button
              onClick={() => alert("Google OAuth not implemented")}
              type="button"
              className="flex items-center justify-center gap-2 border border-emerald-300 hover:bg-emerald-50 rounded-lg py-2 w-full font-medium text-emerald-700 transition-all"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </button>
          </form>

          {apiError && (
            <p className="text-red-500 text-center mt-3">{apiError}</p>
          )}
          {apiSuccess && (
            <p className="text-green-600 text-center mt-3">{apiSuccess}</p>
          )}

          <p className="text-sm text-emerald-800/70 mt-4 text-center">
            Don’t have an account?{" "}
            <span
              onClick={onSwitch}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>

          <p className="text-sm text-emerald-800/70 mt-2 text-center">
            <span
              onClick={() => setShowForgotPassword(true)}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
            Forgot Password
          </h2>

          <form
            onSubmit={forgotForm.handleSubmit(handleForgotPassword)}
            className="flex flex-col gap-4"
          >
            <div className="relative">
              <FaUserAlt className="absolute left-3 top-3 text-emerald-800/70" />
              <input
                {...forgotForm.register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              {forgotForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {forgotForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {apiError && (
            <p className="text-red-500 text-center mt-3">{apiError}</p>
          )}
          {apiSuccess && (
            <p className="text-green-600 text-center mt-3">{apiSuccess}</p>
          )}

          <p className="text-sm text-emerald-800/70 mt-4 text-center">
            <span
              onClick={() => setShowForgotPassword(false)}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Back to Login
            </span>
          </p>
        </>
      )}
    </motion.div>
  );
};

export default LoginForm;
