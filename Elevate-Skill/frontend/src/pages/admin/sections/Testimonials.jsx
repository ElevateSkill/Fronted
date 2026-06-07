import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Edit3, Trash2, Plus, Search, RefreshCw, Loader2, Quote, Filter, Calendar } from 'lucide-react';
import { getMediaUrl } from '../../../services/api';
import EmptyState from '../../../components/dashboard/EmptyState';

function resolveAvatar(t) {
  const raw = t.avatar || t.student_image;
  if (!raw) return '';
  if (typeof raw !== 'string') return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('data:')) return raw;
  return getMediaUrl(raw);
}

export default function Testimonials({ testimonials, loading, onAdd, onEdit, onDelete, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return (testimonials || []).filter(t => {
      const q = search.toLowerCase();
      const matchesSearch = !q
        || (t.student_name || t.name || '').toLowerCase().includes(q)
        || (t.message || t.text || '').toLowerCase().includes(q);
      const matchesFilter = filter === 'All' ||
        (filter === 'Active' ? t.is_active : !t.is_active);
      return matchesSearch && matchesFilter;
    });
  }, [testimonials, search, filter]);

  const activeCount = (testimonials || []).filter(t => t.is_active).length;
  const inactiveCount = (testimonials || []).filter(t => !t.is_active).length;
  const avgRating = (testimonials || []).length
    ? ((testimonials || []).reduce((s, t) => s + (t.rating || 0), 0) / (testimonials || []).length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Testimonials</h2>
          <p className="text-sm text-brand-muted font-medium mt-1 flex items-center gap-3 flex-wrap">
            <span>{testimonials?.length || 0} testimonials</span>
            {testimonials?.length > 0 && (
              <>
                <span>·</span>
                <span className="text-brand-orange font-bold">★ {avgRating} avg</span>
                <span>·</span>
                <span className="text-green-400">{activeCount} active</span>
                {inactiveCount > 0 && (<><span>·</span><span className="text-gray-400">{inactiveCount} inactive</span></>)}
              </>
            )}
            {loading && <span className="inline-flex items-center gap-1 text-brand-primary"><Loader2 size={12} className="animate-spin" /> Loading...</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={onRefresh} disabled={loading} className="p-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:bg-white/5 transition-all cursor-pointer" title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
          {['All', 'Active', 'Inactive'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider cursor-pointer ${
                filter === s ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {testimonials?.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No testimonials yet"
          description="Student testimonials will appear here once added. They sync to /api/v1/admin/testimonials/."
          action={onAdd ? (
            <button onClick={onAdd} className="px-4 py-2 bg-brand-orange text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer">Add First Testimonial</button>
          ) : null}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Filter} title="No testimonials match" description="Try a different search or filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => {
            const avatar = resolveAvatar(t);
            const initials = (t.student_name || t.name || 'S').trim().charAt(0).toUpperCase();
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="rounded-2xl border border-brand-border bg-brand-card p-5 hover:border-brand-orange/30 transition-all group flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < (t.rating || 0) ? 'fill-brand-orange text-brand-orange' : 'text-gray-700'} />
                    ))}
                  </div>
                  {!t.is_active && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 uppercase tracking-wider">Inactive</span>
                  )}
                </div>
                <div className="relative mb-4 flex-1">
                  <Quote size={18} className="absolute -top-1 -left-1 text-brand-orange/30" />
                  <p className="text-sm text-gray-300 italic pl-6 line-clamp-4 leading-relaxed">"{t.message || t.text || ''}"</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-brand-border/50">
                  {avatar ? (
                    <img src={avatar} alt={t.student_name || ''} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-10 h-10 rounded-full object-cover border-2 border-brand-orange/30" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-sm">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-text truncate">{t.student_name || t.name || 'Anonymous'}</p>
                    {t.created_at && (
                      <p className="text-[10px] text-brand-muted flex items-center gap-1">
                        <Calendar size={9} /> {new Date(t.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => onEdit(t)} className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer" title="Edit"><Edit3 size={12} /></button>
                    <button onClick={() => onDelete(t.id)} className="p-1.5 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-all cursor-pointer" title="Delete"><Trash2 size={12} /></button>
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
