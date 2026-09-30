import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      
      {/* Fixed Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 bg-white border border-subtle shadow-lg text-sm text-neutral-900 transition-all duration-300 animate-slide-up ${
              toast.type === 'error' ? 'border-l-4 border-l-red-500' :
              toast.type === 'info' ? 'border-l-4 border-l-blue-500' :
              'border-l-4 border-l-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' ? (
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              ) : toast.type === 'info' ? (
                <FiInfo className="w-5 h-5 text-blue-500 flex-shrink-0" />
              ) : (
                <FiCheckCircle className="w-5 h-5 text-neutral-900 flex-shrink-0" />
              )}
              <span className="font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
              aria-label="Close notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
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
