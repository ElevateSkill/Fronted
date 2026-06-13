import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, ChevronRight, ChevronUp } from 'lucide-react';
import { api, unwrapResults, getMediaUrl } from '../services/api';

const fallbackPosts = [
  { id: 'p1', title: 'Why Full-Stack Development is the Future', author: 'Admin', date: 'May 20, 2026', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600', excerpt: 'The tech industry is evolving rapidly. Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams.', content: 'The tech industry is evolving rapidly. Full-stack developers who can handle both frontend and backend are becoming invaluable assets to modern teams. Companies today are looking for versatile engineers who can navigate the entire stack, from database design to responsive UIs. Our comprehensive full-stack program covers React, Node.js, PostgreSQL, and cloud deployment, ensuring you graduate with real-world skills that employers demand.' },
  { id: 'p2', title: 'UI/UX Trends for 2026', author: 'Admin', date: 'May 18, 2026', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600', excerpt: 'Stay ahead of the curve with these emerging design trends that are shaping how users interact with digital products.', content: 'Stay ahead of the curve with these emerging design trends that are shaping how users interact with digital products. From glassmorphism to micro-interactions, the design landscape continues to evolve. We break down the top trends you need to know, including AI-assisted design workflows, dark mode optimization, and accessibility-first approaches that are defining the next generation of digital experiences.' }
];

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/news/')
      .then(res => {
        const data = unwrapResults(res.data).filter(p => p.status === 'published');
        if (data.length > 0) {
          setPosts(data.map(p => ({
            id: p.id,
            title: p.title,
            author: p.author?.full_name || p.author?.username || 'Admin',
            date: p.created_at ? new Date(p.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            image: getMediaUrl(p.image) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
            excerpt: p.excerpt || p.content?.substring(0, 120) || '',
            content: p.content || p.excerpt || ''
          })));
        }
      })
      .catch(() => {});
  }, []);

  const displayPosts = posts || fallbackPosts;

  if (!displayPosts.length) return null;

  return (
    <div id="blog" className="relative w-full bg-black py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#15c8fb]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            From Our BLOG{' '}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm mt-3 max-w-xl mx-auto"
          >
            Insights, tutorials, and updates from the Elevate Skill team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-[10px] text-gray-300 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#15c8fb] transition-colors line-clamp-2">{post.title}</h3>
                <AnimatePresence mode="wait" initial={false}>
                  {expandedId === post.id ? (
                    <motion.p key="full" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-300 mb-3 leading-relaxed">{post.content}</motion.p>
                  ) : (
                    <motion.p key="excerpt" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-gray-400 mb-3 line-clamp-3 leading-relaxed">{post.excerpt}</motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-[white] font-bold text-xs hover:gap-2 transition-all"
                >
                  {expandedId === post.id ? <>Show Less <ChevronUp size={12} /></> : <>Read More <ChevronRight size={12} /></>}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <button className="px-10 py-4 bg-gradient-to-r from-[#f8740f] to-[#fb6615] text-white font-black text-xs hover:brightness-110 transition-all uppercase tracking-wider flex items-center gap-3 mx-auto shadow-2xl">
            View All Articles <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
