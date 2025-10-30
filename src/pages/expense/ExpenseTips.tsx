import React from "react";

export default function ExpenseTips() {
  return (
    <div className="md:col-span-1 flex flex-col items-center justify-center p-4">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-40 h-40 rounded-xl bg-emerald-100 flex items-center justify-center">
          <svg
            width="84"
            height="84"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="#047857" strokeWidth="1.2" />
            <path d="M8 10h8M8 13h5" stroke="#065f46" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold text-emerald-800">Add Expense</h3>
          <p className="text-sm text-emerald-600 mt-1">Track spending, stay in control.</p>
        </div>

        <div className="w-full mt-4 bg-gradient-to-r from-emerald-100 to-white rounded-lg p-3 text-sm text-emerald-700">
          Tip: Categorize expenses for better analysis.
        </div>
      </div>
    </div>
  );
}
