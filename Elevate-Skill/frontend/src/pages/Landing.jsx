import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle, ChevronLeft, ChevronRight, Mouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroMain from '../assets/elevat.jpg';
import slide2 from '../assets/gr3.jpg';
import slide3 from '../assets/grad2.jpg';

import { Globe } from 'lucide-react';

const slides = [
    {
    url: heroMain,
    title: "ELEVATE SKILL",
    amharicTitle: "የወደፊት ትምህርት",
    highlight: "Level Up",
    subtitle: "ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።",
    color: "#3C83F6"
  },
  {
    url: slide2,
    title: "YOUR JOURNEY",
    amharicTitle: "የወደፊት ትምህርት",
    highlight: "STAY GROWTH",
    subtitle: "ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።",
    color: "#3C83F6"
  },
  {
    url: slide3,
    title: "MASTER CRAFT",
    amharicTitle: "ጥበቡን ይለማመዱ",
    highlight: "Expertly",
    subtitle: "የቀስቃስ ስልጠናዎችን (Tutorials) መከተል ያቁሙ። ሲስተሞችን (Systems) መገንባት ይጀምሩ። ከኮደርነት ወደ ከፍተኛ የሶፍትዌር አርክቴክትነት (Senior Software Architect) ሽግግር ያድርጉ።",
    color: "#f89f29"
  }
];

export default function Landing({ heroData }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-[#f8fafc] transition-colors duration-700">
      {/* --- FULLSCREEN IMAGE WITH OVERLAY --- */}
      <div className="absolute inset-0 z-0">
        <motion.img
          key={current}
          src={slides[current].url}
          alt="hero"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover absolute inset-0"
          style={{ zIndex: 1 }}
        />
        {/* Subtle dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/40" style={{zIndex:2}} />
      </div>

      {/* --- OVERLAID CONTENT --- */}
      <div className="relative z-20 flex flex-col justify-center items-center h-screen w-full px-6">
  {/* REMOVED: bg-transparent, rounded-xl, p-8, shadow-xl, backdrop-blur-md */}
  {/* KEPT: max-w-2xl, w-full, text-center, mx-auto to maintain layout alignment */}
  <div className="max-w-4xl w-full text-center mx-auto"> 
    <motion.h1
      key={current + "title"}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-white leading-[1.05] mb-4"
    >
      {heroData?.title || slides[current].title}
      <br />
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
      className="max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed mb-10 text-slate-200"
    >
      {heroData?.subtitle || slides[current].subtitle}
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex justify-center"
    >
      <a 
        href={heroData?.cta_link || '#courses'} 
        className="flex items-center gap-3 text-white font-black text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all group bg-gradient-to-r from-[#f89f29] to-[#e07d15] px-8 py-4 rounded-full shadow-2xl shadow-orange-500/30"
      >
        <PlayCircle size={24} className="text-white group-hover:rotate-12 transition-transform" />
        {heroData?.cta_text || 'EXPLORE COURSES'}
      </a>
    </motion.div>
  </div>
</div>
    </div>
  );
}
