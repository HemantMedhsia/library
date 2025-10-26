import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthWrapper from "./AuthWrapper";
import AuthLeftPanel from "./AuthLeftPanel";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthWrapper>
      <AuthLeftPanel isLogin={isLogin} />

      <div className="flex-1 flex justify-center items-center p-8 md:p-12 relative">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" onSwitch={() => setIsLogin(false)} />
          ) : (
            <RegisterForm key="register" onSwitch={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </AuthWrapper>
  );
};

export default AuthPage;
