import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle, ChevronLeft, ChevronRight, Mouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroMain from '../assets/elevat.jpg';
import slide1 from '../assets/gr1.jpg';
import slide2 from '../assets/gr3.jpg';
import slide3 from '../assets/grad2.jpg';
import { loadData } from '../data/dataStore';

const localImages = { heroMain, slide1, slide2, slide3 };

function buildSlides() {
  const stored = loadData('heroSlides');
  if (stored && stored.length > 0) {
    return stored.map((s, i) => ({
      url: s.image?.startsWith('data:') || s.image?.startsWith('http') ? s.image : localImages[`slide${(i % 3) + 1}`] || heroMain,
      title: s.title || 'ELEVATE',
      highlight: s.highlight || 'YOUR SKILL',
      amharicTitle: s.amharicTitle || '',
      subtitle: s.subtitle || '',
      cta: s.cta || 'GET STARTED',
      ctaIcon: <Sparkles size={20} />,
      color: s.color || '#15c8fb',
      gradient: 'from-cyan-700/40 via-black/20 to-orange-700/40'
    }));
  }
  return [
    {
      url: heroMain, title: "Modern Front-End", highlight: "Development with React & TypeScript",
      amharicTitle: "ክህሎትህን ከፍ አድርግ",
      subtitle: "Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials.",
      cta: "GET STARTED", ctaIcon: <Sparkles size={20} />, color: "#15c8fb",
      gradient: "from-cyan-700/40 via-black/20 to-orange-700/40"
    },
    {
      url: slide1, title: "YOUR", highlight: "JOURNEY",
      amharicTitle: "የወደፊት ጉዞ",
      subtitle: "From beginner to senior architect. Structured paths that adapt to your pace and goals.",
      cta: "EXPLORE PATHS", ctaIcon: <ArrowRight size={20} />, color: "#f89f29",
      gradient: "from-amber-700/40 via-black/20 to-red-700/40"
    },
    {
      url: slide2, title: "MASTER", highlight: "CRAFT",
      amharicTitle: "ጥበቡን ይለማመዱ",
      subtitle: "Industry-driven curriculum with real mentors. Code, design, deploy — master the full stack.",
      cta: "WATCH NOW", ctaIcon: <PlayCircle size={20} />, color: "#15c8fb",
      gradient: "from-cyan-700/40 via-black/20 to-orange-700/40"
    },
    {
      url: slide3, title: "BUILD", highlight: "FUTURE",
      amharicTitle: "የወደፊቱን ይገንቡ",
      subtitle: "Real-world projects, expert mentorship, and a community that pushes you forward.",
      cta: "JOIN NOW", ctaIcon: <ArrowRight size={20} />, color: "#f89f29",
      gradient: "from-amber-700/40 via-black/20 to-red-700/40"
    }
  ];
}

const slides = buildSlides();

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
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-black transition-colors duration-700">
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
        <div className="absolute inset-0 bg-black/70 z-[2]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] bg-[length:12px_12px] z-[2]" />
        <motion.div
          animate={{
            boxShadow: [
              "inset 0 0 150px rgba(0,0,0,0.6), inset 0 0 400px rgba(0,0,0,0.3)",
              "inset 0 0 250px rgba(0,0,0,0.8), inset 0 0 500px rgba(0,0,0,0.4)",
              "inset 0 0 150px rgba(0,0,0,0.6), inset 0 0 400px rgba(0,0,0,0.3)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-[2] pointer-events-none"
        />
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-8 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slide.color }} />
              <span className="text-xs font-bold text-white uppercase tracking-[0.25em]">{slide.highlight}</span>
            </motion.div>

            <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black tracking-tight text-white leading-[1.05] mb-4 drop-shadow-2xl [text-shadow:0_4px_40px_rgba(0,0,0,0.6)]">
              {slide.title}
              <br />
              <span className="bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:0_4px_40px_rgba(0,0,0,0.6)]">
                {slide.highlight}
              </span>
            </h1>

            {/* <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed mb-5 text-white/90 drop-shadow-lg [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]"
            >
              {slide.subtitle}
            </motion.p> */}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-sm text-white/70 font-serif italic mb-10 drop-shadow-md [text-shadow:0_2px_15px_rgba(0,0,0,0.4)]"
            >
              {slide.amharicTitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                to="/register"
                className="flex items-center gap-3 text-white font-black text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all group px-10 py-4 rounded-full shadow-2xl shadow-black/40"
                style={{ backgroundColor: slide.color }}
              >
                {slide.ctaIcon}
                {slide.cta}
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white/90 hover:text-white hover:border-white/60 font-bold text-sm tracking-widest uppercase transition-all shadow-xl shadow-black/30 bg-white/10 backdrop-blur-md">
                STUDENT PORTAL
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="p-3 rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all bg-white/10 backdrop-blur shadow-xl shadow-black/30"
        >
          <ChevronLeft size={20} />
        </motion.button>
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-500 drop-shadow-lg ${i === current ? 'w-12 bg-white shadow-lg shadow-white/30' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="p-3 rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all bg-white/10 backdrop-blur shadow-xl shadow-black/30"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div> */}

      {/* <div className="absolute bottom-8 right-8 z-20 text-xs font-bold text-white/60 tracking-widest drop-shadow-lg">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ bottom: 'calc(12rem)' }}
      >
        {/* <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/60 drop-shadow-lg"
        >
          <Mouse size={20} />
        </motion.div> */}
      </motion.div>
    </div>
  );
}
