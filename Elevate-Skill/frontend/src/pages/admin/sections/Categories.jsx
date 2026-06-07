import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tags, Plus, Trash2, Edit3, X, Check, Hash, Calendar } from 'lucide-react';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function Categories({ categories, onAdd, onEdit, onDelete }) {
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({ name: name.trim() });
      setName('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return;
    setSubmitting(true);
    try {
      await onEdit(editId, { name: editName.trim() });
      setEditId(null);
      setEditName('');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-brand-text tracking-tight">Categories</h2>
        <p className="text-sm text-brand-muted font-medium mt-1">{categories.length} categories · Manage course organization</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-brand-border bg-brand-card p-5 space-y-4"
      >
        <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
          <Plus size={18} className="text-brand-primary" /> New Category
        </h3>
        <div className="flex gap-3">
          <input
            placeholder="Category name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="flex-1 px-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim()}
            className="px-5 py-2.5 bg-brand-primary text-white font-black text-xs rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <Tags size={14} /> Add
          </button>
        </div>
      </motion.div>

      {/* Edit Panel */}
      <motion.div
        initial={false}
        animate={editId ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        {editId && (
          <div className="rounded-2xl border border-brand-primary/40 bg-gradient-to-r from-brand-primary/10 to-brand-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                <Edit3 size={18} className="text-brand-primary" /> Edit Category
              </h3>
              <button onClick={() => { setEditId(null); setEditName(''); }} className="p-1.5 rounded-lg hover:bg-white/10 text-brand-muted hover:text-[#D95C4A] transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-3">
              <input
                placeholder="Category name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEditSave()}
                className="flex-1 px-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
                autoFocus
              />
              <button
                onClick={handleEditSave}
                disabled={submitting}
                className="px-5 py-2.5 bg-brand-primary text-white font-black text-xs rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Categories Table */}
      {categories.length === 0 ? (
        <EmptyState icon={Tags} title="No categories yet" description="Add a category to organize courses." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-black/40">
                {['Name', 'Slug', 'Created', 'Actions'].map(h => (
                  <th key={h} className={`text-left p-4 text-[10px] font-black text-brand-muted uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <motion.tr
                  key={cat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-brand-border/50 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                        <Tags size={14} className="text-brand-primary" />
                      </div>
                      <span className="font-bold text-brand-text">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 text-brand-muted text-[11px] font-mono">
                      <Hash size={10} /> {cat.slug}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-brand-muted text-xs">
                      <Calendar size={12} />
                      {cat.created_at ? new Date(cat.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer" title="Edit">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => onDelete(cat.id)} className="p-2 rounded-lg bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition-all cursor-pointer" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
