import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code2, Palette, BrainCircuit, Rocket, Clock, User, ArrowRight, Loader2, GraduationCap, Zap, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useBackendData from '../hooks/useBackendData';
import { coursesAPI, getMediaUrl } from '../services/api';

const iconMap = { Code2, Palette, BrainCircuit, Rocket };
const IconComp = (name) => {
  const C = iconMap[name];
  return C ? <C size={28} /> : <BookOpen size={28} />;
};

// Category → icon + color mapping
const categoryMeta = {
  'Web Development': { icon: 'Code2', color: '#3A3992' },
  'UI/UX Design':    { icon: 'Palette', color: '#D95C4A' },
  'AI & Machine Learning': { icon: 'BrainCircuit', color: '#5A2DA8' },
  'Cloud & DevOps':  { icon: 'Rocket', color: '#EE8433' },
};

// Brand yellow used in the logo / hero shimmer — keeps course titles visible on the dark card gradient
const TITLE_YELLOW = '#FFD700';

const safeStr = (v, fallback = '') => (v != null && typeof v !== 'object') ? String(v) : fallback;

const adapt = (c) => {
  const catName = safeStr(typeof c.category === 'object' ? c.category?.name : c.category, 'General');
  const meta = categoryMeta[catName] || {};
  return {
    id: c.id,
    title: safeStr(c.title),
    desc: safeStr(c.short_description),
    category: catName,
    image: getMediaUrl(c.thumbnail) || '',
    instructor: safeStr(c.instructor, 'Staff'),
    duration: safeStr(c.duration, 'Self-paced'),
    lessons: c.lessons || 0,
    color: meta.color || '#EE8433',
    price: typeof c.price === 'string' ? c.price : (c.price ? `${c.price} ETB` : 'Free'),
    icon: meta.icon || 'Code2',
  };
};

export default function Courses() {
  const navigate = useNavigate();
  const { data: courses, loading, source } = useBackendData(
    () => coursesAPI.list(),
    []
  );

  const list = (courses || []).map(adapt);

  const handleEnroll = (courseId) => {
    navigate(`/register?courseId=${courseId}`);
  };

  return (
    <div id="courses" className="relative w-full bg-gradient-to-br from-[#1a1150] via-[#0f0a3a] to-[#0a0625]    py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#EE8433]/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#3A3992]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#5A2DA8]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#3A3992]" />
            <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs">Our Programs</span>
            <span className="h-[2px] w-12 bg-[#3A3992]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A3992] to-[#EE8433]">Path</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm mt-3 max-w-xl mx-auto"
          >
            Industry-driven curriculum designed to take you from beginner to job-ready professional.
          </motion.p>
          {source === 'api' && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 ">Live from /courses/</span>
            </div>
          )}
        </div>

        {loading && list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={36} className="text-[#EE8433] animate-spin" />
            <p className="text-white/50 text-sm font-medium">Loading courses...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
              <SearchX size={40} className="text-white/30" />
            </div>
            <p className="text-white/60 text-sm font-bold">No courses available yet.</p>
            <p className="text-white/40 text-xs max-w-sm text-center">Courses are being prepared. Check back soon or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {list.map((course, i) => (
              <motion.div
                key={course.id || course.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-white/[0.08] border border-white/[0.15] overflow-hidden hover:border-[#3A3992]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3A3992]/20 backdrop-blur-sm"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1150]/90 via-[#1a1150]/30 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-[#3A3992] to-[#D95C4A] backdrop-blur rounded-lg text-[10px] font-black text-white shadow-lg shadow-[#3A3992]/30 uppercase tracking-wider">{course.category}</div>
                  {course.icon && (
                    <div className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-xl rounded-xl shadow-lg border border-white/20" style={{ color: course.color || '#3A3992' }}>
                      {IconComp(course.icon)}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    {/* Course title — bright yellow to match logo / brand accent and stay readable on the dark gradient overlay */}
                    <h3
                      className="text-lg font-black mb-1 line-clamp-1 drop-shadow-lg"
                      style={{ color: TITLE_YELLOW, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                    >
                      {course.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4">
                    <p className="text-xs text-white/60 leading-relaxed">{course.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 ">
                      <User size={12} className="text-[#3A3992]" /> {course.instructor}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 ">
                      <Clock size={12} className="text-[#3A3992]" /> {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/50 ">
                      <BookOpen size={12} className="text-[#5A2DA8]" /> {course.lessons} lessons
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xl font-black text-[#3A3992] drop-shadow-lg">{course.price}</span>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3A3992] to-[#D95C4A] text-white font-black text-[11px] rounded-xl hover:from-[#D95C4A] hover:to-[#3A3992] transition-all uppercase tracking-wider shadow-lg shadow-[#3A3992]/40 hover:shadow-[#3A3992]/60 hover:scale-105 active:scale-95"
                    >
                      <GraduationCap size={14} />
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bold Enrollment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3A3992] via-[#D95C4A] to-[#5A2DA8] p-10 md:p-14 text-center shadow-2xl shadow-[#3A3992]/30">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[length:8px_8px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#5A2DA8]/30 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                <Zap size={16} className="text-white" />
                <span className="text-white text-xs font-black uppercase tracking-widest">Limited Spots Available</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">
                Ready to Start Your Journey?
              </h3>
              <p className="text-white/80 text-sm max-w-lg mx-auto mb-8">
                Join thousands of learners building real-world skills. Enroll today and transform your career.
              </p>
              <button
                onClick={() => handleEnroll(list[0]?.id || '')}
                className="px-10 py-4 bg-white text-[#3A3992] font-black text-sm rounded-2xl hover:bg-white/90 transition-all uppercase tracking-wider flex items-center gap-3 mx-auto shadow-2xl hover:scale-105 active:scale-95"
              >
                <GraduationCap size={18} />
                Enroll Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
