import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, PlusCircle } from "lucide-react";

import Headbar from "../../components/dashboard/Headbar";

// Reusable Components (SAME AS EXPENSE PAGE)
import StatCard from "../../components/common/cards/StatCard";
import ChartCard from "../../components/common/cards/ChartCard";
import PieChartCard from "../../components/common/cards/PieChartCard";
import LineChartCard from "../../components/common/cards/LineChartCard";
import SearchInput from "../../components/common/inputs/SearchInput";
import ModalWrapper from "../../components/common/modals/ModalWrapper";
import DeleteConfirmationModal from "../../components/common/modals/DeleteConfirmationModal";

import SavingForm from "./SavingForm";
import SavingListItem from "../../components/common/lists/SavingListItem";
import SavingViewModal from "./SavingViewModal";

import api from "../../services/api";

interface Saving {
  id: number;
  category: string;
  source: string;
  savedAmount: number;
  date: string;
  icon?: string;
  fileUrl?: string;
}

export default function AddSaving() {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [totalSaving, setTotalSaving] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editSaving, setEditSaving] = useState<Saving | null>(null);
  const [viewSaving, setViewSaving] = useState<Saving | null>(null);
  const [savingToDelete, setSavingToDelete] = useState<Saving | null>(null);

  const filteredSavings = savings.filter((s) =>
    s.source.toLowerCase().includes(search.toLowerCase())
  );

  // ================= FETCH API =====================

  const fetchSavings = async () => {
    const res = await api.get("/saving/allsaving");
    if (res.data?.status === "success") {
      setSavings(res.data.data);
    }
  };

  const fetchTotalSaving = async () => {
    const res = await api.get("/saving/total");
    if (res.data?.status === "success") {
      setTotalSaving(res.data.data);
    }
  };

  const fetchCategoryTotals = async () => {
    const res = await api.get("/saving/category-totals");
    if (res.data?.status === "success") {
      setCategoryData(res.data.data);
    }
  };

  const fetchMonthlyTrend = async () => {
    const res = await api.get("/saving/trend");
    if (res.data?.status === "success") {
      setMonthlyTrend(res.data.data);
    }
  };

  const refresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchSavings(),
      fetchTotalSaving(),
      //   fetchCategoryTotals(),
      //   fetchMonthlyTrend(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  // ================= DELETE HANDLER =====================

  const handleDelete = async () => {
    if (!savingToDelete) return;
    await api.delete(`/saving/delete/${savingToDelete.id}`);
    setSavingToDelete(null);
    refresh();
  };

  return (
    <>
      <Headbar />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen p-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ================= HEADER ================= */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-emerald-700">Savings</h1>
              <p className="text-emerald-500 text-sm">
                Track your savings beautifully ✨
              </p>
            </div>

            <div className="flex gap-3">
                <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl shadow"
              onClick={() => setShowAddModal(true)}
            >
              <Eye size={18} /> View Expenses
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-md"
            >
              <PlusCircle size={20} /> Add Saving
            </motion.button>
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Total Savings"
              value={`₹${totalSaving.toLocaleString()}`}
              sub="All time"
            />

            <StatCard
              title="Highest Category"
              value="🏦 Bank"
              sub="Dummy (you can update API)"
            />

            <StatCard title="Top Source" value="Salary 💼" sub="Dummy" />
          </div>

          {/* ================= CHARTS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Category Breakdown">
              <PieChartCard
                data={categoryData}
                dataKey="value"
                nameKey="category"
              />
            </ChartCard>

            <ChartCard title="Monthly Saving Trend">
              <LineChartCard data={monthlyTrend} xKey="month" yKey="total" />
            </ChartCard>
          </div>

          {/* ================= LIST CARD ================= */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-emerald-700 mb-4">
              All Savings
            </h2>

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by source..."
            />

            {loading ? (
              <p className="text-center text-emerald-500 py-6">Loading...</p>
            ) : filteredSavings.length === 0 ? (
              <p className="text-center text-emerald-400 py-6">
                No savings found.
              </p>
            ) : (
              <div className="divide-y mt-3">
                {filteredSavings.map((s) => (
                  <SavingListItem
                    key={s.id}
                    saving={s}
                    onView={() => setViewSaving(s)}
                    onEdit={() => {
                      setEditSaving(s);
                      setShowAddModal(true);
                    }}
                    onDelete={() => setSavingToDelete(s)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= ADD / EDIT MODAL ================= */}
        <ModalWrapper
          open={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditSaving(null);
          }}
        >
          <h2 className="text-xl font-semibold text-emerald-700 mb-4">
            {editSaving ? "Edit Saving" : "Add Saving"}
          </h2>

          <SavingForm
            id={editSaving?.id}
            initialData={editSaving ?? undefined}
            onSuccess={() => {
              refresh();
              setShowAddModal(false);
              setEditSaving(null);
            }}
          />
        </ModalWrapper>

        {/* ================= VIEW MODAL ================= */}
        <SavingViewModal
          saving={viewSaving}
          onClose={() => setViewSaving(null)}
        />

        {/* ================= DELETE MODAL ================= */}
        <DeleteConfirmationModal
          open={!!savingToDelete}
          title="Delete Saving"
          message={`Delete "${savingToDelete?.source}"?`}
          onCancel={() => setSavingToDelete(null)}
          onConfirm={handleDelete}
        />
      </motion.div>
    </>
  );
}
