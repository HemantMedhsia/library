import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";

const registerSchema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role: yup.string().required("Role is required"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");
    console.log("Registering user with data:", data);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response?.data) {
        setApiSuccess("Registration successful! You can now log in.");
        form.reset();
      }
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg border border-emerald-100"
    >
      <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
        Create New Account
      </h2>

      <form onSubmit={form.handleSubmit(handleRegister)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="relative">
          <FaUserAlt className="absolute left-3 top-3 text-emerald-800/70" />
          <input
            type="text"
            {...form.register("name")}
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-emerald-800/70" />
          <input
            type="email"
            {...form.register("email")}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-emerald-800/70" />
          <input
            type="password"
            {...form.register("password")}
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="relative">
          <FaUserAlt className="absolute left-3 top-3 text-emerald-800/70" />
          <select
            {...form.register("role")}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          {form.formState.errors.role && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-70"
        >
          {loading ? "Please wait..." : "Register"}
        </button>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => alert("Google OAuth not implemented")}
          className="flex items-center justify-center gap-2 border border-emerald-300 hover:bg-emerald-50 rounded-lg py-2 w-full font-medium text-emerald-700 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </form>

      {/* Feedback */}
      {apiError && <p className="text-red-500 text-center mt-3">{apiError}</p>}
      {apiSuccess && <p className="text-green-600 text-center mt-3">{apiSuccess}</p>}

      <p className="text-sm text-emerald-800/70 mt-4 text-center">
        Already have an account?{" "}
        <span
          onClick={onSwitch}
          className="text-emerald-700 font-semibold cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </motion.div>
  );
};

export default RegisterForm;
