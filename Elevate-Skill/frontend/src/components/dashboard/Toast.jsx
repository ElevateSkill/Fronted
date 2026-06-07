import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-bold backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-50/95 border-emerald-200 text-emerald-700 shadow-emerald-500/10'
              : 'bg-red-50/95 border-red-200 text-[#D95C4A] shadow-red-500/10'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
