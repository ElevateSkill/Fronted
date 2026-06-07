import { motion } from 'framer-motion';
import { BookOpen, Play, Clock } from 'lucide-react';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function MyCourses({ allEnrollments, onViewCourse }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-brand-text tracking-tight">My Courses</h2>
          <p className="text-xs text-brand-muted mt-0.5">Continue learning where you left off</p>
        </div>
        {allEnrollments.length > 0 && (
          <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider px-3 py-1.5 bg-brand-card border border-brand-border rounded-lg">
            {allEnrollments.length} enrolled
          </span>
        )}
      </div>

      {allEnrollments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Enrolled courses will appear here after registration."
          action={
            <a href="/courses" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-bold text-[10px] rounded-xl hover:brightness-110 transition-all uppercase tracking-wider">
              <BookOpen size={14} /> Browse Courses
            </a>
          }
        />
      ) : allEnrollments.map((enrollment, i) => {
        const course = enrollment.course;
        const statusColor = enrollment.status === 'active' ? 'bg-green-900/30 text-green-400' :
          enrollment.status === 'completed' ? 'bg-[#EE8433]/30 text-[#EE8433]' :
          enrollment.status === 'cancelled' ? 'bg-[#D95C4A]/30 text-[#D95C4A]' : 'bg-[#3A3992]/30 text-[#3A3992]';
        return (
          <motion.div
            key={enrollment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:border-brand-primary/30 hover:shadow-sm transition-all group"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-44 h-28 md:h-auto overflow-hidden shrink-0 relative">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white">
                  {course.category || 'Course'}
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-brand-text mb-0.5">{course.title}</h3>
                    <span className={`shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColor}`}>
                      {enrollment.status}
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted mb-2">by {course.instructor || 'Instructor'}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-brand-muted mb-2">
                    <span>{course.lessons || '—'} lessons</span>
                    {course.duration && <span className="flex items-center gap-1"><Clock size={10} className="text-brand-orange" /> {course.duration}</span>}
                    {course.price && <span className="font-bold text-brand-primary">{course.price} ETB</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => onViewCourse(course)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white font-bold text-[10px] rounded-lg hover:brightness-110 transition-all w-fit shadow-sm cursor-pointer"
                  >
                    <Play size={12} /> Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
