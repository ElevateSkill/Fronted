import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit3, Trash2, Plus, Search, RefreshCw, Loader2, Filter } from 'lucide-react';
import { getMediaUrl } from '../../../services/api';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import LoadingSpinner from '../../../components/dashboard/LoadingSpinner';
import EmptyState from '../../../components/dashboard/EmptyState';

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600';

function resolveThumb(c) {
  if (!c) return FALLBACK_THUMB;
  if (!c.thumbnail && !c.image) return FALLBACK_THUMB;
  const raw = c.thumbnail || c.image;
  if (!raw) return FALLBACK_THUMB;
  if (typeof raw !== 'string') return FALLBACK_THUMB;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('data:')) return raw;
  return getMediaUrl(raw);
}

export default function Courses({ courses, loading, onAdd, onEdit, onDelete, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    return (courses || []).filter(c => {
      const q = search.toLowerCase();
      const matchesSearch = !q
        || (c.title || '').toLowerCase().includes(q)
        || (c.instructor || '').toLowerCase().includes(q)
        || (c.category || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || (c.status || '') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [courses, search, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Courses</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">
            {courses.length} courses available
            {loading && <span className="ml-2 inline-flex items-center gap-1 text-brand-primary"><Loader2 size={12} className="animate-spin" /> Loading...</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={onRefresh} disabled={loading} className="p-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:bg-white/5 transition-all cursor-pointer" title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by title, instructor or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
          {['All', 'Active', 'Draft', 'Inactive'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider cursor-pointer ${
                statusFilter === s ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading courses..." />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course to get started. Courses sync to /api/v1/admin/courses/."
          action={onAdd ? (
            <button onClick={onAdd} className="px-4 py-2 bg-brand-primary text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer">Create Course</button>
          ) : null}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Filter} title="No courses match your search" description="Try adjusting the search or filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => {
            const courseStatus = course.is_active
              ? (course.is_published ? 'Active' : 'Draft')
              : 'Inactive';
            const courseCategory = typeof course.category === 'object' && course.category
              ? course.category.name
              : (course.category || '');
            const courseThumb = resolveThumb(course);
            const coursePrice = course.price !== undefined && course.price !== null && course.price !== ''
              ? (course.price.toString().includes('ETB') ? course.price : `${Number(course.price).toLocaleString()} ETB`)
              : '';
            const courseDesc = course.short_description || course.description || '';
            const courseStudents = course.students || course.enrolled_count || 0;
            const courseLessons = course.lessons || 0;
            return (
              <motion.div
                key={course.id || course.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:border-brand-primary/30 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="h-40 overflow-hidden relative bg-black/40">
                  <img
                    src={courseThumb}
                    alt={course.title}
                    onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3"><StatusBadge status={courseStatus} /></div>
                  {coursePrice && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-black">
                      {coursePrice}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-brand-text mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">{course.title}</h3>
                  {courseCategory && <p className="text-xs text-brand-muted mb-1">{courseCategory}</p>}
                  {course.instructor && <p className="text-[10px] text-gray-500 mb-1">by {course.instructor}</p>}
                  {courseDesc && <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{courseDesc}</p>}
                  <div className="flex items-center gap-3 text-xs text-brand-muted mb-3 flex-wrap">
                    <span className="inline-flex items-center gap-1"><span className="text-brand-primary font-bold">{courseStudents}</span> students</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><span className="text-brand-primary font-bold">{courseLessons}</span> lessons</span>
                    {course.duration && (<><span>·</span><span>{course.duration}</span></>)}
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-brand-border/50">
                    <button
                      onClick={() => onEdit(course)}
                      className="flex-1 py-2.5 border border-brand-primary/30 text-brand-primary font-bold text-xs rounded-xl hover:bg-brand-primary hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                    <button onClick={() => onEdit(course)} className="p-2.5 rounded-xl border border-brand-border text-brand-muted hover:bg-white/5 transition-all cursor-pointer" title="View">
                      <BookOpen size={14} />
                    </button>
                    <button onClick={() => onDelete(course.id)} className="p-2.5 rounded-xl border border-brand-border text-[#D95C4A]/70 hover:bg-red-900/20 hover:text-[#D95C4A] transition-all cursor-pointer" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
