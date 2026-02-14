import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Pause, Play, Star } from 'lucide-react';

const stories = [
  {
    id: 1,
    name: "Dawit Mekonnen",
    role: "Senior Fullstack Engineer",
    company: "Addis Tech Hub",
    story: "The transition from finance to tech seemed impossible until I joined Elevate. The practical, project-based approach didn't just teach me syntax; it taught me how to architect complex systems. I doubled my salary in six months.",
    tags: ["Career Pivot", "High Growth"],
    color: "#15c8fb"
  },
  {
    id: 2,
    name: "Selamawit Bekele",
    role: "UI/UX Lead",
    company: "Creative Flow Agency",
    story: "Most courses focus on tools, but here I learned the psychology of design. The feedback from world-class mentors helped me build a portfolio that landed me a lead role at a top European startup.",
    tags: ["Design Lead", "Mentorship"],
    color: "#17c966"
  },
  {
    id: 3,
    name: "Abenezer Lemma",
    role: "AI Researcher",
    company: "Neural Systems",
    story: "While others were talking about AI, we were building LLM integrations. The curriculum is consistently six months ahead of the industry. It’s the only platform that keeps up with the speed of silicon valley.",
    tags: ["AI Integration", "Innovation"],
    color: "#15c8fb"
  }
];

export default function Stories() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % stories.length);
    setProgress(0);
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + stories.length) % stories.length);
    setProgress(0);
  };

  // Handle Autoplay & Progress Bar
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + 0.5; // Controls the speed of the progress bar
        });
      }, 30); // 3 seconds per slide roughly
    }
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 transition-colors duration-500 dark:bg-charcoal bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#17c966] font-mono tracking-[0.3em] text-sm mb-4 uppercase"
            >
              Success Stories
            </motion.h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter dark:text-white text-slate-900 leading-none">
              REAL RESULTS FROM <br /> 
              <span className="dark:text-white/20 text-slate-300 italic">OUR COMMUNITY</span>
            </h3>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex gap-2 mb-4">
            {stories.map((_, i) => (
              <div 
                key={i} 
                className="h-1 w-12 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden"
              >
                {index === i && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#15c8fb]"
                  />
                )}
                {i < index && <div className="h-full w-full bg-[#17c966]" />}
              </div>
            ))}
          </div>
        </div>

        {/* --- MAIN STORY CARD --- */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Content Area */}
          <div 
            className="lg:col-span-7 order-2 lg:order-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="space-y-8"
              >
                <Quote size={60} className="text-[#15c8fb] opacity-50" />
                
                <p className="text-2xl md:text-4xl font-medium leading-tight dark:text-white text-slate-800 italic">
                  "{stories[index].story}"
                </p>

                <div className="flex flex-wrap gap-3">
                  {stories[index].tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full border dark:border-white/10 border-slate-200 dark:text-white/60 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-8 border-t dark:border-white/5 border-slate-200 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#15c8fb] to-[#17c966] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#15c8fb]/20">
                    {stories[index].name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black dark:text-white text-slate-900">{stories[index].name}</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stories[index].role} @ {stories[index].company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Visual Element / Controls */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-200 dark:bg-white/5 border dark:border-white/10 border-slate-200 group">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="absolute w-64 h-64 bg-[#15c8fb]/20 blur-[100px] animate-pulse" />
                 <Star size={120} className="text-[#15c8fb] opacity-20 group-hover:rotate-45 transition-transform duration-1000" />
              </div>

              {/* Navigation Controls */}
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center z-20">
                <button 
                  onClick={prevSlide}
                  className="p-4 rounded-2xl bg-white dark:bg-charcoal dark:text-white text-slate-900 shadow-xl hover:scale-110 transition-transform"
                >
                  <ChevronLeft />
                </button>
                
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-4 rounded-full bg-[#15c8fb] text-white shadow-xl shadow-[#15c8fb]/30 hover:scale-110 transition-transform"
                >
                  {isPaused ? <Play fill="white" /> : <Pause fill="white" />}
                </button>

                <button 
                  onClick={nextSlide}
                  className="p-4 rounded-2xl bg-white dark:bg-charcoal dark:text-white text-slate-900 shadow-xl hover:scale-110 transition-transform"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Background Accents */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#17c966]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#15c8fb]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}