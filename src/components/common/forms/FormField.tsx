import React from "react";

export default function FormField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-emerald-700 flex items-center gap-1">
        {icon} {label}
      </label>

      {children}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
