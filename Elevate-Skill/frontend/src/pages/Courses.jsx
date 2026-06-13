import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, ArrowRight, ChevronRight, Award, Loader, CheckCircle } from 'lucide-react';
import { api, unwrapResults, getMediaUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const colorMap = ['#dc2626', '#f89f29', '#17c966', '#dc2626'];
const levelMap = ['Beginner to Advanced', 'All Levels', 'Intermediate', 'Intermediate'];

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollSuccessId, setEnrollSuccessId] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/courses/')
      .then(res => {
        const data = unwrapResults(res.data);
        setCourses(data.map((c, i) => ({
          id: c.id,
          title: c.title,
          category: c.category?.name || c.category || '',
          desc: c.short_description || '',
          image: getMediaUrl(c.thumbnail) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
          students: c.enrolled_count || 0,
          duration: c.duration ? `${c.duration}h` : '',
          lessons: c.lessons || 0,
          level: levelMap[i % levelMap.length],
          color: colorMap[i % colorMap.length],
          price: c.price ? `${c.price} ETB` : '',
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (course) => {
    if (!user) {
      navigate(`/register?courseId=${course.id || ''}`);
      return;
    }
    setEnrollingId(course.id || course.title);
    try {
      await api.post('/enrollments/', { course: course.id });
      setEnrollSuccessId(course.id || course.title);
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.course?.[0] || err?.response?.data?.detail || 'Failed to enroll';
      alert(msg);
    } finally {
      setEnrollingId(null);
    }
  };
  return (
    <div id="courses" className="relative w-full bg-black py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#dc2626]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#f89f29]" />
            <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-xs">Our Programs</span>
            <span className="h-[2px] w-12 bg-[#f89f29]" />
          </motion.div> */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            CHOOSE YOUR PROGRAM{' '}
            {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a2ba0] to-[#f27821]">Path</span> */}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm mt-3 max-w-xl mx-auto"
          >
            Industry-driven curriculum designed to take you from beginner to job-ready professional.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-0 overflow-hidden animate-pulse">
                <div className="h-44 bg-white/10" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <BookOpen size={56} className="mb-4 opacity-30" />
            <p className="text-lg font-bold">No courses available yet</p>
            <p className="text-sm mt-1">Check back later for new programs.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.id || course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/5 border border-white/10 overflow-hidden hover:border-[#f89f29]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#dc2626]/5"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">{course.category}</div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-black text-white mb-2 group-hover:text-[#dc2626] transition-colors leading-tight">{course.title}</h3>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed line-clamp-2">{course.desc}</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <Users size={13} className="text-cyan-400 shrink-0" /> {course.students || '—'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <Clock size={13} className="text-amber-400 shrink-0" /> {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <BookOpen size={13} className="text-cyan-400 shrink-0" /> {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
                    <Award size={13} className="text-amber-400 shrink-0" /> {course.level}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xl font-black text-white block leading-none">{course.price}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{course.lessons > 1 ? `${course.lessons} lessons` : ''}</span>
                  </div>
                  <button
                    onClick={() => handleEnroll(course)}
                    disabled={enrollingId === (course.id || course.title)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#dc2626] to-[#f89f29] text-white font-black text-[10px] hover:brightness-110 transition-all duration-300 uppercase tracking-wider shadow-md disabled:opacity-50"
                  >
                    {enrollSuccessId === (course.id || course.title) ? (
                      <><CheckCircle size={13} /> Enrolled</>
                    ) : enrollingId === (course.id || course.title) ? (
                      <><Loader size={13} className="animate-spin" /> Enrolling</>
                    ) : (
                      <><ChevronRight size={13} /> Enroll</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <button className="px-10 py-4 bg-gradient-to-r from-[#dc2626] to-[#f89f29] text-white font-black text-xs hover:brightness-110 transition-all duration-300 uppercase tracking-wider flex items-center gap-3 mx-auto shadow-2xl shadow-[#f89f29]/20 hover:shadow-[#dc2626]/20 hover:scale-105 active:scale-95">
            View All Programs <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
