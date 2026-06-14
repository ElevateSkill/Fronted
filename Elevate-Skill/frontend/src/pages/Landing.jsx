import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle, ChevronLeft, ChevronRight, Mouse, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroMain from '../assets/elevat.jpg';
import slide2 from '../assets/gr3.jpg';
import slide3 from '../assets/grad2.jpg';

const slides = [
  {
    url: heroMain,
    title: "ELEVATE SKILL",
    amharicTitle: "የወደፊት ትምህርት",
    highlight: "Level Up",
    subtitle: "ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።",
    tag: "Empower Your Future",
    color: "#3C83F6"
  },
  {
    url: slide2,
    title: "YOUR JOURNEY",
    amharicTitle: "የወደፊት ትምህርት",
    highlight: "STAY GROWTH",
    subtitle: "ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።",
    tag: "Learn Without Limits",
    color: "#3C83F6"
  },
  {
    url: slide3,
    title: "MASTER CRAFT",
    amharicTitle: "ጥበቡን ይለማመዱ",
    highlight: "Expertly",
    subtitle: "የቀስቃስ ስልጠናዎችን (Tutorials) መከተል ያቁሙ። ሲስተሞችን (Systems) መገንባት ይጀምሩ። ከኮደርነት ወደ ከፍተኛ የሶፍትዌር አርክቴክትነት (Senior Software Architect) ሽግግር ያድርጉ።",
    tag: "Master Modern Skills",
    color: "#f89f29"
  }
];

const floatingParticles = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: 10 + Math.random() * 80,
  y: 10 + Math.random() * 80,
  size: 2 + Math.random() * 4,
  delay: i * 0.8,
  duration: 3 + Math.random() * 4,
}));

export default function Landing() {
  const [current, setCurrent] = useState(0);

  const handleWatchNowClick = useCallback(() => {
    const target = document.getElementById('courses');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '#courses');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => setCurrent(index);

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-[#f8fafc] transition-colors duration-700">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slides[current].url}
            alt="hero"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </div>

      <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-screen w-full px-6">
        <div className="max-w-4xl w-full text-center mx-auto">
          <motion.div
            key={current + "tag"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 mb-6"
          >
            <Sparkles size={12} className="text-[#f89f29]" />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
              {slides[current].tag}
            </span>
          </motion.div>

          <motion.h1
            key={current + "title"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-white leading-[1.05] mb-4"
          >
            <motion.span
              key={current + "am"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="block font-black text-[#f89f29] mt-6 tracking-widest font-serif"
            >
              {slides[current].amharicTitle}
            </motion.span>
          </motion.h1>

          <motion.p
            key={current + "sub"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed mb-8 text-white/80"
          >
            {slides[current].subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={handleWatchNowClick}
              className="flex items-center gap-3 text-white font-black text-xs tracking-widest uppercase hover:scale-105 hover:shadow-2xl active:scale-95 transition-all group bg-gradient-to-r from-[#f9a215] to-[#f15805] px-8 py-4 rounded-full shadow-2xl shadow-[#f9a215]/30"
            >
              <PlayCircle size={24} className="text-white group-hover:rotate-12 transition-transform" />
              VIEW PROGRAMS
            </button>
            <Link
              to="/register"
              className="flex items-center gap-2 text-white/80 font-bold text-xs tracking-widest uppercase hover:text-white transition-all group border border-white/20 hover:border-white/40 px-8 py-4 rounded-full backdrop-blur-sm"
            >
              <Zap size={16} className="group-hover:scale-110 transition-transform" />
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? 'w-8 bg-[#f89f29] shadow-lg shadow-[#f89f29]/40' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 z-10 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-white/40"
        >
          <Mouse size={16} />
          <span className="text-[9px] uppercase tracking-widest font-bold">Scroll</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
