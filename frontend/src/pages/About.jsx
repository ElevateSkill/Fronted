import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Globe, ArrowLeft, BadgeCheck, GraduationCap, 
  Quote, MoveRight, Zap, Sparkles, ChevronRight, Loader2, FileText
} from 'lucide-react';
import heroMain from '../assets/elevat.jpg';
import aboutImg from '../assets/grad2.jpg';
import gr1 from '../assets/gr1.jpg';
import gr3 from '../assets/gr3.jpg';
import logoImg from '../assets/logo.jpg';
import useBackendData from '../hooks/useBackendData';
import { newsAPI, getMediaUrl } from '../services/api';

const About = () => {
  return (
    <div className="min-h-screen bg-white  transition-colors duration-500 overflow-x-hidden selection:bg-[#5A2DA8]/30 selection:text-white">
      
      {/* 0. FLOATING NAVIGATION */}
      <nav className="fixed top-8 left-8 z-[100]">
        <Link to="/">
          <motion.button 
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 bg-[#3A3992] text-white rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 shadow-2xl"
          >
            <ArrowLeft size={14} /> Back Home
          </motion.button>
        </Link>
      </nav>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroMain}
            className="w-full h-full object-cover"
            alt="Elevate Skill"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE8433]/20 to-[#5A2DA8]/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img src={logoImg} alt="Elevate Skill" className="h-16 md:h-20 mx-auto brightness-0 invert" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ duration: 1.5 }}
            className="text-[#5A2DA8] font-black uppercase text-[10px] mb-6 tracking-[0.6em]"
          >
            The New Standard • Est. 2026
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="text-6xl md:text-[10rem] font-black text-white uppercase leading-none tracking-tighter"
          >
            ELEVATE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-white/50 text-sm md:text-base mt-6 tracking-widest uppercase font-medium"
          >
            Project-Based Learning for the Modern Engineer
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/40"
          >
            <ChevronRight size={24} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. OUR STORY (Split Layout) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900  tracking-tight leading-tight">
                "We don't just teach code; we architect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EE8433] to-[#5A2DA8]">Global Potential.</span>"
              </h2>
            </motion.div>
            
            <p className="text-gray-500  text-lg leading-relaxed font-light">
              Founded in the digital frontier, <span className="text-gray-900  font-bold">ELEVATE SKILL</span> emerged from a radical need to merge elite industry standards with accessible education. Our mission is to democratize technical mastery, ensuring the gap between potential and opportunity is closed for every learner.
            </p>
            
            <div className="flex flex-wrap gap-12 border-t border-gray-200  pt-12">
              <Stat count="100%" label="Practical Learning" />
              <Stat count="24/7" label="Support Available" />
              <Stat count="100%" label="Bespoke Curriculum" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#EE8433]/20 to-[#5A2DA8]/20 group-hover:inset-0 transition-all duration-700 rounded-2xl" />
            <img 
              src={aboutImg}
              className="w-full aspect-[4/5] object-cover rounded-2xl shadow-2xl"
              alt="Deep Work"
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#EE8433] to-[#5A2DA8] text-white p-8 rounded-2xl hidden xl:block shadow-2xl">
               <Quote className="mb-4 opacity-50" size={32} />
               <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2">Protocol Verified</p>
               <p className="text-xs font-light opacity-80 uppercase tracking-widest">Global Industry Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PROTOCOLS (DNA Section) */}
      <section className="bg-gray-50  py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <span className="h-[2px] w-12 bg-[#3A3992]" />
              <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs">The Core DNA</span>
              <span className="h-[2px] w-12 bg-[#3A3992]" />
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black text-gray-900  tracking-tight">OUR PROTOCOLS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ValueCard 
              Icon={BadgeCheck} 
              title="Excellence" 
              desc="Every module is vetted by lead architects from the world's top-tier tech startups."
            />
            <ValueCard 
              Icon={Globe} 
              title="Global Soul" 
              desc="Sourcing knowledge from Silicon Valley to Adama for a unique educational fusion."
            />
            <ValueCard 
              Icon={GraduationCap} 
              title="Mastery" 
              desc="Investing in apprenticeships to keep the high-end technical arts alive."
            />
            <ValueCard 
              Icon={Users} 
              title="Integrity" 
              desc="Full transparency in our paths. Ethical education is our baseline protocol."
            />
          </div>
        </div>
      </section>

      {/* 4. FOUNDER'S NOTE */}
      <section className="py-40 md:py-60 px-6 lg:px-20 text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={gr3} className="w-full h-full object-cover opacity-[0.03] .05]" alt="" />
        </div>
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="w-24 h-[2px] bg-gradient-to-r from-[#EE8433] to-[#5A2DA8] mx-auto" />
          <h2 className="text-3xl md:text-6xl font-extralight italic text-gray-900  leading-[1.2] tracking-tight">
            "Knowledge is the first language we speak to the future. Elevate Skill ensures you never have to raise your voice to be heard."
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-900  font-black uppercase tracking-[0.6em] text-[10px]">Lidetu Tesfaye</p>
            <p className="text-gray-400 uppercase tracking-widest text-[8px] mt-3 font-bold">Chief Executive Architect</p>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <span className="text-[25vw] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#EE8433] to-[#5A2DA8]">ELEVATE</span>
        </div>
      </section>

      {/* 5. FROM OUR BLOG — fetched from real API */}
      <AboutBlogSection />

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-gray-200 ">
        <div className="max-w-4xl mx-auto px-6">
          <img src={logoImg} alt="Elevate Skill" className="h-10 mx-auto mb-6 opacity-50" />
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">© 2026 ELEVATE SKILL. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="w-2 h-2 rounded-full bg-[#5A2DA8]" />
            <span className="w-2 h-2 rounded-full bg-[#3A3992]" />
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#EE8433] to-[#5A2DA8]" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ count, label }) => (
  <div>
    <h4 className="text-3xl font-black text-gray-900  tracking-tighter">{count}</h4>
    <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">{label}</p>
  </div>
);

const ValueCard = ({ Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white  p-10 md:p-12 rounded-2xl border border-gray-200  hover:border-[#5A2DA8]/30 transition-all duration-500 group"
  >
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EE8433]/10 to-[#5A2DA8]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <Icon size={28} className="text-[#5A2DA8] group-hover:text-[#3A3992] transition-colors" />
    </div>
    <h4 className="text-gray-900  font-black uppercase text-xs tracking-[0.2em] mb-4">{title}</h4>
    <p className="text-gray-500  text-[11px] leading-relaxed">{desc}</p>
  </motion.div>
);

const NewsItem = ({ date, tag, title }) => (
  <div className="group cursor-pointer">
    <div className="flex gap-4 items-center mb-4">
      <span className="text-[10px] font-black text-[#5A2DA8]">{date}</span>
      <span className="h-px w-8 bg-gray-200 " />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tag}</span>
    </div>
    <div className="flex justify-between items-start">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900  group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EE8433] group-hover:to-[#5A2DA8] transition-all uppercase leading-tight tracking-tight max-w-[80%]">
        {title}
        </h3>
        <MoveRight className="opacity-0 group-hover:opacity-100 transition-all text-[#3A3992]" size={24} />
    </div>
  </div>
);

function AboutBlogSection() {
  const { data: fetched, loading } = useBackendData(
    () => newsAPI.list(),
    []
  );

  const posts = (fetched || [])
    .filter((n) => n.status === 'published' || n.status === 'Published')
    .slice(0, 3);

  if (posts.length === 0 && !loading) return null;

  return (
    <section className="py-32 md:py-40 px-6 max-w-7xl mx-auto border-t border-gray-200">
      <div className="flex justify-between items-end mb-20">
        <div>
          <span className="text-[#EE8433] font-black uppercase tracking-[0.3em] text-xs mb-2 block">Our Journal</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">From Our Blog</h2>
        </div>
        <div className="flex items-center gap-2 text-[#5A2DA8]">
          <p className="font-bold text-[10px] uppercase tracking-widest">Latest Updates</p>
          <Zap size={14} fill="currentColor" />
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#EE8433] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden hover:border-gray-300 transition-all hover:shadow-2xl"
            >
              <div className="h-48 overflow-hidden relative">
                {post.image ? (
                  <img src={getMediaUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3A3992]/10 to-[#EE8433]/10 flex items-center justify-center">
                    <FileText size={40} className="text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3">
                  <span>{post.created_at?.slice(0, 10) || 'Recent'}</span>
                  {post.author && (
                    <span>{typeof post.author === 'object' ? post.author?.full_name : post.author}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#5A2DA8] transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">{post.excerpt || ''}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default About;
