import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

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

interface ExpenseViewModalProps {
    expense: Expense | null;
    onClose: () => void;
}

const ExpenseViewModal: React.FC<ExpenseViewModalProps> = ({ expense, onClose }) => {
    if (!expense) return null;

    return (
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
                    onClick={onClose}
                    className="absolute top-3 right-3 text-emerald-500 hover:text-emerald-700"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                    {expense.icon || "💵"} {expense.title}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-emerald-600 font-medium">Amount</p>
                        <p className="text-lg font-semibold text-emerald-700">
                            ₹{expense.amount.toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-emerald-600 font-medium">Category</p>
                        <p className="text-lg text-emerald-700">{expense.category}</p>
                    </div>

                    <div>
                        <p className="text-sm text-emerald-600 font-medium">Date</p>
                        <p className="text-lg text-emerald-700">{expense.date}</p>
                    </div>

                    {expense.owner && (
                        <div>
                            <p className="text-sm text-emerald-600 font-medium">Added By</p>
                            <p className="text-lg text-emerald-700">{expense.owner.name}</p>
                        </div>
                    )}
                </div>

                {expense.fileUrl && (
                    <div className="mb-4">
                        <p className="text-sm text-emerald-600 font-medium">Receipt</p>
                        <a
                            href={expense.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-800 underline text-sm"
                        >
                            View Receipt
                        </a>
                    </div>
                )}

                {expense.description && (
                    <div className="mt-3">
                        <p className="text-sm text-emerald-600 font-medium">Description</p>
                        <p className="text-emerald-800 text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                            {expense.description}
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ExpenseViewModal;
