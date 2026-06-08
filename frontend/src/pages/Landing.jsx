import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { coursesAPI, homepageAPI, getMediaUrl, normalizeApiCount } from '../services/api';
import heroImage from '../assets/photo_2026-06-07_22-56-48.jpg';

const normalizeCtaLink = (link) => {
  if (!link) return '/register';
  if (link === '/courses/' || link === '/courses') return '/#courses';
  return link;
};

const adaptHero = (hero = {}) => ({
  image: getMediaUrl(hero.background_image) || heroImage,
  title: hero.title || 'Elevate Skill',
  subtitle: hero.subtitle || 'Explore practical courses, register online, and track your enrollment from your student dashboard.',
  cta: hero.cta_text || 'Start Enrollment',
  ctaLink: normalizeCtaLink(hero.cta_link),
});

export default function Landing() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <img
          src={hero.image}
          alt={hero.title}
          className="h-full w-full object-cover"
        />
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
              <GraduationCap size={16} className="text-[#EE8433]" />
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-white/80">Course Enrollment Platform</span>
            </div>

            <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#EE8433] via-[#D95C4A] to-[#5A2DA8] sm:text-6xl lg:text-7xl">
              {hero.title}{' '}
              <span>works end to end.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/78 sm:text-lg">
              {hero.subtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={hero.ctaLink}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#EE8433] px-7 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[#EE8433]/25 transition hover:bg-[#D95C4A]"
              >
                {hero.cta}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>

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
