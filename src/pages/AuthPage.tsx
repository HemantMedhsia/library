import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import loginBg from "../assets/images/loginBG6.png";
import { useNavigate } from "react-router-dom";

const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const registerSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;
type RegisterFormData = yup.InferType<typeof registerSchema>;

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/auth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const navigate = useNavigate();

  // Two forms (separate)
  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  const registerForm = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
  };

  // ✅ Handle login and register separately
  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");
    console.log(data);
    setApiSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setApiError("");
    setApiSuccess("");
    console.log(data);
    setApiSuccess("Registration successful! You can now log in.");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center md:justify-end bg-emerald-600/90 md:pr-28 bg-no-repeat"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "contain",
        backgroundPosition: "center left",
      }}
    >
      <div className="flex flex-col md:flex-row w-[90%] md:w-[80%] lg:w-[70%] rounded-3xl overflow-hidden shadow-2xl bg-[#dfffe4]/90 backdrop-blur-lg border border-emerald-100 duration-1000">
        {/* Left Info */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-emerald-600/90 text-white p-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-4"
          >
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </motion.h1>
          <p className="text-white/90 text-center max-w-sm leading-relaxed">
            {isLogin
              ? "Sign in to continue managing your finances with ease and insight."
              : "Create an account to unlock powerful tools and insights tailored for you."}
          </p>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex justify-center items-center p-8 md:p-12">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg border border-emerald-100"
              >
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
                      type="text"
                      {...loginForm.register("username")}
                      placeholder="Username"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {loginForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-emerald-800/70" />
                    <input
                      type="password"
                      {...loginForm.register("password")}
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
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-lg border border-emerald-100"
              >
                <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
                  Create New Account
                </h2>
                <form
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="flex flex-col gap-4"
                >
                  <div className="relative">
                    <FaUserAlt className="absolute left-3 top-3 text-emerald-800/70" />
                    <input
                      type="text"
                      {...registerForm.register("fullName")}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                    {registerForm.formState.errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-emerald-800/70" />
                    <input
                      type="email"
                      {...registerForm.register("email")}
                      placeholder="Email"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-emerald-800/70" />
                    <input
                      type="password"
                      {...registerForm.register("password")}
                      placeholder="Password"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-70"
                  >
                    {loading ? "Please wait..." : "Register"}
                  </button>

                  <button
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
              </motion.div>
            )}
          </AnimatePresence>
          {/* Feedback Messages */}
          <div className="absolute bottom-5 text-center w-full">
            {apiError && <p className="text-red-500 font-medium">{apiError}</p>}
            {apiSuccess && (
              <p className="text-green-600 font-medium">{apiSuccess}</p>
            )}
            <p className="text-sm text-emerald-800/70 mt-3">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <span
                onClick={() => {
                  setIsLogin(!isLogin);
                  setApiError("");
                  setApiSuccess("");
                  loginForm.reset();
                  registerForm.reset();
                }}
                className="text-emerald-700 font-semibold cursor-pointer hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
