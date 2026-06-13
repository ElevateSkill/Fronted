import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone } from 'lucide-react';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = () => {
      const cached = localStorage.getItem('elevateskill_public_announcements');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.length > 0) {
            setAnnouncements(parsed);
            return;
          }
        } catch (e) { console.error(e); }
      }
      setAnnouncements([
        { id: 'def-1', title: 'Admissions Open', content: 'Enroll in our Web Dev or AI Engineering cohorts today!' },
        { id: 'def-2', title: 'Figma Workshop', content: 'Special UI/UX design masterclass scheduled for this Saturday.' },
        { id: 'def-3', title: 'New Accreditation', content: 'ElevateSkill is now fully accredited for AWS Cloud systems training!' }
      ]);
    };
    fetchAnnouncements();
    window.addEventListener('storage', fetchAnnouncements);
    window.addEventListener('announcements-updated', fetchAnnouncements);
    return () => {
      window.removeEventListener('storage', fetchAnnouncements);
      window.removeEventListener('announcements-updated', fetchAnnouncements);
    };
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setCurrentIdx(p => (p + 1) % announcements.length), 5000);
    return () => clearInterval(t);
  }, [announcements]);

  if (!announcements.length) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] border-b border-[#f89f29]/20 shadow-lg shadow-black/20">
      {/* Animated gradient overlay */}
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
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center gap-2 truncate"
              >
                <span className="font-extrabold text-[#f89f29] shrink-0 uppercase tracking-wider text-[11px] sm:text-xs whitespace-nowrap">
                  {announcements[currentIdx]?.title}:
                </span>
                <span className="text-gray-300 font-normal text-[11px] sm:text-xs truncate">
                  {announcements[currentIdx]?.content || announcements[currentIdx]?.body}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentIdx(p => (p - 1 + announcements.length) % announcements.length)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="text-[9px] font-bold text-gray-500 min-w-[28px] text-center">
            {currentIdx + 1}/{announcements.length}
          </span>
          <button
            onClick={() => setCurrentIdx(p => (p + 1) % announcements.length)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
