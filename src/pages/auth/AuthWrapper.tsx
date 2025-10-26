import { type ReactNode } from "react";
import loginBg from "../../assets/images/loginBG6.png";

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
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
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
