import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Eye, Loader2, Edit3, Trash2 } from "lucide-react";
import Headbar from "../../components/dashboard/Headbar";
import api from "../../services/api";
import SavingForm from "./SavingForm";

interface Saving {
    id: number;
    category: string;
    source: string;
    savedAmount: number;
    date: string;
    icon?: string | null;
    fileUrl?: string | null;
}

export default function AddSaving() {
    const [savings, setSavings] = useState<Saving[]>([]);
    const [totalSaving, setTotalSaving] = useState<number>(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSaving, setSelectedSaving] = useState<Saving | null>(null);
    const [editingSaving, setEditingSaving] = useState<Saving | null>(null); // 🟢 For edit
    const [savingToDelete, setSavingToDelete] = useState<Saving | null>(null); // 🟢 For delete confirmation
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ================= FETCH FUNCTIONS =================
    const fetchSavings = async () => {
        try {
            setLoading(true);
            const response = await api.get("/saving/allsaving");
            if (response.data?.status === "success") {
                setSavings(response.data.data);
            } else {
                throw new Error(response.data?.message || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching savings:", err);
            setError("Failed to load savings.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTotalSaving = async () => {
        try {
            const response = await api.get("/saving/total");
            if (response.data?.status === "success") {
                setTotalSaving(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching total saving:", err);
        }
    };

    const handleRefresh = async () => {
        await Promise.all([fetchSavings(), fetchTotalSaving()]);
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
                className="min-h-screen p-6"
            >
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* ================= SUMMARY SECTION ================= */}
                    <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                        <div>
                            <h2 className="text-xl font-semibold text-emerald-700">
                                Total Savings
                            </h2>
                            <p className="text-3xl font-bold text-emerald-600 mt-1">
                                ₹{totalSaving.toLocaleString()}
                            </p>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setEditingSaving(null);
                                setShowAddModal(true);
                            }}
                            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-md hover:bg-emerald-600 transition-all"
                        >
                            <PlusCircle size={20} />
                            Add Saving
                        </motion.button>
                    </div>

                    {/* ================= SAVINGS LIST ================= */}
                    <div className="bg-white/90 border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-emerald-50 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-emerald-700">
                                All Savings
                            </h3>
                            <span className="text-sm text-emerald-500">
                                {savings.length} {savings.length === 1 ? "entry" : "entries"}
                            </span>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center py-10 text-emerald-600">
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Loading savings...
                            </div>
                        )}

                        {error && <p className="text-center text-red-500 py-6">{error}</p>}

                        {!loading && savings.length === 0 && (
                            <p className="text-center text-emerald-400 py-6">
                                No savings yet. Add one to get started!
                            </p>
                        )}

                        {!loading && savings.length > 0 && (
                            <motion.div layout className="divide-y divide-emerald-50">
                                {savings.map((save) => (
                                    <motion.div
                                        key={save.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex justify-between items-center p-4 hover:bg-emerald-50 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{save.icon || "🏦"}</span>
                                            <div>
                                                <p className="font-medium text-emerald-800">
                                                    {save.source}
                                                </p>
                                                <p className="text-xs text-emerald-500">
                                                    {save.category} • {save.date}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons + Amount Display */}
                                        <div className="flex items-center gap-6">
                                            {/* Show saved amount */}
                                            <p className="text-emerald-700 font-semibold text-sm sm:text-base">
                                                ₹{save.savedAmount.toLocaleString()}
                                            </p>

                                            {/* View Button */}
                                            <button
                                                onClick={() => setSelectedSaving(save)}
                                                className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-700 transition-all hover:scale-105"
                                            >
                                                <Eye size={17} /> View
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => {
                                                    setEditingSaving(save);
                                                    setShowAddModal(true);
                                                }}
                                                className="text-blue-500 hover:text-blue-600 transition-all hover:scale-110"
                                                title="Edit Saving"
                                            >
                                                <Edit3 size={18} />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => setSavingToDelete(save)}
                                                className="text-red-500 hover:text-red-600 transition-all hover:scale-110"
                                                title="Delete Saving"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ================= ADD / EDIT SAVING MODAL ================= */}
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
                                    {editingSaving ? "Edit Saving" : "Add New Saving"}
                                </h2>

                                <SavingForm
                                    onSuccess={async () => {
                                        await handleRefresh();
                                        setShowAddModal(false);
                                        setEditingSaving(null);
                                    }}
                                    initialData={
                                        editingSaving
                                            ? {
                                                ...editingSaving,
                                                icon: editingSaving.icon || undefined,
                                                fileUrl: editingSaving.fileUrl || undefined,
                                            }
                                            : undefined
                                    }

                                    id={editingSaving?.id}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ================= VIEW DETAILS MODAL ================= */}
                <AnimatePresence>
                    {selectedSaving && (
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
                                    onClick={() => setSelectedSaving(null)}
                                    className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700"
                                >
                                    <X size={20} />
                                </button>

                                <h2 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                                    {selectedSaving.icon && (
                                        <span className="text-2xl">{selectedSaving.icon}</span>
                                    )}
                                    {selectedSaving.source}
                                </h2>

                                <div className="space-y-3 text-emerald-800">
                                    <p>
                                        <span className="font-semibold">Category:</span>{" "}
                                        {selectedSaving.category}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Saved Amount:</span> ₹
                                        {selectedSaving.savedAmount}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Date:</span>{" "}
                                        {selectedSaving.date}
                                    </p>
 

                                    {selectedSaving.fileUrl &&
                                        selectedSaving.fileUrl.match(/\.(jpg|jpeg|png|gif)$/i) && (
                                            <div className="mt-3">
                                                <span className="font-semibold block mb-2">
                                                    Attachment:
                                                </span>
                                                <img
                                                    src={selectedSaving.fileUrl}
                                                    alt="Saving Receipt"
                                                    onClick={() =>
                                                        setImagePreview(selectedSaving.fileUrl || null)
                                                    }
                                                    className="rounded-xl max-h-64 object-cover cursor-pointer hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}
                                </div>

                                <div className="text-right mt-6">
                                    <button
                                        onClick={() => setSelectedSaving(null)}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ================= DELETE CONFIRMATION MODAL ================= */}
                <AnimatePresence>
                    {savingToDelete && (
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
                                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center"
                            >
                                <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                                    Delete Saving
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete{" "}
                                    <strong>{savingToDelete.source}</strong>?
                                </p>

                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setSavingToDelete(null)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.delete(`/saving/delete/${savingToDelete.id}`);
                                                alert("Saving deleted successfully!");
                                                setSavingToDelete(null);
                                                handleRefresh();
                                            } catch (error) {
                                                console.error(error);
                                                alert("Failed to delete saving!");
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Delete
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
