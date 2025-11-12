import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Calendar, CreditCard, Tag, Edit3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const emerald = {
  dark: "#065F46",
  rich: "#047857",
  light: "#34D399",
  mint: "#6EE7B7",
  pale: "#A7F3D0",
  gold: "#D9F99D",
};

// Dummy data for chart
const incomeTrends = [
  { month: "Jan", amount: 72000 },
  { month: "Feb", amount: 81000 },
  { month: "Mar", amount: 88000 },
  { month: "Apr", amount: 94000 },
  { month: "May", amount: 102000 },
  { month: "Jun", amount: 115000 },
];

const Income = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen p-6 text-white">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-700">Income Overview</h1>

        {/* Add Income Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-tr from-emerald-600 to-lime-400 text-white px-4 py-2 rounded-xl shadow-lg hover:brightness-110 transition-all"
        >
          <PlusCircle size={20} />
          Add Income
        </motion.button>
      </div>

      {/* ================= CHART ================= */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-2xl border border-emerald-200/40 p-6 backdrop-blur-md shadow-md"
      >
        <h2 className="text-xl font-semibold text-emerald-800 mb-4">
          Monthly Income Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={incomeTrends}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={emerald.light} stopOpacity={0.8} />
                <stop offset="95%" stopColor={emerald.mint} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
            <XAxis dataKey="month" stroke={emerald.dark} />
            <YAxis stroke={emerald.dark} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                color: emerald.rich,
                borderRadius: "10px",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={emerald.rich}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ================= ADD INCOME MODAL ================= */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white text-emerald-800 rounded-2xl shadow-xl p-6 w-full max-w-lg relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                Add New Income
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Income added successfully!");
                  setShowAddModal(false);
                }}
                className="flex flex-col gap-4"
              >
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-emerald-700">
                    Title
                  </label>
                  <div className="flex items-center border border-emerald-200 rounded-lg px-3 py-2 mt-1">
                    <Edit3 size={16} className="text-emerald-500 mr-2" />
                    <input
                      type="text"
                      placeholder="e.g. Freelance Project"
                      required
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-medium text-emerald-700">
                    Amount (₹)
                  </label>
                  <div className="flex items-center border border-emerald-200 rounded-lg px-3 py-2 mt-1">
                    <CreditCard size={16} className="text-emerald-500 mr-2" />
                    <input
                      type="number"
                      placeholder="0.00"
                      required
                      className="w-full outline-none"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-emerald-700">
                    Date
                  </label>
                  <div className="flex items-center border border-emerald-200 rounded-lg px-3 py-2 mt-1">
                    <Calendar size={16} className="text-emerald-500 mr-2" />
                    <input type="date" required className="w-full outline-none" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-emerald-700">
                    Category
                  </label>
                  <div className="flex items-center border border-emerald-200 rounded-lg px-3 py-2 mt-1">
                    <Tag size={16} className="text-emerald-500 mr-2" />
                    <select
                      required
                      className="w-full outline-none bg-transparent"
                    >
                      <option value="">Select</option>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investments">Investments</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-emerald-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Optional note..."
                    rows={3}
                    className="w-full border border-emerald-200 rounded-lg px-3 py-2 mt-1 outline-none resize-none"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-400 text-white font-medium hover:brightness-105 shadow"
                  >
                    Save Income
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Income;
