import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, GraduationCap, BookOpen, Users, Target, Award, Star, Shield, Zap, CheckCircle, ChevronRight, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoJpg from '../assets/logo.jpg';
import { coursesAPI, homepageAPI, getMediaUrl, normalizeApiCount } from '../services/api';
import heroImg1 from '../assets/gr1.jpg';
import heroImg2 from '../assets/gr3.jpg';
import heroImg3 from '../assets/grad2.jpg';
import heroImg4 from '../assets/elevat.jpg';
import heroImg5 from '../assets/photo1.jpg';

const fallbackHeroImages = [heroImg1, heroImg2, heroImg3, heroImg4, heroImg5];

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

  const hero = data[0]?.hero || adaptHero();
  const about = data[0]?.about || null;
  const stats = data[0]?.stats || [];

  // Build the slide deck: if the admin supplied a hero image, put it FIRST so
  // any pasted link (e.g. GitHub) actually appears in the slideshow.
  // The getMediaUrl() helper already converts github.com/.../blob/... URLs
  // into raw.githubusercontent.com URLs so the <img> can load the binary.
  const heroImages = hero.image
    ? [hero.image, ...fallbackHeroImages]
    : fallbackHeroImages;

  useEffect(() => {
    let cancelled = false;
    Promise.all([homepageAPI.get(), coursesAPI.list()])
      .then(([home, courseRes]) => {
        if (cancelled) return;
        setData([{
          hero: adaptHero(home.hero),
          about: home.about || null,
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
  }, [heroImages.length]);

  // Keep the slide index in range if the deck length changes (e.g. hero image
  // loaded after the fallback-only deck was created).
  useEffect(() => {
    if (currentSlide >= heroImages.length) setCurrentSlide(0);
  }, [heroImages.length, currentSlide]);

  if (loading && data.length === 0) {
    return (
      <div className="min-h-[92vh] flex items-center justify-center bg-[#0F0A3A]">
        <Loader2 size={32} className="text-white animate-spin" />
      </div>
    );
  }

  return (
    <main>
    <div id="home" className="relative min-h-[92vh] w-full overflow-hidden bg-[#0F0A3A] text-white">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide]}
            alt={currentSlide === 0 && hero.image ? hero.title : 'Graduate'}
            className="h-full w-full object-cover absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            // If the image (e.g. a GitHub URL) fails to load, fall back to a local hero.
            onError={(e) => {
              if (e.currentTarget.dataset.fallback !== '1') {
                e.currentTarget.dataset.fallback = '1';
                e.currentTarget.src = heroImg1;
              }
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A3A]/70 via-[#1E1B4B]/50 to-[#3A3992]/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0F0A3A] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-28">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-2 backdrop-blur">
              <img src={logoJpg} alt="Elevate" className="h-8 w-auto rounded-lg ring-1 ring-white/20" />
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

      {/* Full Description / About Section */}
      {about && about.content && (
        <section className="relative bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-[#3A3992]/20 bg-[#3A3992]/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#3A3992]">
                  <Info size={14} /> About Us
                </span>
                <h2 className="mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                  {about.title || 'Who We Are'}
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
                  {about.content.split('\n').map((paragraph, i) => (
                    paragraph.trim() && <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3A3992] to-[#5A2DA8] px-7 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[#3A3992]/25 transition hover:brightness-110">
                    Get Started <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative"
              >
                {about.image ? (
                  <img src={getMediaUrl(about.image)} alt={about.title} className="w-full rounded-3xl shadow-2xl" />
                ) : (
                  <div className="aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-[#3A3992]/10 via-[#FFD700]/10 to-[#EE8433]/10 flex items-center justify-center">
                    <GraduationCap size={80} className="text-[#3A3992]/30" />
                  </div>
                )}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#3A3992]/10 text-[#3A3992]"><Award size={24} /></div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">{stats[0]?.value || 0}+</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Courses</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="relative bg-[#0F0A3A] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B4B] to-[#0F0A3A]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3A3992]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#EE8433]/10 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/80">
              <Zap size={14} className="text-[#FFD700]" /> Why Choose Us
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Built for <span className="text-[#FFD700]">Your Success</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60">
              Everything you need to accelerate your career with project-based learning and expert guidance.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BookOpen, title: 'Project-Based Learning', desc: 'Build real-world projects that showcase your skills to employers. Learn by doing, not just watching.' },
              { icon: Users, title: 'Expert Mentorship', desc: 'Get personalized guidance from industry professionals who have years of hands-on experience.' },
              { icon: Target, title: 'Structured Curriculum', desc: 'Follow a carefully designed learning path that takes you from beginner to job-ready professional.' },
              { icon: Shield, title: 'Lifetime Access', desc: 'Own your learning forever. Revisit course materials anytime, even after completion.' },
              { icon: Star, title: 'Industry Recognition', desc: 'Earn certificates that are recognized by top employers and boost your professional profile.' },
              { icon: Zap, title: 'Flexible Schedule', desc: 'Learn at your own pace with on-demand video lessons, downloadable resources, and 24/7 access.' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm hover:bg-white/[0.08] hover:border-[#FFD700]/30 transition-all"
              >
                <div className="mb-5 inline-flex p-3 rounded-xl bg-[#FFD700]/10 text-[#FFD700] group-hover:scale-110 transition-transform">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A3992] via-[#5A2DA8] to-[#EE8433] p-12 lg:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-3xl" />
            <div className="relative">
              <GraduationCap size={48} className="mx-auto text-[#FFD700]" />
              <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Ready to Elevate Your Skills?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join thousands of learners already building their future. Start your journey today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#FFD700] px-8 py-4 text-sm font-black uppercase tracking-widest text-[#0F0A3A] shadow-xl shadow-[#FFD700]/25 transition hover:brightness-110">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/courses" className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/30 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-white/10">
                  Browse Courses
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
