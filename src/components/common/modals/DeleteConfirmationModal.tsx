import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DeleteConfirmationModalProps {
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
    loading?: boolean;
}

export default function DeleteConfirmationModal({
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    onConfirm,
    onCancel,
    open,
    loading = false,
}: DeleteConfirmationModalProps) {
    return (
        <AnimatePresence>
            {open && (
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
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative"
                    >
                        <button
                            onClick={onCancel}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg font-semibold text-red-600 mb-2">{title}</h2>
                        <p className="text-sm text-gray-600 mb-6">{message}</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-60"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
