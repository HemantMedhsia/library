import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, sub, icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-white shadow-md"
    >
      <div className="flex items-center gap-3">
        {icon && <div className="text-emerald-600">{icon}</div>}
        <h4 className="text-sm text-emerald-600 font-medium">{title}</h4>
      </div>

      <p className="text-2xl font-bold text-emerald-700 mt-1">{value}</p>
      {sub && <p className="text-xs text-emerald-500 mt-1">{sub}</p>}
    </motion.div>
  );
}
