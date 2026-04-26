import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Globe, PlayCircle } from 'lucide-react';
import aman from '../assets/img/aman.png';

const slides = [
    {
    url: aman,
    title: "ELEVATE SKILL",
    amharicTitle: "የወደፊት ትምህርት",
    highlight: "Level Up",
    subtitle: "ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።",
    color: "#3C83F6"
  },
  {
    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070",
    title: "YOUR JOURNEY",
    amharicTitle: "የወደፊት ትምህርት",
    highlight: "STAY GROWTH",
    subtitle: "ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።",
    color: "#3C83F6"
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
    title: "MASTER CRAFT",
    amharicTitle: "ጥበቡን ይለማመዱ",
    highlight: "Expertly",
    subtitle: "የቀስቃስ ስልጠናዎችን (Tutorials) መከተል ያቁሙ። ሲስተሞችን (Systems) መገንባት ይጀምሩ። ከኮደርነት ወደ ከፍተኛ የሶፍትዌር አርክቴክትነት (Senior Software Architect) ሽግግር ያድርጉ።",
    color: "#f89f29"
  }
];

export default function Landing() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-[#050505] transition-colors duration-700">
      
      {/* --- BACKGROUND DYNAMICS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-30 dark:opacity-100 bg-[radial-gradient(circle_at_30%_30%,#3C83F615_0%,transparent_50%)]" />
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0] 
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-[#f89f29]/5 blur-[120px] rounded-full" 
        />
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* TEXT CONTENT */}
          <div className="text-left order-2 lg:order-1">
            <div className="relative mb-8">
                <motion.span 
                    key={current + "am"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="block text-sm font-black text-[#f89f29] mb-2 tracking-widest font-serif"
                >
                    {slides[current].amharicTitle}
                </motion.span>
                <motion.h1
                    key={current + "title"}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]"
                >
                    {slides[current].title} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3C83F6] to-blue-600">
                    {slides[current].highlight}
                    </span>
                </motion.h1>
            </div>

            <motion.p
              key={current + "sub"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg font-medium max-w-xl leading-relaxed mb-10 text-slate-500 dark:text-slate-400"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >

              <button className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-xs tracking-widest uppercase hover:opacity-70 transition-all group">
                <PlayCircle size={24} className="text-[#3C83F6] group-hover:scale-110 transition-transform" />
                WATCH
              </button>
            </motion.div>
          </div>

          {/* DYNAMIC IMAGE DISPLAY */}
          <div className="relative order-1 lg:order-2 hidden sm:block h-[300px] lg:h-[500px]">
            <AnimatePresence mode='wait'>
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.8, rotateY: 30, x: 100 }}
                animate={{ opacity: 1, scale: 1, rotateY: -10, x: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -30, x: -100 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 perspective-1000"
              >
                <div className="w-full h-full dark:bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden">
                  <img 
                    src={slides[current].url} 
                    alt="preview" 
                    className="w-full h-full object-cover rounded-4xl]"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CSS For Perspective */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}