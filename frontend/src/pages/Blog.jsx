import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import useBackendData from '../hooks/useBackendData';
import { newsAPI } from '../services/api';
import { loadData as loadLocalData } from '../data/dataStore';

// Backend news: { id, title, excerpt, content, image, author: {full_name}, status, ... }
// Local posts:  { id, title, author (string), excerpt, content, image, status, date }
const adapt = (n) => ({
  id: n.id,
  title: n.title,
  excerpt: n.excerpt || '',
  content: n.content || '',
  image: n.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
  author: typeof n.author === 'object' ? n.author?.full_name : (n.author || 'Admin'),
  date: n.created_at || n.date,
  status: n.status || 'published'
});

export default function Blog() {
  const fallback = (loadLocalData('posts') || []).filter((p) => p.status === 'published' || p.status === 'Published').map(adapt);
  const { data: fetched, loading, source } = useBackendData(
    () => newsAPI.list(),
    fallback
  );

  const posts = (fetched.length ? fetched : fallback)
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
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#3A3992]" />
            <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs">Latest News</span>
            <span className="h-[2px] w-12 bg-[#3A3992]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-gray-900  tracking-tight"
          >
            From Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A3992] to-[#5A2DA8]">Blog</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500  text-sm mt-3 max-w-xl mx-auto"
          >
            Insights, tutorials, and updates from the Elevate Skill team.
          </motion.p>
          {source === 'api' && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 ">Live from /news/</span>
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
                className="group rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-2xl"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {post.date?.slice(0, 10) || 'Recent'}</span>
                    <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5A2DA8] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <button className="flex items-center gap-1.5 text-[#5A2DA8] font-bold text-xs hover:gap-2 transition-all">
                    Read More <ChevronRight size={12} />
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
          <button className="px-10 py-4 bg-gradient-to-r from-[#3A3992] to-[#5A2DA8] text-white font-black text-xs rounded-2xl hover:brightness-110 transition-all uppercase tracking-wider flex items-center gap-3 mx-auto shadow-2xl">
            View All Articles <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
