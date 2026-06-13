import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <motion.div
          className="inline-block w-12 h-12 border-4 border-white/20 border-t-[#f89f29] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="mt-4 text-sm text-white/60 font-medium">{message}</p>
      </div>
    </div>
  );
}
