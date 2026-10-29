import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#B7F34A] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        aria-live="polite"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1E2B2A] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-xl"
      >
        {icons[toast.type || 'success']}
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#F3F1EA]">{toast.title}</p>
          {toast.message && (
            <p className="text-[11px] text-[#9FB0AD] mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="text-[#9FB0AD] hover:text-[#F3F1EA] p-1 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
