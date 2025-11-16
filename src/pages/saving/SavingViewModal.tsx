import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function SavingViewModal({
  saving,
  onClose,
}: {
  saving: any | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {saving && (
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
            className="bg-white rounded-2xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-emerald-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-emerald-700 mb-3 flex items-center gap-2">
              {saving.icon && <span className="text-2xl">{saving.icon}</span>}
              {saving.source}
            </h2>

            <div className="space-y-3 text-emerald-800">
              <p><strong>Category:</strong> {saving.category}</p>
              <p><strong>Saved Amount:</strong> ₹{saving.savedAmount}</p>
              <p><strong>Date:</strong> {saving.date}</p>

              {saving.fileUrl && saving.fileUrl.match(/\.(jpg|jpeg|png)$/i) && (
                <img
                  src={saving.fileUrl}
                  alt="Receipt"
                  className="rounded-xl max-h-64 object-cover mt-2"
                />
              )}
            </div>

            <div className="text-right mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
