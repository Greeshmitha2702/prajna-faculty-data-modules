import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-gitam-light-green shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-gitam-coral shrink-0" />,
    info: <Info className="w-5 h-5 text-gitam-antique-gold shrink-0" />,
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 right-4 z-50 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-scale-up max-w-sm w-[90vw]"
    >
      {icons[type]}
      <span className="text-xs font-bold text-white leading-relaxed">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer ml-auto p-1 hover:bg-slate-800 rounded transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;