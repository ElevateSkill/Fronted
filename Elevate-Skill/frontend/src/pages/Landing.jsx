import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle, ChevronLeft, ChevronRight, Mouse } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
    title: "ELEVATE",
    highlight: "SKILL",
    amharicTitle: "የወደፊት ትምህርት",
    subtitle: "Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials.",
    cta: "GET STARTED",
    ctaIcon: <Sparkles size={20} />,
    color: "#3C83F6",
    gradient: "from-blue-600/30 via-transparent to-purple-600/30"
  },
  {
    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070",
    title: "YOUR",
    highlight: "JOURNEY",
    amharicTitle: "የወደፊት ጉዞ",
    subtitle: "From beginner to senior architect. Structured paths that adapt to your pace and goals.",
    cta: "EXPLORE PATHS",
    ctaIcon: <ArrowRight size={20} />,
    color: "#f89f29",
    gradient: "from-amber-600/30 via-transparent to-red-600/30"
  },
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
    title: "MASTER",
    highlight: "CRAFT",
    amharicTitle: "ጥበቡን ይለማመዱ",
    subtitle: "Industry-driven curriculum with real mentors. Code, design, deploy — master the full stack.",
    cta: "WATCH NOW",
    ctaIcon: <PlayCircle size={20} />,
    color: "#17c966",
    gradient: "from-green-600/30 via-transparent to-teal-600/30"
  }
];

export default function Landing() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const variants = {
    enter: (d) => ({ opacity: 0, x: d * 300, scale: 0.95 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d * -300, scale: 0.95 })
  };

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-[#050505] transition-colors duration-700">
      <div className="absolute inset-0 z-0">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.img
            key={current}
            src={slide.url}
            alt="hero"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} z-[1]`} />
        <div className="absolute inset-0 bg-black/45 dark:bg-black/60 z-[2]" />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-screen w-full px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current + "content"}
            custom={direction}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl w-full text-center mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: slide.color }} />
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">{slide.highlight}</span>
            </motion.div>

            <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black tracking-tight text-white leading-[1.05] mb-4">
              {slide.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                {slide.highlight}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed mb-4 text-white/60"
            >
              {slide.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm text-white/30 font-serif italic mb-10"
            >
              {slide.amharicTitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex justify-center gap-4"
            >
              <Link
                to="/register"
                className="flex items-center gap-3 text-white font-black text-xs tracking-widest uppercase hover:scale-105 active:scale-95 transition-all group px-8 py-4 rounded-full shadow-2xl"
                style={{ backgroundColor: slide.color }}
              >
                {slide.ctaIcon}
                {slide.cta}
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-bold text-xs tracking-widest uppercase transition-all">
                STUDENT PORTAL
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <button onClick={prev} className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all hover:bg-white/5">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-10' : 'w-1.5'} ${i === current ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
        <button onClick={next} className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all hover:bg-white/5">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="absolute bottom-8 right-8 z-20 text-[10px] font-bold text-white/30 tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ bottom: 'calc(12rem)' }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/30"
        >
          <Mouse size={20} />
        </motion.div>
      </motion.div>
    </div>
  );
}
