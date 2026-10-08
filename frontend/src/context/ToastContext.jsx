"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { LuCircleCheck, LuCircleAlert, LuInfo, LuX } from "react-icons/lu";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg, d) => addToast(msg, "success", d), [addToast]);
  const showError = useCallback((msg, d) => addToast(msg, "error", d), [addToast]);
  const showInfo = useCallback((msg, d) => addToast(msg, "info", d), [addToast]);

  return (
    <ToastContext.Provider
      value={{ addToast, showSuccess, showError, showInfo, removeToast }}
    >
      {children}
      {/* Toast Render Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-[calc(100vw-2.5rem)] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-[0_10px_30px_rgba(51,104,160,0.18)] border backdrop-blur-md transition-all animate-[rise_0.3s_ease-out] ${
              toast.type === "success"
                ? "bg-[#18324A]/95 border-[#66A3BF]/40 text-white"
                : toast.type === "error"
                ? "bg-[#2b1417]/95 border-red-500/40 text-white"
                : "bg-[#18324A]/95 border-[#66A3BF]/40 text-white"
            }`}
          >
            <div className="mt-0.5 text-lg shrink-0">
              {toast.type === "success" && (
                <LuCircleCheck className="text-[#C8DFDB]" />
              )}
              {toast.type === "error" && (
                <LuCircleAlert className="text-red-400" />
              )}
              {toast.type === "info" && (
                <LuInfo className="text-[#66A3BF]" />
              )}
            </div>
            <div className="flex-1 text-[0.88rem] leading-snug font-medium font-sans">
              {toast.message}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <LuX className="text-sm" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
