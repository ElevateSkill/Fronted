import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Globe, ArrowLeft, BadgeCheck, GraduationCap, 
  Quote, MoveRight, Zap, Sparkles, ChevronRight
} from 'lucide-react';
import heroMain from '../assets/elevat.jpg';
import aboutImg from '../assets/grad2.jpg';
import gr1 from '../assets/gr1.jpg';
import gr3 from '../assets/gr3.jpg';
import logoImg from '../assets/logo.jpg';


import meeting from '../assets/gallery/meeting.jpg';
import blood from '../assets/gallery/blood-charity.jpg';
import celebrations from '../assets/gallery/celebrations.jpg';



const About = () => {
  return (
    <div className="min-h-screen bg-[#050505] dark:bg-[#050505] transition-colors duration-500 overflow-x-hidden selection:bg-[#15c8fb]/30 selection:text-white">
      
      {/* 0. FLOATING NAVIGATION */}
      <nav className="fixed top-8 left-8 z-[100]">
        <Link to="/">
          <motion.button 
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[red] to-[#f89f29] text-white text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 shadow-2xl"
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#15c8fb]/20 to-[#f89f29]/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 text-center px-6">
          {/* <motion.div
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
            className="text-[red] font-black uppercase text-[10px] mb-6 tracking-[0.6em]"
          >
            The New Standard • Est. 2026
          </motion.p> */}
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

        {/* <motion.div
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
        </motion.div> */}
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
              <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-xs mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                "We don't just teach code; we architect{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f89f29] to-[#f89f29]">Global Potential.</span>"
              </h2>
            </motion.div>
            
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-light">
              Founded in the digital frontier, <span className="text-gray-900 dark:text-white font-bold">ELEVATE SKILL</span> emerged from a radical need to merge elite industry standards with accessible education. Our mission is to democratize technical mastery, ensuring the gap between potential and opportunity is closed for every learner.
            </p>
            
            <div className="flex flex-wrap gap-12 border-t border-gray-200 dark:border-white/10 pt-12">
              <Stat count="50K+" label="Active Learners" />
              <Stat count="450+" label="Master Mentors" />
              <Stat count="100%" label="Bespoke Curriculum" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute bg-gradient-to-r from-[red]/20 to-[#f89f29]/20 transition-all duration-700" />
            <img 
              src={aboutImg}
              className="w-full aspect-[4/5] object-cover shadow-2xl"
              alt="Deep Work"
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[red] to-[#f89f29] text-white p-8 rounded-2xl hidden xl:block shadow-2xl">
               <Quote className="mb-4 opacity-50" size={32} />
               <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2">Government Verified</p>
               <p className="text-xs font-light opacity-80 uppercase tracking-widest">Startup Guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE PROTOCOLS (DNA Section) */}
      <section className="bg-[#080808] dark:bg-[#080808] py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <span className="h-[2px] w-12 bg-[#f89f29]" />
              <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-xs">The Core DNA</span>
              <span className="h-[2px] w-12 bg-[#f89f29]" />
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black text-white dark:text-white tracking-tight">OUR PROTOCOLS</h2>
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
          <img src={gr3} className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.05]" alt="" />
        </div>
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <div className="w-24 h-[2px] bg-gradient-to-r from-[red] to-[#f89f29] mx-auto" />
          <h2 className="text-3xl md:text-6xl font-extralight italic text-white dark:text-white leading-[1.2] tracking-tight">
            "Knowledge is the first language we speak to the future. Elevate Skill ensures you never have to raise your voice to be heard."
          </h2>
          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-900 dark:text-white font-black uppercase tracking-[0.6em] text-[10px]">Lidetu Tesfaye</p>
            <p className="text-gray-400 uppercase tracking-widest text-[8px] mt-3 font-bold">Chief Executive Architect</p>
          </motion.div> */}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <span className="text-[25vw] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#15c8fb] to-[#f89f29]">ELEVATE</span>
        </div>
      </section>

      {/* 5. NEWS & GALLERY */}
      <section className="py-32 md:py-40 px-6 max-w-7xl mx-auto border-t border-gray-200 dark:border-white/5">
         <div className="flex justify-between items-end mb-20">
            <div>
              <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-xs mb-2 block">Updates</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">Journal / 26</h2>
            </div>
            <div className="flex items-center gap-2 text-[red]">
                <p className="font-bold text-[10px] uppercase tracking-widest">Latest Updates</p>
                <Zap size={14} fill="currentColor" />
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <NewsItem date="12.02.26" tag="Milestone" title="Elevate Skill reaches 5000 active learners." />
            <NewsItem date="28.01.26" tag="Protocol" title="Advanced System Design path launched with NeuralX." />
         </div>

         <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4"
         >
            <div className="relative h-64 overflow-hidden group">
              <img src={gr1} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Project Showcase</p>
            </div>
            <div className="relative h-64 overflow-hidden group">
              <img src={aboutImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Graduation</p>
            </div>
            <div className="relative h-64 overflow-hidden group">
              <img src={gr3} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Mentorship</p>
            </div>

            <div className="relative h-64 overflow-hidden group">
              <img src={celebrations} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Celebrations</p>
            </div>
            <div className="relative h-64 overflow-hidden group">
              <img src={meeting} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Staff Meeting</p>
            </div>
            <div className="relative h-64 overflow-hidden group">
              <img src={blood} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-sm">Blood Charity</p>
            </div>
         </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-gray-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <img src={logoImg} alt="Elevate Skill" className="h-10 mx-auto mb-6 opacity-50" />
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">© 2026 ELEVATE SKILL. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="w-2 h-2 rounded-full bg-[red]" />
            <span className="w-2 h-2 rounded-full bg-[#f89f29]" />
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[red] to-[#f89f29]" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ count, label }) => (
  <div>
    <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{count}</h4>
    <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">{label}</p>
  </div>
);

const ValueCard = ({ Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#0a0a0a] dark:bg-[#0a0a0a] p-10 md:p-12 border border-white/5 hover:border-[red]/30 transition-all duration-500 group"
  >
    <div className="w-14 h-14 bg-gradient-to-br from-[red]/10 to-[#f89f29]/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
      <Icon size={28} className="text-[#f89f29] group-hover:text-[#ff0000] transition-colors" />
    </div>
    <h4 className="text-gray-900 dark:text-white font-black uppercase text-xs tracking-[0.2em] mb-4">{title}</h4>
    <p className="text-gray-500 dark:text-gray-400 text-[11px] leading-relaxed">{desc}</p>
  </motion.div>
);

const NewsItem = ({ date, tag, title }) => (
  <div className="group cursor-pointer">
    <div className="flex gap-4 items-center mb-4">
      <span className="text-[10px] font-black text-[red]">{date}</span>
      <span className="h-px w-8 bg-gray-200 dark:bg-white/10" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tag}</span>
    </div>
    <div className="flex justify-between items-start">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[red] group-hover:to-[#f89f29] transition-all uppercase leading-tight tracking-tight max-w-[80%]">
        {title}
        </h3>
        <MoveRight className="opacity-0 group-hover:opacity-100 transition-all text-[#f89f29]" size={24} />
    </div>
  </div>
);

export default About;
