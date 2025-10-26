import { motion } from "framer-motion";

interface AuthLeftPanelProps {
  isLogin: boolean;
}

const AuthLeftPanel = ({ isLogin }: AuthLeftPanelProps) => {
  return (
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
  );
};

export default AuthLeftPanel;
