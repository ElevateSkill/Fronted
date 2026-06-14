import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api, unwrapResults } from '../services/api';
import { Megaphone, ArrowLeft, Calendar, ChevronRight } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function PublicAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/announcements/');
        const data = unwrapResults(res.data).filter(a => a.is_published !== false);
        setAnnouncements(data);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-8 left-8 z-[100]">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[red] to-[#f89f29] text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl"
          >
            <ArrowLeft size={14} /> Back Home
          </motion.button>
        </Link>
      </nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#15c8fb]/30 to-transparent" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f89f29]/35 bg-[#f89f29]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#f89f29]">
              <Megaphone size={12} />
              Announcements
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Latest Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-white/50 text-sm max-w-lg"
          >
            Stay informed with the latest announcements from Elevate Skill.
          </motion.p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[#15c8fb]/30 border-t-[#15c8fb] animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone size={40} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/40 text-sm font-medium">No announcements yet.</p>
            </div>
          ) : (
            announcements.map((ann, index) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#f89f29]/20 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#f89f29] animate-pulse shrink-0" />
                      <h3 className="text-lg font-black text-white truncate">{ann.title}</h3>
                    </div>
                    {ann.content && (
                      <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{ann.content}</p>
                    )}
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-white/20 group-hover:text-[#f89f29] transition-colors" />
                </div>
                {ann.created_at && (
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-white/40">
                    <Calendar size={12} />
                    {formatDate(ann.created_at)}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
