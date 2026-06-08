import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useBackendData from '../hooks/useBackendData';
import { testimonialsAPI, getMediaUrl } from '../services/api';

const safeStr = (v, fallback = '') => (v != null && typeof v !== 'object') ? String(v) : fallback;

// Backend testimonial: { id, student_name, student_image, message, rating, is_active }
const adapt = (t) => ({
  id: t.id,
  name: safeStr(t.student_name, 'Anonymous'),
  role: safeStr(t.role, 'Graduate'),
  company: safeStr(t.company),
  quote: safeStr(t.message),
  image: getMediaUrl(t.student_image) || '',
  score: t.rating || 5,
  outcome: safeStr(t.outcome, 'Verified graduate'),
  color: t.color || '#EE8433',
  is_active: t.is_active !== false
});

export default function Testimonals() {
  const { data: fetched, loading, source } = useBackendData(testimonialsAPI.active);

  const testimonials = (fetched || []).filter((t) => t.is_active !== false).map(adapt);

  if (testimonials.length === 0 && !loading) return null;

  return (
    <section id="testimonals" className="relative overflow-hidden bg-[#050816] py-20 md:py-28 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,33,182,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_28%)]" />
      <div className="absolute top-24 left-6 w-64 h-64 bg-[#5A2DA8]/10 blur-3xl" />
      <div className="absolute bottom-8 right-10 w-72 h-72 bg-[#3A3992]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EE8433]/25 bg-[#EE8433]/10 px-4 py-2 backdrop-blur">
              <Quote size={14} className="text-[#EE8433]" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#EE8433]">Testimonials</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#1565C0]">
              Real stories from people who kept going.
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-white/80 to-[#FFD700]/80">
              Every testimonial is a real graduate from our platform. Powered by the backend, always up to date.
            </p>
            {source === 'api' && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Live from /homepage/</span>
              </div>
            )}
          </div>

        </motion.div>

        {loading && testimonials.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EE8433]/10 via-transparent to-[#5A2DA8]/10" />
              <div className="relative grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
                <div className="relative overflow-hidden border border-white/10 bg-black/30 min-h-[360px]">
                  <img src={testimonials[0].image} alt={testimonials[0].name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="mb-2 flex items-center gap-1">
                      {[...Array(testimonials[0].score)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#3A3992] text-[#3A3992]" />
                      ))}
                    </div>
                    <p className="text-lg font-black tracking-tight">{testimonials[0].name}</p>
                    <p className="text-sm text-white/70">{testimonials[0].role} · {testimonials[0].company}</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <Quote size={34} className="text-[#3A3992]/70" />
                    <p className="mt-4 text-lg md:text-xl leading-relaxed text-white/85">
                      {testimonials[0].quote}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {testimonials.slice(1, 3).map((item) => (
                      <div key={item.id || item.name} className="border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="h-14 w-14 object-cover ring-2 ring-white/10" />
                          <div>
                            <p className="font-black">{item.name}</p>
                            <p className="text-xs text-white/60">{item.role}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-3">{item.quote}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-6"
            >
              {testimonials.slice(3).map((item, index) => (
                <motion.article
                  key={item.id || item.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="group border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover ring-2 ring-white/10" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(item.score)].map((_, i) => (
                          <Star key={i} size={12} className="fill-[#3A3992] text-[#3A3992]" />
                        ))}
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white">{item.name}</h3>
                      <p className="mt-1 text-sm font-medium text-white/65">{item.role} · {item.company}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">{item.quote}</p>
                </motion.article>
              ))}

              <div className="border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#3A3992]">Next step</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Ready to write your own story?</h3>
                  </div>
                  <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D95C4A] to-[#3A3992] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#5A2DA8]/20 transition-transform hover:scale-[1.02]">
                    Join now
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
