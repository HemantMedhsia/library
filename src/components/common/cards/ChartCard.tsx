import React from "react";

export default function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h4 className="text-lg font-semibold text-emerald-700 mb-3">{title}</h4>
      {children}
    </div>
  );
}
