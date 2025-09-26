import React from "react";
// import Header from "./Header/Header";
// import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import LeftNav from "./LeftNav";

const Layout: React.FC = () => {
  return (
    // <div className="flex bg-gradient-to-l from-[#d1f5d3] to-emerald-900 duration-300 h-screen">
    <div className="flex bg-[#a6dec9] duration-300 h-screen">
      <LeftNav />
      <div className="w-full px-3 overflow-x-auto">
        {/* <Header /> */}
        <div className="bg-transparent h-auto w-full">
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
