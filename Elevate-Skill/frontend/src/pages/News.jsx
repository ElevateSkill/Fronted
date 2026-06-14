import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api, unwrapResults } from '../services/api';
import { Newspaper, ArrowLeft, Calendar, ChevronRight } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/news/');
        const data = unwrapResults(res.data).filter(n => n.status === 'published' || n.is_published !== false);
        setNews(data);
      } catch {
        setNews([]);
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
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl"
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#15c8fb]/35 bg-[#15c8fb]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#15c8fb]">
              <Newspaper size={12} />
              News
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Latest News
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-white/50 text-sm max-w-lg"
          >
            Stay informed with the latest news from Elevate Skill.
          </motion.p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[#15c8fb]/30 border-t-[#15c8fb] animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper size={40} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/40 text-sm font-medium">No news yet.</p>
            </div>
          ) : (
            news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#15c8fb]/20 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#15c8fb] animate-pulse shrink-0" />
                      <h3 className="text-lg font-black text-white truncate">{item.title}</h3>
                    </div>
                    {item.content && (
                      <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{item.content}</p>
                    )}
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-white/20 group-hover:text-[#15c8fb] transition-colors" />
                </div>
                {item.created_at && (
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-white/40">
                    <Calendar size={12} />
                    {formatDate(item.created_at)}
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
