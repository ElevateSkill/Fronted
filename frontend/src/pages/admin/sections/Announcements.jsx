import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Sparkles, Trash2, Edit3, Eye, EyeOff, X, Check, Loader2, Pin, Plus, Calendar, User as UserIcon } from 'lucide-react';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function Announcements({ announcements, loading, onRefresh, onAdd, onEdit, onDelete, onTogglePublish }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !body) return;
    setSubmitting(true);
    try {
      await onAdd({ title, content: body });
      setTitle('');
      setBody('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    if (!editTitle || !editBody) return;
    setSubmitting(true);
    try {
      await onEdit(editId, { title: editTitle, content: editBody });
      setShowEdit(false);
      setEditId(null);
      setEditTitle('');
      setEditBody('');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (a) => {
    setEditId(a.id);
    setEditTitle(a.title);
    setEditBody(a.body || a.content || '');
    setShowEdit(true);
  };

  const publishedCount = (announcements || []).filter(a => a.is_published).length;
  const draftCount = (announcements || []).length - publishedCount;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Announcements</h2>
          <p className="text-sm text-brand-muted font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span>{announcements?.length || 0} total</span>
            <span className="w-1 h-1 rounded-full bg-brand-orange" />
            <span className="text-brand-orange font-bold">{publishedCount} published</span>
            {draftCount > 0 && (<><span className="w-1 h-1 rounded-full bg-brand-muted" /><span className="text-brand-muted">{draftCount} draft</span></>)}
            {loading && <span className="inline-flex items-center gap-1 text-brand-primary ml-2"><Loader2 size={12} className="animate-spin" /> Loading...</span>}
          </p>
        </div>
        {onRefresh && (
          <button onClick={onRefresh} disabled={loading} className="self-start sm:self-auto p-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:bg-brand-primary/15 transition-all cursor-pointer" title="Refresh">
            <Loader2 size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-brand-orange/30 bg-gradient-to-br from-brand-orange/10 via-brand-primary/5 to-brand-card p-5 space-y-4"
      >
        <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-gradient-orange flex items-center justify-center text-white">
            <Megaphone size={18} />
          </div>
          New Announcement
        </h3>
        <input
          placeholder="Announcement title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm font-semibold focus:outline-none brand-focus placeholder:text-brand-muted/60"
        />
        <textarea
          placeholder="Write your announcement..."
          rows={4}
          value={body}
          onChange={e => setBody(e.target.value)}
          className="w-full px-4 py-3 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none brand-focus placeholder:text-brand-muted/60 resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting || !title || !body}
            className="px-6 py-3 bg-brand-gradient-orange text-white font-black text-xs rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-orange/30 cursor-pointer"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {submitting ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </div>
      </motion.div>

      {/* Edit Panel */}
      <motion.div
        initial={false}
        animate={showEdit ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        {showEdit && (
          <div className="rounded-2xl border-2 border-brand-primary/40 bg-gradient-to-br from-brand-primary/10 to-brand-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center text-white">
                  <Edit3 size={18} />
                </div>
                Edit Announcement
              </h3>
              <button onClick={() => setShowEdit(false)} className="p-1.5 rounded-lg hover:bg-brand-red/15 text-brand-muted hover:text-brand-red transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <input
              placeholder="Announcement title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm font-semibold focus:outline-none brand-focus placeholder:text-brand-muted/60"
            />
            <textarea
              placeholder="Write your announcement..."
              rows={4}
              value={editBody}
              onChange={e => setEditBody(e.target.value)}
              className="w-full px-4 py-3 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none brand-focus placeholder:text-brand-muted/60 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2.5 border border-brand-border rounded-xl text-brand-muted font-bold text-xs hover:bg-white/5 transition-all cursor-pointer">
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={submitting} className="px-5 py-2.5 bg-brand-gradient text-white font-black text-xs rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Announcements List */}
      <div className="space-y-4">
        {(announcements?.length || 0) === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No announcements yet"
            description="Published announcements will appear here. They sync to /api/v1/admin/announcements/."
            action={onAdd ? (
              <button onClick={handleSubmit} className="px-4 py-2 bg-brand-gradient-orange text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer">Publish First Announcement</button>
            ) : null}
          />
        ) : announcements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: Math.min(i * 0.06, 0.4), type: 'spring', stiffness: 200, damping: 20 }}
            className={`rounded-2xl border-2 overflow-hidden transition-all group ${
              a.is_published
                ? 'border-brand-orange/30 bg-gradient-to-r from-brand-orange/[0.06] to-brand-card shadow-lg shadow-brand-orange/5'
                : 'border-brand-border bg-brand-card'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className={`p-2 rounded-lg ${a.is_published ? 'bg-brand-orange/20' : 'bg-brand-border'}`}>
                      <Megaphone size={16} className={a.is_published ? 'text-brand-orange' : 'text-brand-muted'} />
                    </div>
                    {a.is_published && <Pin size={12} className="text-brand-orange" />}
                    <h3 className={`text-base font-black tracking-tight truncate ${
                      a.is_published ? 'text-brand-text' : 'text-brand-muted'
                    }`}>
                      {a.title}
                    </h3>
                    <motion.span
                      initial={false}
                      animate={a.is_published ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className={`shrink-0 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                        a.is_published
                          ? 'bg-brand-orange/20 text-brand-orange ring-1 ring-brand-orange/30'
                          : 'bg-brand-border text-brand-muted'
                      }`}
                    >
                      {a.is_published ? '● Published' : 'Draft'}
                    </motion.span>
                  </div>
                  <div className="ml-11">
                    <p className={`text-sm leading-relaxed ${a.is_published ? 'text-brand-text/90 font-medium' : 'text-brand-muted'}`}>
                      {a.body || a.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-[10px] text-brand-muted font-medium flex items-center gap-1">
                        <Calendar size={10} /> {a.date || (a.created_at ? new Date(a.created_at).toLocaleDateString() : '')}
                      </p>
                      {a.created_by && (
                        <p className="text-[10px] text-brand-muted font-medium flex items-center gap-1">
                          <UserIcon size={10} /> {a.created_by?.full_name || a.created_by?.username || 'Admin'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onTogglePublish(a.id, a.is_published)}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      a.is_published
                        ? 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30'
                        : 'bg-brand-violet/20 text-brand-violet hover:bg-brand-violet/30'
                    }`}
                    title={a.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {a.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    className="p-2 rounded-lg bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/30 transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    className="p-2 rounded-lg bg-brand-red/15 text-brand-red hover:bg-brand-red/30 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
