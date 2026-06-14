import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api, unwrapResults } from '../services/api';
import { Newspaper, ArrowLeft, Calendar, ChevronRight, Clock, Tag, Sparkles } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function timeAgo(value) {
  if (!value) return '';
  const now = new Date();
  const date = new Date(value);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(value);
}

const tagColors = [
  'bg-[#15c8fb]/10 text-[#15c8fb] border-[#15c8fb]/20',
  'bg-[#f89f29]/10 text-[#f89f29] border-[#f89f29]/20',
  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'bg-purple-500/10 text-purple-400 border-purple-500/20',
];

function extractTags(content) {
  if (!content) return [];
  const words = content.split(' ');
  const tags = [];
  const seen = new Set();
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z0-9]/g, '');
    if (clean.length > 3 && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase());
      tags.push(clean);
    }
    if (tags.length >= 3) break;
  }
  return tags;
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

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#15c8fb]/5 blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#f89f29]/5 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

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

      <section className="relative pt-32 pb-12 px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#15c8fb]/30 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#15c8fb]/35 bg-[#15c8fb]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#15c8fb]">
              <Newspaper size={12} />
              Latest Updates
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            News & Announcements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-white/50 text-sm max-w-lg"
          >
            Stay informed with the latest news and updates from Elevate Skill.
          </motion.p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-[#15c8fb]/30 border-t-[#15c8fb] animate-spin" />
            </div>
          ) : news.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-[#15c8fb]/10 border border-[#15c8fb]/20 mb-6">
                <Newspaper size={40} className="text-[#15c8fb]/60" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">No news yet</h3>
              <p className="text-white/40 text-sm">Check back later for the latest updates and announcements.</p>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-[#15c8fb]/20 bg-gradient-to-br from-[#15c8fb]/5 via-surface to-[#f89f29]/5 p-8 hover:border-[#15c8fb]/30 transition-all duration-500"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#15c8fb]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#f89f29]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15c8fb]/15 text-[#15c8fb] px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-[#15c8fb]/20">
                        <Sparkles size={10} />
                        Featured
                      </span>
                      {featured.created_at && (
                        <span className="flex items-center gap-1 text-[11px] text-white/40">
                          <Clock size={10} />
                          {timeAgo(featured.created_at)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-3 group-hover:text-[#15c8fb] transition-colors">
                      {featured.title}
                    </h2>
                    {featured.content && (
                      <p className="text-white/60 leading-relaxed line-clamp-3 md:line-clamp-4 max-w-3xl">
                        {featured.content}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-5">
                      {extractTags(featured.title + ' ' + (featured.content || '')).slice(0, 2).map((tag, i) => (
                        <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border ${tagColors[i % tagColors.length]}`}>
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                      <span className="flex items-center gap-1.5 text-white/30 text-[11px] ml-auto">
                        <Calendar size={11} />
                        {formatDate(featured.created_at)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {rest.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#15c8fb]/20 hover:bg-white/[0.05] transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#15c8fb]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex h-2 w-2 rounded-full bg-[#15c8fb] animate-pulse shrink-0" />
                          <span className="flex items-center gap-1 text-[11px] text-white/40">
                            <Clock size={10} />
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-white mb-2 group-hover:text-[#15c8fb] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{item.content}</p>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                            <Calendar size={10} />
                            {formatDate(item.created_at)}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15c8fb] opacity-0 group-hover:opacity-100 transition-opacity">
                            Read more <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
