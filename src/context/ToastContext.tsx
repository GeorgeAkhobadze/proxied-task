'use client';
import React, { createContext, useContext } from 'react';
import { toast, ToastOptions, ToastContainer, Bounce } from 'react-toastify';

interface ToastContextProps {
  showToast: (
    message: string,
    type: 'success' | 'error',
    options?: ToastOptions,
  ) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = (
    message: string,
    type: 'success' | 'error',
    options?: ToastOptions,
  ) => {
    if (type === 'success') {
      toast.success(message, options);
    } else {
      toast.error(message, options);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer
        position="bottom-right"
        transition={Bounce}
        theme="dark"
      />
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
