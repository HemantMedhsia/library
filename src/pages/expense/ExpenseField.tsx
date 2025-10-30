import React from "react";

interface ExpenseFieldProps {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

export default function ExpenseField({ label, icon, error, children }: ExpenseFieldProps) {
  return (
    <label className="flex flex-col">
      <span className="text-sm text-emerald-700 font-medium mb-1">{label}</span>
      <div className="flex items-center gap-2">
        {icon}
        {children}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </label>
  );
}
