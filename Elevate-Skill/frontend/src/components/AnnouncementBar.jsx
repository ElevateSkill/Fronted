import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { api, unwrapResults } from '../services/api';
import { Megaphone } from 'lucide-react';

export default function AnnouncementBar({ onAnnouncements }) {
  const [announcements, setAnnouncements] = useState([]);
  const [visible, setVisible] = useState(false);
  const innerRef = useRef(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // ——— Load announcements (now public, no auth needed) ———
  useEffect(() => {
    function load() {
      api.get('/announcements/')
        .then((res) => {
          const data = unwrapResults(res.data);
          const has = data?.length > 0;
          if (has) {
            setAnnouncements(data);
            // Double rAF: wait one frame for DOM render, then trigger animation
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setVisible(true));
            });
          } else {
            setAnnouncements([]);
            setVisible(false);
          }
          onAnnouncements?.(has);
        })
        .catch(() => {
          setAnnouncements([]);
          setVisible(false);
          onAnnouncements?.(false);
        });
    }

    load();

    // Listen for updates from MainView (merged as fallback)
    const handler = () => {
      const stored = localStorage.getItem('elevateskill_public_announcements');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data?.length > 0) {
            setAnnouncements(data);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => setVisible(true));
            });
            onAnnouncements?.(true);
          }
        } catch {
          // ignore bad localStorage data
        }
      }
    };
    window.addEventListener('announcements-updated', handler);
    return () => window.removeEventListener('announcements-updated', handler);
  }, [onAnnouncements]);

  // ——— Measure inner content height ———
  useEffect(() => {
    if (innerRef.current) {
      setMeasuredHeight(innerRef.current.scrollHeight);
    }
  }, [announcements]);

  const marqueeItems = announcements.length > 1 ? [...announcements, ...announcements] : announcements;
  const marqueeDuration = `${Math.max(18, announcements.length * 8)}s`;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] overflow-hidden transition-all duration-500 ease-out"
      style={{ height: visible ? measuredHeight : 0 }}
    >
      {announcements.length > 0 && (
        <motion.div
          ref={innerRef}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative bg-gradient-to-r from-[#0a0a1a] via-[#1a0a2e] to-[#0a0a1a] border-b border-[#f89f29]/20 shadow-lg shadow-black/20"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -inset-[100%] animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg]" />
          </div>

          <div className="relative max-w-screen-2xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
            {/* Left: badge + rotating text */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#15c8fb]/20">
                <Megaphone size={12} className="animate-pulse" />
                Update
              </span>

              {/* Sliding content */}
              <div className="h-6 overflow-hidden flex items-center flex-1 min-w-0">
                {announcements.length === 1 ? (
                  <div className="truncate">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {announcements[0]?.title}
                    </span>
                    <span className="hidden sm:inline text-xs text-white/60 ml-2">
                      — {announcements[0]?.content}
                    </span>
                  </div>
                ) : (
                  <div
                    className="announcement-marquee flex min-w-max items-center gap-6 whitespace-nowrap"
                    style={{ '--announcement-duration': marqueeDuration }}
                  >
                    {marqueeItems.map((item, idx) => (
                      <span key={`${item.id || item.title}-${idx}`} className="inline-flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{item.title}</span>
                        <span className="hidden sm:inline text-xs text-white/65 max-w-[52ch] truncate">{item.content}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#f89f29]/75" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}