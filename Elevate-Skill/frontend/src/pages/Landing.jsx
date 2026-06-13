import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import heroMain from '../assets/elevat.jpg';
import slide2 from '../assets/gr3.jpg';
import slide3 from '../assets/grad2.jpg';
import { getMediaUrl } from '../services/api';

const defaultSlides = [
  {
    url: heroMain,
    title: 'ELEVATE SKILL',
    subtitle: 'ELEVATE የተጠቃሚ ምቹ ተሞክሮን ለመስጠትና ከፍተኛ ደረጃ ያለው የመስመር ላይ ስልጠናን ለማቅረብ በጥንቃቄ የተነደፈ ነው።',
    cta_text: 'Explore Courses',
    cta_link: '/courses/',
  },
  {
    url: slide2,
    title: 'YOUR JOURNEY',
    subtitle: 'Build real-world skills with project-based learning.',
    cta_text: 'Get Started',
    cta_link: '/register/',
  },
  {
    url: slide3,
    title: 'MASTER CRAFT',
    subtitle: 'Transform from coder to senior software architect.',
    cta_text: 'Learn More',
    cta_link: '/about/',
  },
];

function SlideIndicator({ total, current, onClick }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onClick(i)}
          className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`} />
      ))}
    </div>
  );
}

export default function Landing({ heroData }) {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    if (heroData?.title) {
      const apiSlide = {
        url: heroData.background_image ? getMediaUrl(heroData.background_image) : heroMain,
        title: heroData.title,
        subtitle: heroData.subtitle || '',
        cta_text: heroData.cta_text || 'Explore Courses',
        cta_link: heroData.cta_link || '/courses/',
      };
      setSlides([apiSlide, ...defaultSlides]);
    }
  }, [heroData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = useCallback((i) => setCurrent(i), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length]);
  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);

  const handleCTA = useCallback(() => {
    const target = document.getElementById('courses');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '#courses');
    }
  }, []);

  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background with image crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slides[current].url}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#15c8fb]/10 via-transparent to-[#f89f29]/10 z-[1]" />
      </div>

      {/* Navigation arrows */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
        <ChevronLeft size={22} />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
        <ChevronRight size={22} />
      </button>

      {/* Slide indicators */}
      <SlideIndicator total={slides.length} current={current} onClick={goTo} />

      {/* Content */}
      <div className="relative z-20 flex h-screen w-full items-center justify-center px-6">
        <div className="mx-auto max-w-4xl w-full text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-white leading-[1.05] mb-6">
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {slides[current].title}
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10 text-gray-300">
                {slides[current].subtitle}
              </p>
              <button
                onClick={handleCTA}
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#f9a215] to-[#ef430f] px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-orange-500/20 transition-all hover:scale-105 hover:shadow-orange-500/40 active:scale-95"
              >
                <PlayCircle size={24} className="transition-transform group-hover:rotate-12" />
                {slides[current].cta_text || 'VIEW PROGRAMS'}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
