import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Eye, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Headbar from "../../components/dashboard/Headbar";
import ExpenseForm from "./ExpenseForm";
import api from "../../services/api";

interface ExpenseOwner {
  id: string;
  name: string;
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  fileUrl?: string | null;
  icon?: string | null;
  owner?: ExpenseOwner;
}

export default function AddExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===== Dummy Analytics Data =====
  const categoryData = [
    { name: "Food", value: 22000 },
    { name: "Transport", value: 8000 },
    { name: "Bills", value: 12000 },
    { name: "Entertainment", value: 7000 },
    { name: "Shopping", value: 5000 },
  ];
  const monthlyTrend = [
    { month: "Jan", expense: 3200 },
    { month: "Feb", expense: 4700 },
    { month: "Mar", expense: 5900 },
    { month: "Apr", expense: 6500 },
    { month: "May", expense: 7200 },
    { month: "Jun", expense: 8100 },
    { month: "Jul", expense: 9100 },
  ];
  const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#DCFCE7"];

  // ================= FETCH FUNCTIONS =================
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/expense/all");
      if (response.data?.status === "success") {
        setExpenses(response.data.data);
      } else {
        throw new Error(response.data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const response = await api.get("/expense/total");
      if (response.data?.status === "success") {
        setTotalExpense(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching total expense:", err);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchExpenses(), fetchTotalExpense()]);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // ================= UI =================
  return (
    <>
      <Headbar />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-100"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-emerald-700">
                Expense Dashboard
              </h1>
              <p className="text-emerald-500 text-sm mt-1">
                Track your spending smartly and beautifully ✨
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-emerald-700 transition-all"
            >
              <PlusCircle size={20} />
              Add Expense
            </motion.button>
          </div>

          {/* ================= STATS CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Total Expense"
              value={`₹${totalExpense.toLocaleString() || "54,200"}`}
              sub="All time"
            />
            <StatCard title="This Month" value="₹18,500" sub="November 2025" />
            <StatCard title="Top Category" value="Food 🍕" sub="40% of spend" />
          </div>

          {/* ================= ANALYTICS SECTION ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Category Breakdown">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Monthly Expense Trend">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ================= EXPENSE LIST ================= */}
          <div className=" backdrop-blur-md border border-emerald-100 rounded-2xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-emerald-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-emerald-700">
                Recent Expenses
              </h3>
              <span className="text-sm text-emerald-500">
                {expenses.length} items
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10 text-emerald-600">
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading expenses...
              </div>
            ) : !loading && expenses.length === 0 ? (
              <p className="text-center text-emerald-400 py-6">
                No expenses yet. Add one to get started!
              </p>
            ) : (
              <motion.div layout className="divide-y divide-emerald-50">
                {expenses.map((exp) => (
                  <motion.div
                    key={exp.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-4 hover:bg-emerald-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exp.icon || "💵"}</span>
                      <div>
                        <p className="font-medium text-emerald-800">
                          {exp.title}
                        </p>
                        <p className="text-xs text-emerald-500">
                          {exp.category} • {exp.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-emerald-600">
                        ₹{exp.amount}
                      </p>
                      <button
                        onClick={() => setSelectedExpense(exp)}
                        className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-700"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* ================= ADD EXPENSE MODAL ================= */}
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
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl relative"
              >
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Add New Expense
                </h2>

                <ExpenseForm
                  {...({
                    onSuccess: async () => {
                      await handleRefresh();
                      setShowAddModal(false);
                    },
                  } as any)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// ================= SUBCOMPONENTS =================

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-100/80 to-white/70 shadow-md border border-emerald-200/50 backdrop-blur-sm"
    >
      <h4 className="text-sm text-emerald-600 font-medium">{title}</h4>
      <p className="text-2xl font-bold text-emerald-700 mt-1">{value}</p>
      <p className="text-xs text-emerald-500 mt-1">{sub}</p>
    </motion.div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <h4 className="text-lg font-semibold text-emerald-700 mb-3">{title}</h4>
      {children}
    </div>
  );
}
