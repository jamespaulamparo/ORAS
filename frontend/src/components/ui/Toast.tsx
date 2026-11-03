import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Trash2, X } from 'lucide-react';

export type ToastType = 'success' | 'danger' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-surface text-fg border-status-success/40 shadow-floating',
            danger: 'bg-surface text-fg border-status-danger/40 shadow-floating',
            info: 'bg-surface text-fg border-border-default shadow-floating',
          }[toast.type];

          const Icon = {
            success: CheckCircle2,
            danger: AlertCircle,
            info: Info,
          }[toast.type];

          const iconColor = {
            success: 'text-status-success',
            danger: 'text-status-danger',
            info: 'text-accent',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg border text-xs font-medium backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 shadow-card animate-slide-up ${typeStyles}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={`${iconColor} shrink-0`} />
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-fg-muted hover:text-fg transition-colors p-0.5 rounded"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
