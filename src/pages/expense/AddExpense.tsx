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
import ExpenseViewModal from "./ExpenseViewModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

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
  // ====================== STATES ======================
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [currentMonthExpense, setCurrentMonthExpense] = useState<number>(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  const [viewExpense, setViewExpense] = useState<Expense | null>(null);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  const [loading, setLoading] = useState(true);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);

  // 🔍 Search by category
  const [categorySearch, setCategorySearch] = useState("");

  // Filtered list
  const filteredExpenses = expenses.filter((exp) =>
    exp.category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // ====================== FETCH FUNCTIONS ======================

  const fetchMonthlyTrend = async () => {
    try {
      const res = await api.get("/expense/trend");
      if (res.data?.status === "success") {
        setMonthlyTrend(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching trend:", err);
    }
  };

  const fetchCategoryTotals = async () => {
    try {
      const res = await api.get("/expense/category-totals");
      if (res.data?.status === "success") {
        setCategoryData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching category totals:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/expense/all");

      if (response.data?.status === "success") {
        setExpenses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
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

  const fetchCurrentMonthTotal = async () => {
    try {
      const response = await api.get("/expense/current-month-total");
      if (response.data?.status === "success") {
        setCurrentMonthExpense(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching current month total:", err);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      fetchExpenses(),
      fetchTotalExpense(),
      fetchCurrentMonthTotal(),
      fetchCategoryTotals(),
      fetchMonthlyTrend(),
    ]);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  // ====================== DELETE FUNCTION ======================

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/expense/delete/${expenseToDelete.id}`);
      await handleRefresh();
    } catch (err) {
      console.error("Error deleting expense:", err);
    } finally {
      setDeleting(false);
      setExpenseToDelete(null);
      setShowListModal(true);
    }
  };

  const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#DCFCE7"];

  return (
    <>
      <Headbar />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen p-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-emerald-700">
                Expense Dashboard
              </h1>
              <p className="text-emerald-500 text-sm mt-1">
                Track your spending smartly and beautifully ✨
              </p>
            </div>

            <div className="flex gap-3">

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowListModal(true)}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow hover:bg-emerald-200"
              >
                <Eye size={18} />
                View Expenses
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-emerald-700"
              >
                <PlusCircle size={20} />
                Add Expense
              </motion.button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Total Expense"
              value={`₹${totalExpense.toLocaleString()}`}
              sub="All time"
            />

            <StatCard
              title="This Month"
              value={`₹${currentMonthExpense.toLocaleString()}`}
              sub={new Date().toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            />

            <StatCard title="Top Category" value="Food 🍕" sub="Dummy data" />
          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Category Breakdown">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Monthly Expense Trend">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
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
        </div>

        {/* ADD / EDIT MODAL */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl relative"
              >
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditExpense(null);
                    setShowListModal(true);
                  }}
                  className="absolute top-3 right-3 text-emerald-500"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  {editExpense ? "Edit Expense" : "Add New Expense"}
                </h2>

                <ExpenseForm
                  {...{
                    expense: editExpense,
                    onSuccess: async () => {
                      await handleRefresh();
                      setShowAddModal(false);
                      setEditExpense(null);
                      setShowListModal(true); // ✔ After update, go back to list modal
                    },
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIEW EXPENSE MODAL */}
        <AnimatePresence>
          {viewExpense && (
            <ExpenseViewModal
              expense={viewExpense}
              onClose={() => {
                setViewExpense(null);
                setShowListModal(true);
              }}
            />
          )}
        </AnimatePresence>

        {/* DELETE MODAL */}
        <DeleteConfirmationModal
          open={!!expenseToDelete}
          title="Delete Expense"
          message={`Delete "${expenseToDelete?.title}"?`}
          onCancel={() => {
            setExpenseToDelete(null);
            setShowListModal(true);
          }}
          onConfirm={handleDeleteExpense}
          loading={deleting}
        />

        {/* ==================== EXPENSE LIST MODAL ==================== */}
        <AnimatePresence>
          {showListModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 w-full max-w-3xl relative max-h-[80vh] overflow-y-auto"
              >
                <button
                  onClick={() => setShowListModal(false)}
                  className="absolute top-3 right-3 text-emerald-500"
                >
                  <X size={22} />
                </button>

                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Expense List
                </h2>

                {/* SEARCH INPUT */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search by category..."
                    className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center py-10 text-emerald-600">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Loading expenses...
                  </div>
                ) : filteredExpenses.length === 0 ? (
                  <p className="text-center text-emerald-400 py-6">
                    No matching expenses.
                  </p>
                ) : (
                  <div className="divide-y">
                    {filteredExpenses.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex justify-between items-center p-4 hover:bg-emerald-50 rounded-lg"
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
                            onClick={() => {
                              setShowListModal(false);
                              setViewExpense(exp);
                            }}
                            className="text-sm text-emerald-500 hover:text-emerald-700"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setShowListModal(false);
                              setEditExpense(exp);
                              setShowAddModal(true);
                            }}
                            className="text-sm text-blue-500 hover:text-blue-700"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() => {
                              setShowListModal(false);
                              setExpenseToDelete(exp);
                            }}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// ================= SUB COMPONENTS =================

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
      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-white shadow-md"
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
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h4 className="text-lg font-semibold text-emerald-700 mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}
