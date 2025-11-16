import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Eye, Loader2, X } from "lucide-react";

import Headbar from "../../components/dashboard/Headbar";
import ExpenseForm from "./ExpenseForm";
import ExpenseViewModal from "./ExpenseViewModal";
import DeleteConfirmationModal from "../../components/common/modals/DeleteConfirmationModal";

// Reusable Components
import StatCard from "../../components/common/cards/StatCard";
import ChartCard from "../../components/common/cards/ChartCard";
import PieChartCard from "../../components/common/cards/PieChartCard";
import LineChartCard from "../../components/common/cards/LineChartCard";
import ModalWrapper from "../../components/common/modals/ModalWrapper";
import SearchInput from "../../components/common/inputs/SearchInput";
import ExpenseListItem from "../../components/common/lists/ExpenseListItem";

import api from "../../services/api";

// ================== INTERFACES ==================
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
  fileUrl?: string;
  icon?: string;
  owner?: ExpenseOwner;
}

// ================== MAIN COMPONENT ==================
export default function AddExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Modals Control
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [viewExpense, setViewExpense] = useState<Expense | null>(null);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  // Filtered expenses
  const filteredExpenses = expenses.filter((exp) =>
    exp.category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // ================== API CALLS ==================
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [exRes, totalRes, currRes, catRes, trendRes] = await Promise.all([
        api.get("/expense/all"),
        api.get("/expense/total"),
        api.get("/expense/current-month-total"),
        api.get("/expense/category-totals"),
        api.get("/expense/trend"),
      ]);

      if (exRes.data?.status === "success") setExpenses(exRes.data.data);
      if (totalRes.data?.status === "success")
        setTotalExpense(totalRes.data.data);
      if (currRes.data?.status === "success")
        setCurrentMonthExpense(currRes.data.data);
      if (catRes.data?.status === "success") setCategoryData(catRes.data.data);
      if (trendRes.data?.status === "success")
        setMonthlyTrend(trendRes.data.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ================== DELETE HANDLER ==================
  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/expense/delete/${expenseToDelete.id}`);
      await fetchAllData();
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setDeleting(false);
      setExpenseToDelete(null);
      setShowListModal(true);
    }
  };

  // ================== RENDER ==================
  return (
    <>
      <Headbar />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
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
                Track your spending smartly ✨
              </p>
            </div>

            <div className="flex gap-3">
              {/* View Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow"
                onClick={() => setShowListModal(true)}
              >
                <Eye size={18} /> View Expenses
              </motion.button>

              {/* Add Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow"
                onClick={() => setShowAddModal(true)}
              >
                <PlusCircle size={20} /> Add Expense
              </motion.button>
            </div>
          </div>

          {/* STAT CARDS */}
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

            <StatCard
              title="Top Category"
              value="Food 🍔"
              sub="(API add later)"
            />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Category Breakdown">
              <PieChartCard
                data={categoryData}
                dataKey="value"
                nameKey="category"
              />
            </ChartCard>

            <ChartCard title="Monthly Expense Trend">
              <LineChartCard data={monthlyTrend} xKey="month" yKey="expense" />
            </ChartCard>
          </div>
        </div>

        {/* ==================== ADD / EDIT MODAL ==================== */}
        <ModalWrapper
          open={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditExpense(null);
          }}
        >
          <h2 className="text-xl font-semibold text-emerald-700 mb-4">
            {editExpense ? "Edit Expense" : "Add New Expense"}
          </h2>

          <ExpenseForm
            expense={editExpense ?? undefined}
            onSuccess={async () => {
              await fetchAllData();
              setShowAddModal(false);
              setEditExpense(null);
              setShowListModal(true);
            }}
          />
        </ModalWrapper>

        {/* ==================== VIEW MODAL ==================== */}
        <ExpenseViewModal
          expense={viewExpense}
          onClose={() => {
            setViewExpense(null);
            setShowListModal(true);
          }}
        />

        {/* ==================== DELETE MODAL ==================== */}
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

        {/* ==================== LIST MODAL ==================== */}
        <ModalWrapper
          open={showListModal}
          onClose={() => setShowListModal(false)}
        >
          <h2 className="text-xl font-semibold text-emerald-700 mb-4">
            Expense List
          </h2>

          <SearchInput
            value={categorySearch}
            onChange={setCategorySearch}
            placeholder="Search by category..."
          />

          {loading ? (
            <div className="flex justify-center py-10 text-emerald-600">
              <Loader2 className="animate-spin mr-2" size={20} /> Loading...
            </div>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-center text-emerald-400 py-6">
              No matching expenses.
            </p>
          ) : (
            <div className="divide-y mt-3">
              {filteredExpenses.map((exp) => (
                <ExpenseListItem
                  key={exp.id}
                  exp={exp}
                  onView={() => {
                    setShowListModal(false);
                    setViewExpense(exp);
                  }}
                  onEdit={() => {
                    setShowListModal(false);
                    setEditExpense(exp);
                    setShowAddModal(true);
                  }}
                  onDelete={() => {
                    setShowListModal(false);
                    setExpenseToDelete(exp);
                  }}
                />
              ))}
            </div>
          )}
        </ModalWrapper>
        
      </motion.div>
    </>
  );
}