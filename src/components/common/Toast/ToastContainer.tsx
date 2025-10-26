import { AnimatePresence } from "framer-motion";
import Toast,{ type ToastType } from "./Toast";

export interface ToastData {
  id: string;
  message: string;
  type?: ToastType;
}

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
  position?: ToastPosition;
}

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-5 left-5",
  "top-right": "top-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
  position = "top-right",
}) => {
  return (
    <div
      className={`fixed flex flex-col gap-3 z-[9999] ${positionClasses[position]}`}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
