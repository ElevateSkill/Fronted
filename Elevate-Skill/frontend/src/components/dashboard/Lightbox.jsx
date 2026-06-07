import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

export default function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-brand-bg/10 text-white hover:bg-brand-bg/20 transition-all z-10 cursor-pointer"
      >
        <X size={24} />
      </button>
      <a
        href={src}
        download
        className="absolute top-4 right-16 p-2 rounded-full bg-brand-bg/10 text-white hover:bg-brand-bg/20 transition-all z-10 cursor-pointer"
      >
        <Download size={20} />
      </a>
      <motion.img
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        src={src}
        alt="Full size"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={e => e.stopPropagation()}
      />
    </motion.div>
  );
}
