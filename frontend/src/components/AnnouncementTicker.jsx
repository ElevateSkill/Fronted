import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ChevronRight, Sparkles } from 'lucide-react';
import useBackendData from '../hooks/useBackendData';
import { announcementsAPI } from '../services/api';

const safeStr = (v, fallback = '') => (v != null && typeof v !== 'object') ? String(v) : fallback;

// Backend announcement: { id, title, content, date, is_published, ... }
const adapt = (a) => ({
  id: a.id,
  title: safeStr(a.title, 'Update'),
  body: safeStr(a.content),
  date: a.date,
  is_published: a.is_published !== false
});

/**
 * AnnouncementTicker — animated top banner driven by the real backend
 * (`GET /api/v1/announcements/`).
 */
export default function AnnouncementTicker({ variant = 'marquee' }) {
  const { data } = useBackendData(announcementsAPI.list, {
    refreshInterval: 60000,
  });

  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCallout, setShowCallout] = useState(true);

  const list = data.map(adapt).filter((a) => a.is_published);

  useEffect(() => {
    if (list.length <= 1) return undefined;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % list.length);
    }, 5000);
    return () => clearInterval(t);
  }, [list.length]);

  if (dismissed || list.length === 0) return null;

  if (variant === 'callout') {
    const a = list[activeIndex];
    return (
      <AnimatePresence>
        {showCallout && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-40 bg-gradient-to-r from-[#EE8433] via-[#5A2DA8] to-[#D95C4A] text-white"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
              <Sparkles size={18} className="animate-pulse" />
              <p className="text-sm font-medium flex-1">
                <span className="font-bold">{a.title}:</span> {a.body}
              </p>
              <button
                onClick={() => setShowCallout(false)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div
      className="relative z-50 bg-gradient-to-r from-[#EE8433] via-[#5A2DA8] to-[#D95C4A] overflow-hidden border-b border-white/10"
      style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 8s linear infinite' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3A3992] to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3A3992] to-transparent opacity-80" />

      <div className="flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-black/30 backdrop-blur-md border-r border-white/10 shrink-0 z-10"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Megaphone size={16} className="text-[#3A3992]" />
          </motion.div>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
            Live Updates
          </span>
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <div className="ticker-track flex whitespace-nowrap py-2.5">
            {[...list, ...list, ...list].map((a, i) => (
              <span
                key={`${a.id}-${i}`}
                className="inline-flex items-center gap-6 mx-8 text-white font-bold text-xs uppercase tracking-wider"
              >
                <span className="relative flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3A3992] animate-pulse" />
                </span>
                <span className="opacity-90">{a.title}</span>
                <span className="opacity-60 normal-case font-medium line-clamp-1 max-w-md">
                  {a.body}
                </span>
                <ChevronRight size={12} className="opacity-40" />
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 border-l border-white/10"
          aria-label="Dismiss announcements"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
