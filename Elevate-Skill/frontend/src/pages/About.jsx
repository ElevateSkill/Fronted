import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Globe, 
  ArrowLeft, 
  BadgeCheck, 
  GraduationCap, 
  Quote, 
  MoveRight,
  Zap
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* 0. FLOATING NAVIGATION */}
      <nav className="fixed top-8 left-8 z-[100]">
        <Link to="/">
          <motion.button 
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-sm text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 shadow-2xl"
          >
            <ArrowLeft size={14} /> Protocol Home
          </motion.button>
        </Link>
      </nav>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470" 
            className="w-full h-full object-cover grayscale opacity-30 dark:opacity-10"
            alt="Digital Architecture"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-[#050505]/60 dark:to-[#050505]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.6em" }}
            transition={{ duration: 1.5 }}
            className="text-red-600 font-black uppercase text-[10px] mb-6"
          >
            The New Standard • Est. 2026
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="text-7xl md:text-[11rem] font-black text-black dark:text-white uppercase leading-none tracking-tighter"
          >
            THE HOUSE.
          </motion.h1>
        </div>
      </section>

      {/* 2. OUR STORY (Split Layout) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tight italic leading-tight">
                "We don't just teach code; we architect <span className="text-red-600 text-6xl block md:inline">Global Potential.</span>"
              </h2>
            </motion.div>
            
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-light">
              Founded in the digital frontier, <span className="text-black dark:text-white font-bold tracking-tight">ELEVATE SKILL</span> emerged from a radical need to merge elite industry standards with accessible education. Our mission is to democratize technical mastery, ensuring the gap between potential and opportunity is closed for every learner.
            </p>
            
            <div className="flex flex-wrap gap-12 border-t border-gray-100 dark:border-white/5 pt-12">
              <Stat count="50K+" label="Active Learners" />
              <Stat count="450+" label="Master Mentors" />
              <Stat count="100%" label="Bespoke Curriculum" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 border border-red-600/20 group-hover:inset-0 transition-all duration-700" />
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470" 
              className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-1000 rounded-sm shadow-2xl"
              alt="Deep Work"
            />
            <div className="absolute -bottom-10 -right-10 bg-red-600 text-white p-10 hidden xl:block shadow-2xl">
               <Quote className="mb-4 opacity-50" size={32} />
               <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2">Protocol Verified</p>
               <p className="text-xs font-light opacity-80 uppercase tracking-widest">Global Industry Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PROTOCOLS (DNA Section) */}
      <section className="bg-gray-50 dark:bg-[#080808] py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-24">
            <h3 className="text-red-600 font-black tracking-[0.5em] uppercase text-[9px] mb-4 text-center mx-auto">The Core DNA</h3>
            <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white uppercase tracking-tighter">OUR PROTOCOLS</h2>
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
      <section className="py-60 px-6 lg:px-20 text-center relative">
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="w-24 h-px bg-red-600 mx-auto" />
          <h2 className="text-3xl md:text-6xl font-extralight italic text-black dark:text-white leading-[1.2] tracking-tight">
            "Knowledge is the first language we speak to the future. Elevate Skill ensures you never have to raise your voice to be heard."
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-black dark:text-white font-black uppercase tracking-[0.6em] text-[10px]">Lidetu Tesfaye</p>
            <p className="text-gray-400 uppercase tracking-widest text-[8px] mt-3 font-bold">Chief Executive Architect</p>
          </motion.div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <span className="text-[25vw] font-black uppercase">HOUSE</span>
        </div>
      </section>

      {/* 5. NEWS JOURNAL */}
      <section className="py-40 px-6 max-w-7xl mx-auto border-t border-gray-100 dark:border-white/5">
         <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">Journal / 26</h2>
            <div className="flex items-center gap-2 text-red-600">
                <p className="font-bold text-[10px] uppercase tracking-widest">Latest Updates</p>
                <Zap size={14} fill="currentColor" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <NewsItem date="12.02.26" tag="Milestone" title="Elevate Skill reaches 50,000 active learners globally." />
            <NewsItem date="28.01.26" tag="Protocol" title="Advanced System Design path launched with NeuralX." />
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-gray-100 dark:border-white/5">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">© 2026 ELEVATE SKILL PROTOCOL. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const Stat = ({ count, label }) => (
  <div>
    <h4 className="text-3xl font-black text-black dark:text-white tracking-tighter italic">{count}</h4>
    <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">{label}</p>
  </div>
);

const ValueCard = ({ Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5, backgroundColor: "rgba(220, 38, 38, 0.02)" }}
    className="bg-white dark:bg-[#0a0a0a] p-12 border border-gray-100 dark:border-white/5 hover:border-red-600 transition-all duration-500 group"
  >
    <Icon size={28} className="text-gray-300 dark:text-gray-700 group-hover:text-red-600 transition-colors mb-8" />
    <h4 className="text-black dark:text-white font-black uppercase text-xs tracking-[0.2em] mb-4">{title}</h4>
    <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed uppercase tracking-tighter">{desc}</p>
  </motion.div>
);

const NewsItem = ({ date, tag, title }) => (
  <div className="group cursor-pointer">
    <div className="flex gap-4 items-center mb-4">
      <span className="text-[10px] font-black text-red-600">{date}</span>
      <span className="h-px w-8 bg-gray-200 dark:bg-white/10" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tag}</span>
    </div>
    <div className="flex justify-between items-start">
        <h3 className="text-xl md:text-2xl font-bold dark:text-white group-hover:text-red-600 transition-colors uppercase leading-tight tracking-tight max-w-[80%]">
        {title}
        </h3>
        <MoveRight className="opacity-0 group-hover:opacity-100 transition-all text-red-600" size={24} />
    </div>
  </div>
);

export default About;