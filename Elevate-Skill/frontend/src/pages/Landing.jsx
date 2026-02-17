import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, MousePointer2 } from 'lucide-react';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070",
    tag: "FUTURE OF LEARNING",
    title: "IMPROVE YOUR SKILLS",
    subtitle: "Experience a paradigm shift in education. Our platform merges industrial-grade projects with world-class mentorship to redefine your career trajectory."
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
    tag: "ELITE ENGINEERING",
    title: "MASTER THE CRAFT",
    subtitle: "Stop following tutorials. Start building systems. Expert-led courses designed to transition you from a coder to a senior software architect."
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
    tag: "INNOVATION HUB",
    title: "BUILD THE BEYOND",
    subtitle: "From AI integration to scalable cloud infrastructure, gain the skills that the world's most innovative tech companies are hiring for right now."
  }
];

export default function Landing() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds per slide for a premium feel
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="home" className="relative h-screen w-full overflow-hidden transition-colors duration-500 font-sans dark:bg-charcoal bg-slate-50">
      
      {/* --- BACKGROUND ENGINE --- */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Multi-layered cinematic overlays */}
          <div className="absolute inset-0 z-10 
            dark:bg-gradient-to-b dark:from-black/80 dark:via-black/20 dark:to-charcoal 
            bg-gradient-to-b from-white/60 via-white/20 to-slate-50" 
          />
          
          <img 
            src={slides[current].url} 
            alt="background" 
            className="h-full w-full object-cover transition-all duration-1000 
              dark:brightness-[0.5] dark:grayscale-[0.1] brightness-[0.85]"
          />
        </motion.div>
      </AnimatePresence>

      {/* --- HERO CONTENT --- */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
        
        <div className="max-w-6xl">

          {/* Bold Header */}
<motion.h1
  key={current + "title"}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.2 }}
  className="text-[clamp(2.5rem,8vw,8rem)] font-black tracking-tighter mb-8 
             dark:text-whit drop-shadow-2xl uppercase
             leading-[0.9] whitespace-normal lg:whitespace-nowrap"
>
  {slides[current].title.split(' ').map((word, i) => (
    <span 
      key={i} 
      className={`inline-block ${i === 1 ? "dark:text-white/40italic" : ""}`}
    >
      {word}&nbsp;
    </span>
  ))}
</motion.h1>
          {/* Subtitle with staggered entry */}
          <motion.p
            key={current + "sub"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed mb-12 
              dark:text-white/70 text-slate-600 transition-colors duration-500"
          >
            {slides[current].subtitle}
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(21, 200, 251, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-center gap-4 bg-[#15c8fb] text-white px-10 py-5 md:px-14 md:py-6 rounded-sm font-black text-sm md:text-base tracking-[0.2em] uppercase transition-all"
            >
              <div className="bg-white/20 p-1.5 rounded-sm group-hover:bg-white/40 transition-colors">
                 <Play size={20} fill="currentColor" />
              </div>
              START FREE TRIAL
            </motion.button>

            <button className="flex items-center gap-2 font-black text-sm tracking-widest uppercase dark:text-white text-slate-900 hover:text-[#17c966] dark:hover:text-[#17c966] transition-colors group">
              VIEW COURSES <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* --- SLIDE INDICATORS (Left side dots) --- */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-12 rounded-full transition-all duration-500 ${
              current === i ? "bg-[#15c8fb]" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>y

      {/* --- PROGRESS BAR (Bottom) --- */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        <div className="h-[2px] w-full bg-black/10 dark:bg-white/5">
          <motion.div 
            key={current}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
            className="h-full bg-gradient-to-r from-[#15c8fb] to-[#17c966] shadow-[0_0_15px_#15c8fb]"
          />
        </div>
      </div>

      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#15c8fb]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#17c966]/5 blur-[120px] rounded-full pointer-events-none" />

    </div>
  );
}