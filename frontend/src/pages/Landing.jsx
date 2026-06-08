import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import useBackendData from '../hooks/useBackendData';
import { homepageAPI, getMediaUrl } from '../services/api';

const adaptHero = (hero) => ({
  id: 'hero',
  image: getMediaUrl(hero?.background_image) || '',
  title: hero?.title?.split(' ')[0]?.toUpperCase() || '',
  highlight: hero?.title?.split(' ').slice(1).join(' ')?.toUpperCase() || '',
  subtitle: hero?.subtitle || '',
  cta: hero?.cta_text || '',
  ctaLink: hero?.cta_link || '/register',
  color: '#EE8433',
  active: true
});

export default function Landing() {
  const { data, loading } = useBackendData(
    () => homepageAPI.get().then((r) => [adaptHero(r.hero)]),
    []
  );

  const slides = data.filter((s) => s.active !== false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading && slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 size={32} className="text-white animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white/60 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  const slide = slides[current] || slides[0];

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Ambient brand glow orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#EE8433]/15 rounded-full blur-[150px]"
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-[#5A2DA8]/15 rounded-full blur-[140px]"
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#3A3992]/10 rounded-full blur-[130px]"
          animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Hero background image with subtle overlay */}
      <div className="absolute inset-0 z-[1]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slide.image}
            alt={slide.title}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover absolute inset-0 brightness-[1.15] contrast-[1.1]"
          />
        </AnimatePresence>
        {/* Subtle bottom vignette only — no color overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-screen w-full px-6">
        <div className="max-w-5xl w-full text-center mx-auto">

          {/* Animated logo icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#3A3992] to-[#D95C4A] shadow-2xl shadow-[#3A3992]/40">
              <GraduationCap size={32} className="text-white" />
            </div>
          </motion.div>

          {/* Headline with staggered text animation */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } }
            }}
            className="text-[clamp(2.8rem,7vw,5.5rem)] font-black tracking-tight leading-[1.05] mb-4"
          >
            {slide.title.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 60, rotateX: -90 },
                  visible: { opacity: 1, y: 0, rotateX: 0 }
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-white drop-shadow-lg"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            {' '}
            <span className="bg-gradient-to-r from-[#3A3992] via-[#D95C4A] to-[#5A2DA8] bg-clip-text text-transparent drop-shadow-lg inline-block">
              {slide.highlight.split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 60, rotateX: -90 },
                    visible: { opacity: 1, y: 0, rotateX: 0 }
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Subtitle with fade + slide */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-10 text-white/90 drop-shadow-md"
          >
            {slide.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={slide.ctaLink || '/register'}
              className="flex items-center gap-3 text-white font-black text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all group bg-gradient-to-r from-[#3A3992] to-[#D95C4A] px-8 py-4 rounded-full shadow-2xl shadow-[#3A3992]/40"
            >
              <GraduationCap size={22} className="text-white group-hover:scale-110 transition-transform" />
              {slide.cta || 'Enroll Now'}
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-3 text-white font-black text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all group bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-xl"
            >
              Learn More
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-white/80 text-xs font-bold uppercase tracking-widest"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-center gap-2 drop-shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#3A3992]" /> Practical Learning
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex items-center gap-2 drop-shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#5A2DA8]" /> Expert Mentors
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex items-center gap-2 drop-shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#D95C4A]" /> Career Ready
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
