import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {type ToastData, type ToastPosition } from "../components/common/Toast/ToastContainer";
import type { ToastType } from "../components/common/Toast/Toast";

export const useToast = (defaultPosition: ToastPosition = "top-right") => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const newToast = { id: uuidv4(), message, type };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast, defaultPosition };
};
