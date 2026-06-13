import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, unwrapResults } from '../services/api';
import { Megaphone } from 'lucide-react';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    api.get('/announcements/')
      .then((res) => {
        const data = unwrapResults(res.data);
        if (data?.length) setAnnouncements(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setCurrentIdx(p => (p + 1) % announcements.length), 5000);
    return () => clearInterval(t);
  }, [announcements]);

  if (!announcements.length) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] border-b border-[#f89f29]/20 shadow-lg shadow-black/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[100%] animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg]" />
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#15c8fb]/20">
            <Megaphone size={12} className="animate-pulse" />
            Update
          </span>
          <div className="h-6 overflow-hidden flex items-center flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="truncate"
              >
                <span className="text-xs sm:text-sm font-bold text-white">
                  {announcements[currentIdx]?.title}
                </span>
                <span className="hidden sm:inline text-xs text-white/60 ml-2">
                  — {announcements[currentIdx]?.content}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
