import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-brand-card rounded-2xl border border-brand-border w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-brand-border">
          <h3 className="text-lg font-black text-brand-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-bg/5 text-brand-muted transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}
