import React from "react";
import { MdDashboard, MdOutlineAttachMoney, MdSavings } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa";

// Define the shape of a nav item
export interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

// Typed navItems array
export const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/",
    icon: <MdDashboard  />,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: <MdOutlineAttachMoney />,
    children: [
      { name: "Add Expense", path: "/expenses/add-expense", icon: <MdOutlineAttachMoney /> },
      { name: "View Expenses", path: "/expenses/view", icon: <MdOutlineAttachMoney /> },
    ],
  },
  {
    name: "Income",
    path: "/income",
    icon: <FaSackDollar />,
  },
  {
    name: "Savings",
    path: "/savings",
    icon: <MdSavings />,
  },
  {
    name: "About",
    path: "/about",
    icon: <FaInfo />,
  },
];
