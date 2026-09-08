import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss?: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none z-50 px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            onClick={onDismiss}
            className="pointer-events-auto max-w-md flex items-center gap-3 px-4 py-3 rounded-2xl bg-cardBackground/95 border border-white/15 text-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl cursor-pointer select-none"
          >
            {toast.type === 'info' ? (
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Info weight="fill" className="w-4 h-4" />
              </div>
            ) : toast.type === 'warning' ? (
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <WarningCircle weight="fill" className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle weight="fill" className="w-4 h-4" />
              </div>
            )}
            
            <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
