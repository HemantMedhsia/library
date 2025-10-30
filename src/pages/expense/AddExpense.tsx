import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Eye, Loader2 } from "lucide-react";
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

  // ================= INITIAL LOAD =================
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
        className="min-h-screen p-6"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ================= SUMMARY SECTION ================= */}
          <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <div>
              <h2 className="text-xl font-semibold text-emerald-700">
                Total Expense
              </h2>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-emerald-600 transition-all"
            >
              <PlusCircle size={20} />
              Add Expense
            </motion.button>
          </div>

          {/* ================= EXPENSE LIST ================= */}
          <div className="bg-white/90 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-emerald-700">
                All Expenses
              </h3>
              <span className="text-sm text-emerald-500">
                {expenses.length} {expenses.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* ================= STATES ================= */}
            {loading && (
              <div className="flex justify-center items-center py-10 text-emerald-600">
                <Loader2 className="animate-spin mr-2" size={20} />
                Loading expenses...
              </div>
            )}

            {error && <p className="text-center text-red-500 py-6">{error}</p>}

            {!loading && expenses.length === 0 && (
              <p className="text-center text-emerald-400 py-6">
                No expenses yet. Add one to get started!
              </p>
            )}

            {!loading && expenses.length > 0 && (
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
                  onSuccess={async () => {
                    await handleRefresh(); // 🔄 refresh data immediately
                    setShowAddModal(false); // then close modal
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= VIEW DETAILS MODAL ================= */}
        <AnimatePresence>
          {selectedExpense && (
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
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
              >
                <button
                  onClick={() => setSelectedExpense(null)}
                  className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                  {selectedExpense.icon && (
                    <span className="text-2xl">{selectedExpense.icon}</span>
                  )}
                  {selectedExpense.title}
                </h2>

                <div className="space-y-3 text-emerald-800">
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {selectedExpense.category}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ₹
                    {selectedExpense.amount}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {selectedExpense.date}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedExpense.description}
                  </p>

                  {/* ✅ Show Image Inline */}
                  {selectedExpense.fileUrl &&
                    selectedExpense.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                      <div className="mt-3">
                        <span className="font-semibold block mb-2">
                          Attachment:
                        </span>
                        <img
                          src={selectedExpense.fileUrl}
                          alt="Expense Attachment"
                          onClick={() =>
                            setImagePreview(selectedExpense.fileUrl || null)
                          }
                          className="rounded-xl max-h-64 object-cover cursor-pointer hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                  {/* Non-image fallback */}
                  {selectedExpense.fileUrl &&
                    !selectedExpense.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                      <p>
                        <span className="font-semibold">Attachment:</span>{" "}
                        <a
                          href={selectedExpense.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-500 underline"
                        >
                          View File
                        </a>
                      </p>
                    )}

                  {selectedExpense.owner && (
                    <p>
                      <span className="font-semibold">Added By:</span>{" "}
                      {selectedExpense.owner.name}
                    </p>
                  )}
                </div>

                <div className="text-right mt-6">
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= IMAGE PREVIEW MODAL ================= */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex justify-center items-center z-[100]"
            >
              <motion.img
                src={imagePreview}
                alt="Preview"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="max-h-[80vh] rounded-xl shadow-2xl border border-white/20"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-5 right-5 bg-white/90 text-emerald-700 rounded-full p-2 shadow-lg hover:bg-white"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
