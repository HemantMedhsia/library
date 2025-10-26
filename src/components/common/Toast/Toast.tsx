import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import successSound from "../../../assets/sounds/success.mp3";
import errorSound from "../../../assets/sounds/error.wav";
import warningSound from "../../../assets/sounds/warning.wav";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle className="text-green-500" size={22} />,
  error: <XCircle className="text-red-500" size={22} />,
  warning: <AlertTriangle className="text-yellow-500" size={22} />,
  info: <Info className="text-blue-500" size={22} />,
};

const sounds: Record<ToastType, string> = {
  success: successSound,
  error: errorSound,
  warning: warningSound,
  info: successSound, // reuse success for info if you like
};

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  onClose,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.4;
    audio.play().catch(() => {});

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = 100 - (elapsed / duration) * 100;
      setProgress(percentage);
      if (elapsed >= duration) {
        clearInterval(interval);
        onClose(id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, id, onClose, type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className={`relative flex items-center gap-3 rounded-xl shadow-xl px-4 py-3 text-sm font-medium text-gray-900 bg-white border-l-4
        ${
          type === "success"
            ? "border-green-500"
            : type === "error"
            ? "border-red-500"
            : type === "warning"
            ? "border-yellow-400"
            : "border-blue-500"
        }
      `}
    >
      {icons[type]}
      <p className="flex-1">{message}</p>
      <button onClick={() => onClose(id)}>
        <X size={16} className="text-gray-500 hover:text-gray-700 transition" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-xl overflow-hidden">
        <motion.div
          className={`h-full ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
              ? "bg-red-500"
              : type === "warning"
              ? "bg-yellow-400"
              : "bg-blue-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;
