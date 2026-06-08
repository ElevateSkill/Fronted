import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GraduationCap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coursesAPI, homepageAPI, getMediaUrl, normalizeApiCount } from '../services/api';
import heroImg1 from '../assets/gr1.jpg';
import heroImg2 from '../assets/gr3.jpg';
import heroImg3 from '../assets/grad2.jpg';
import heroImg4 from '../assets/elevat.jpg';
import heroImg5 from '../assets/photo1.jpg';

const heroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5];

const normalizeCtaLink = (link) => {
  if (!link) return '/register';
  if (link === '/courses/' || link === '/courses') return '/#courses';
  return link;
};

const adaptHero = (hero = {}) => ({
  image: getMediaUrl(hero.background_image) || heroImg1,
  title: hero.title || 'Elevate Skill',
  subtitle: hero.subtitle || 'Project-based learning platform designed for the modern engineer. Master in-demand tech skills with real-world projects and expert mentorship.',
  cta: hero.cta_text || 'GET STARTED',
  ctaLink: normalizeCtaLink(hero.cta_link),
});

export default function Landing() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([homepageAPI.get(), coursesAPI.list()])
      .then(([home, courseRes]) => {
        if (cancelled) return;
        setData([{
          hero: adaptHero(home.hero),
          stats: [
            { label: 'Published Courses', value: normalizeApiCount(courseRes) },
            { label: 'Student Stories', value: home.testimonials?.length || 0 },
            { label: 'Helpful FAQs', value: home.faqs?.length || 0 },
          ],
        }]);
      })
      .catch(() => {
        if (cancelled) return;
        setData([{ hero: adaptHero(), stats: [] }]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const hero = data[0]?.hero || adaptHero();
  const stats = data[0]?.stats || [];

  if (loading && data.length === 0) {
    return (
      <div className="min-h-[92vh] flex items-center justify-center bg-[#0F0A3A]">
        <Loader2 size={32} className="text-white animate-spin" />
      </div>
    );
  }

  return (
    <div id="home" className="relative min-h-[92vh] w-full overflow-hidden bg-[#0F0A3A] text-white">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            alt="Graduate"
            className="h-full w-full object-cover absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        {hero.image && hero.image !== heroImages[currentSlide] && (
          <img
            src={hero.image}
            alt={hero.title}
            className="h-full w-full object-cover absolute inset-0 opacity-0 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A3A]/95 via-[#1E1B4B]/78 to-[#3A3992]/55" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F0A3A] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-28">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <GraduationCap size={16} className="text-[#FFD700]" />
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-white/80">Course Enrollment Platform</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.02] tracking-tight animate-hero-title sm:text-6xl lg:text-7xl">
              {hero.title}{' '}
              <span>works end to end.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/78 sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={hero.ctaLink}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#1E40AF] px-7 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[#FFD700]/25 transition hover:brightness-110"
              >
                {hero.cta}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

          <div className="mt-6 flex items-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentSlide ? 'w-8 bg-[#EE8433]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {stats.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/14 bg-white/[0.09] p-5 backdrop-blur-md">
                  <div className="text-3xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
