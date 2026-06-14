import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, unwrapResults } from '../services/api';
import { Megaphone, X, Sparkles } from 'lucide-react';

export default function AnnouncementBar({ onAnnouncements }) {
  const [announcements, setAnnouncements] = useState([]);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hasReported = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('access_token');
        let data = [];
        if (token) {
          try {
            const res = await api.get('/announcements/');
            data = unwrapResults(res.data);
          } catch {
            const res = await api.get('/admin/announcements/');
            data = unwrapResults(res.data).filter(a => a.is_published);
          }
        } else {
          const res = await api.get('/announcements/');
          data = unwrapResults(res.data);
        }
        const has = data?.length > 0;
        if (has) {
          setAnnouncements(data);
          requestAnimationFrame(() => setVisible(true));
        } else {
          setAnnouncements([]);
          setVisible(false);
        }
        onAnnouncements?.(has);
      } catch {
        setAnnouncements([]);
        setVisible(false);
        onAnnouncements?.(false);
      }
    }

    load();

    const handler = () => {
      const stored = localStorage.getItem('elevateskill_public_announcements');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data?.length > 0) {
            setAnnouncements(data);
            requestAnimationFrame(() => setVisible(true));
            onAnnouncements?.(true);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('announcements-updated', handler);
    return () => window.removeEventListener('announcements-updated', handler);
  }, [onAnnouncements]);

  const handleDismiss = () => {
    setExiting(true);
    setVisible(false);
  };

  const handleExitComplete = () => {
    setExiting(false);
    if (!hasReported.current) {
      hasReported.current = true;
      onAnnouncements?.(false);
    }
  };

  const show = visible && !exiting && announcements.length > 0;
  const item = announcements[0];

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          key="announcement-bar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-0 left-0 right-0 z-[100] overflow-hidden"
        >
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-gradient-to-r from-[#15c8fb] via-[#0ea5e9] to-[#f89f29] shadow-lg"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-4 -left-4 text-white/10">
                <Sparkles size={60} />
              </div>
              <div className="absolute -bottom-4 -right-4 text-white/10 rotate-12">
                <Sparkles size={40} />
              </div>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[100%] animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-45deg]" />
              </div>
            </div>

            <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="shrink-0 flex items-center gap-1.5 bg-white/25 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner">
                  <Megaphone size={12} className="animate-pulse" />
                  Update
                </span>

                <div className="h-7 overflow-hidden flex items-center flex-1 min-w-0">
                  {announcements.length === 1 ? (
                    <div className="truncate flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-white animate-pulse shrink-0 shadow-sm shadow-white/50" />
                      <span className="text-xs sm:text-sm font-black text-white drop-shadow-md tracking-wide">
                        {item?.title}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/90 ml-1 font-medium drop-shadow-sm bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <span className="text-[10px]">✦</span>
                        {item?.content}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="announcement-marquee flex min-w-max items-center gap-5 whitespace-nowrap"
                      style={{ '--announcement-duration': `${Math.max(18, announcements.length * 8)}s` }}
                    >
                      {[...announcements, ...announcements].map((ann, idx) => (
                        <span key={`${ann.id || ann.title}-${idx}`} className="inline-flex items-center gap-3">
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/80 shadow-sm shadow-white/30" />
                          <span className="text-xs sm:text-sm font-black text-white drop-shadow-md tracking-wide">{ann.title}</span>
                          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/85 max-w-[40ch] truncate font-medium bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            <span className="text-[10px]">✦</span>
                            {ann.content}
                          </span>
                          <span className="h-px w-4 bg-white/20" />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110 active:scale-90 backdrop-blur-sm"
                aria-label="Dismiss announcements"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
