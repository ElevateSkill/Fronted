import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronRight, Loader2, FileText } from 'lucide-react';
import useBackendData from '../hooks/useBackendData';
import { newsAPI, getMediaUrl } from '../services/api';

const safeStr = (v, fallback = '') => (v != null && typeof v !== 'object') ? String(v) : fallback;

// Backend news: { id, title, excerpt, content, image, author: {full_name}, status, ... }
const adapt = (n) => ({
  id: n.id,
  title: safeStr(n.title),
  excerpt: safeStr(n.excerpt || n.content),
  content: safeStr(n.content || n.excerpt),
  image: getMediaUrl(n.image) || '',
  author: safeStr(typeof n.author === 'object' ? n.author?.full_name : n.author, 'Admin'),
  date: n.created_at || n.date,
  status: safeStr(n.status, 'published')
});

export default function Blog() {
  const { data: fetched, loading, source } = useBackendData(newsAPI.list);

  const posts = (fetched || [])
    .map(adapt)
    .filter((p) => p.status === 'published' || p.status === 'Published')
    .slice(0, 3);

  if (posts.length === 0 && !loading) return null;

  return (
    <div id="blog" className="relative w-full bg-gray-50  py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#5A2DA8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#3A3992]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-[#EE8433]/25 bg-[#EE8433]/10 px-4 py-2 backdrop-blur mb-5"
          >
            <FileText size={14} className="text-[#EE8433]" />
            <span className="text-[#EE8433] font-black uppercase tracking-[0.28em] text-[10px]">Latest News</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#1565C0]">
              From Our Blog
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 max-w-xl mx-auto font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-[#EE8433]/80 to-[#3A3992]/80"
          >
            Insights, tutorials, and updates from the Elevate Skill team.
          </motion.p>
          {source === 'api' && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Live from /news/</span>
            </div>
          )}
        </div>

        {loading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-[#EE8433] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-white border-2 border-transparent hover:border-[#FFC107]/30 overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#3A3992]/10"
                style={{ background: 'linear-gradient(135deg, #ffffff, #fefcf8)' }}
              >
                <div className="h-48 overflow-hidden relative">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FFD700]/10 via-[#FFC107]/5 to-[#1565C0]/10 flex items-center justify-center">
                      <FileText size={40} className="text-[#FFC107]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded-md text-[8px] font-bold uppercase tracking-wider text-[#3A3992] shadow">
                    Article
                  </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {post.date?.slice(0, 10) || 'Recent'}</span>
                    <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1565C0] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <button className="inline-flex items-center gap-1.5 text-[#FFC107] font-bold text-xs hover:gap-2 transition-all group/btn">
                    Read More <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <button className="px-10 py-4 bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#1565C0] text-white font-black text-xs rounded-2xl hover:brightness-110 transition-all uppercase tracking-wider flex items-center gap-3 mx-auto shadow-2xl shadow-[#FFC107]/20">
            View All Articles <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
