import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const AdminToastContext = createContext(null);

export const AdminToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AdminToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 bg-white border border-neutral-300 shadow-xl text-xs font-semibold text-neutral-900 animate-slide-up ${
              toast.type === 'error' ? 'border-l-4 border-l-red-500' :
              toast.type === 'info' ? 'border-l-4 border-l-blue-500' :
              'border-l-4 border-l-emerald-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'error' ? <FiAlertCircle className="w-4 h-4 text-red-500" /> : <FiCheckCircle className="w-4 h-4 text-emerald-600" />}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-neutral-400 hover:text-neutral-900">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = () => {
  const context = useContext(AdminToastContext);
  if (!context) throw new Error('useAdminToast must be used within AdminToastProvider');
  return context;
};
