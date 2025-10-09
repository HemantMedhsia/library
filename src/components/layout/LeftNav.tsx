import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { navItems } from "./NavItems";
import { CiBank, CiLogout } from "react-icons/ci";
import { LuLock, LuLockOpen } from "react-icons/lu"; // Added lock/unlock icons

interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const LeftNav: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<boolean>(true);

  // Toggle dropdown menus
  const handleToggle = (index: number) => {
    setTooltip(!tooltip);
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle hover open/close only if not locked
  const handleMouseEnter = () => {
    if (!isLocked) setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (!isLocked) setIsCollapsed(true);
  };

  return (
    <div>
      <nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex flex-col justify-between bg-emerald-800 border-r border-slate-200 shadow-lg ${
          isCollapsed ? "w-16 px-2" : "w-64 px-4"
        } min-h-screen py-3 duration-300 relative`}
      >
        <div>
          {/* ===== Brand / Logo Section ===== */}
          <Link
            to="/"
            className={`group flex items-center rounded-xl ${
              isCollapsed ? "justify-center" : "justify-center p-2 mr-4"
            } transition-colors duration-300`}
            aria-label="Go to Dashboard"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-l from-black to-emerald-900">
              <span className="text-white font-extrabold select-none">
                <CiBank size={28} />
              </span>
            </div>

            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <div className="text-2xl text-emerald-50 font-bold">pOcKET</div>
              </div>
            )}
          </Link>

          <div className="my-2 h-px w-full bg-slate-900" />

          {/* ===== Navigation Menu ===== */}
          <ul className="space-y-1.5 duration-300 ease-in-out">
            {navItems.map((item: NavItem, index: number) =>
              item.children ? (
                <div
                  key={index}
                  className={tooltip ? `w-full tooltip tooltip-right` : ""}
                  data-tip={item.name}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    className="flex w-full bg-transparent text-emerald-200 hover:text-slate-900 items-center justify-start rounded-xl p-3 gap-2 hover:bg-gradient-to-r from-emerald-100/60 to-emerald-50/60 transition-colors duration-300 focus:outline-none"
                  >
                    <div className="text-2xl pr-2">{item.icon}</div>
                    {!isCollapsed && (
                      <>
                        <div className="text-[15px] font-medium">
                          {item.name}
                        </div>
                        <span className="ml-auto flex justify-center items-center text-emerald-200">
                          {openMenus[index] ? (
                            <FaChevronUp className="text-sm transition-transform duration-300" />
                          ) : (
                            <FaChevronDown className="text-sm transition-transform duration-300" />
                          )}
                        </span>
                      </>
                    )}
                  </button>

                  {/* ===== Submenu ===== */}
                  <ul
                    className={`${
                      isCollapsed ? "pl-0 overflow-hidden w-10" : "pl-3"
                    } mt-1 space-y-1 transform origin-top transition-all duration-300 ease-in-out overflow-x-hidden
                     ${
                       openMenus[index]
                         ? "max-h-[320px] opacity-100"
                         : "max-h-0 opacity-0"
                     }`}
                  >
                    {item.children.map(
                      (childItem: NavItem, childIndex: number) => (
                        <div
                          key={childIndex}
                          className={
                            tooltip ? "w-full tooltip tooltip-right" : "w-full"
                          }
                          data-tip={isCollapsed ? childItem.name : undefined}
                        >
                          <NavLink
                            to={childItem.path ?? "#"}
                            end
                            className={({ isActive }: { isActive: boolean }) =>
                              `flex w-full max-w-52 items-center ${
                                isCollapsed ? "justify-center" : "justify-start"
                              } rounded-lg p-2 gap-3 transition-all duration-300 mx-1
                           hover:bg-gradient-to-r from-emerald-100/60 to-emerald-50/60 text-emerald-200
                           ${
                             isActive
                               ? "bg-gradient-to-r from-emerald-200/80 to-emerald-100/80 text-slate-900 ring-1 ring-emerald-300/60"
                               : "hover:text-slate-900"
                           }`
                            }
                          >
                            <div className="text-lg">
                              {childItem.icon ? (
                                childItem.icon
                              ) : (
                                <VscLightbulbSparkle />
                              )}
                            </div>
                            {!isCollapsed && (
                              <div className="text-[14px]">
                                {childItem.name}
                              </div>
                            )}
                          </NavLink>
                        </div>
                      )
                    )}
                  </ul>
                </div>
              ) : (
                <div
                  key={index}
                  className={tooltip ? `w-full tooltip tooltip-right` : ""}
                  data-tip={item.name}
                >
                  <NavLink
                    to={item.path ?? "#"}
                    className={({ isActive }: { isActive: boolean }) =>
                      `flex w-full items-center ${
                        isCollapsed
                          ? "justify-between mt-3"
                          : "justify-start p-3"
                      } bg-transparent rounded-xl transition-colors duration-200 focus:outline-none
                     hover:bg-gradient-to-r from-emerald-100/60 to-emerald-50/60 hover:text-slate-900
                     ${
                       isActive
                         ? "bg-gradient-to-r from-emerald-200/80 to-emerald-100/80 text-emerald-900 ring-1 ring-emerald-300/60"
                         : "text-emerald-200"
                     }`
                    }
                  >
                    <button className="flex gap-4 w-full items-center outline-none">
                      <div className={`text-2xl ${isCollapsed ? "m-2.5" : ""}`}>
                        {item.icon}
                      </div>
                      {!isCollapsed && (
                        <div className="text-[15px] font-medium">
                          {item.name}
                        </div>
                      )}
                    </button>
                  </NavLink>
                </div>
              )
            )}
          </ul>
        </div>

        <div className={`absolute ${isCollapsed ? "bottom-4 right-3" : "bottom-4 right-4"} flex flex-col gap-3 items-end`}>
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded-full border-2 shadow-md transition-all duration-300 ${
              isLocked
                ? "bg-emerald-700 text-white border-emerald-600 hover:bg-emerald-800"
                : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-100"
            }`}
            title={isLocked ? "Unlock Sidebar" : "Lock Sidebar"}
          >
            {isLocked ? <LuLock size={20} /> : <LuLockOpen size={20} />}
          </button>

          {/* 🧭 Manual Toggle
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-4 py-2 rounded-full bg-white text-emerald-700 border-2 border-emerald-300 shadow-[0_5px_20px_rgba(5,150,105,0.18)] ring-1 ring-emerald-200 transition-all duration-200 hover:scale-105 focus:outline-none"
          >
            {isCollapsed ? "Open" : "Close"}
          </button> */}

          {/* 🚪 Logout (Responsive Icon/Text) */}
        </div>
      </nav>
    </div>
  );
};

export default LeftNav;
