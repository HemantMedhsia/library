import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../features/auth/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../features/auth/services/authService";

const loginSchema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");
    try {
      const response = await authService.login(data);
      if (response?.data) {
        dispatch(setAuthUser(response.data));
        setApiSuccess("Login successful! Redirecting...");
        navigate("/");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Invalid credentials.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg border border-emerald-100"
    >
      <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
        Login to Your Account
      </h2>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="flex flex-col gap-4"
      >
        <div className="relative">
          <FaUserAlt className="absolute left-3 top-3 text-emerald-800/70" />
          <input
            {...form.register("email")}
            type="text"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-emerald-800/70" />
          <input
            {...form.register("password")}
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.password.message}
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

      {/* Feedback */}
      {apiError && <p className="text-red-500 text-center mt-3">{apiError}</p>}
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
    </motion.div>
  );
};

export default LoginForm;
