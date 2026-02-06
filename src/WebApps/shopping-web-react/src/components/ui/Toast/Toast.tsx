/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

// Custom Toast Component
interface CustomToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="toast-icon toast-icon-success" />,
    error: <XCircle className="toast-icon toast-icon-error" />,
    warning: <AlertCircle className="toast-icon toast-icon-warning" />,
    info: <Info className="toast-icon toast-icon-info" />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {icons[type]}
        <span className="toast-message">{message}</span>
      </div>
      <button onClick={onClose} className="toast-close" aria-label="Close">
        <X className="toast-close-icon" />
      </button>
    </div>
  );
};

// Toast Configuration
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-center',
  style: {
    background: 'red',
    boxShadow: 'none',
  },
};

// Toast Functions
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="success"
          onClose={() => hotToast.dismiss(t.id)}
        />
      ),
      { ...defaultOptions, ...options }
    );
  },

  error: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="error"
          onClose={() => hotToast.dismiss(t.id)}
        />
      ),
      { ...defaultOptions, ...options }
    );
  },

  warning: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="warning"
          onClose={() => hotToast.dismiss(t.id)}
        />
      ),
      { ...defaultOptions, ...options }
    );
  },

  info: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="info"
          onClose={() => hotToast.dismiss(t.id)}
        />
      ),
      { ...defaultOptions, ...options }
    );
  },

  promise: hotToast.promise,
  dismiss: hotToast.dismiss,
  remove: hotToast.remove,
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'red',
            boxShadow: 'none',
          },
        }}
      />
    </>
  );
};
