import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit3, Trash2, Plus, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';
import {
  Field, TextInput, TextArea, Badge, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, objectToFormData, apiError
} from '../../components/AdminShared';

const emptyForm = { student_name: '', message: '', rating: 5, is_active: true, student_image: null };

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className={`p-1 transition-all hover:scale-110 ${star <= value ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>
          <Star size={20} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const res = await api.get('/admin/testimonials/');
      setItems(unwrapResults(res.data));
    } catch (err) {
      showToast(apiError(err, 'Could not load testimonials.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      student_name: item.student_name || '',
      message: item.message || '',
      rating: item.rating || 5,
      is_active: item.is_active !== undefined ? item.is_active : true,
      student_image: null,
    });
    setShowModal(true);
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/admin/testimonials/${editingId}/`, objectToFormData(form));
        showToast('Testimonial updated.', 'success');
      } else {
        await api.post('/admin/testimonials/', objectToFormData(form));
        showToast('Testimonial created.', 'success');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    setSaving(true);
    try {
      await api.patch(`/admin/testimonials/${item.id}/`, { is_active: !item.is_active });
      showToast('Testimonial updated.', 'success');
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (id) => {
    confirmThen(async () => {
      setSaving(true);
      try {
        await api.delete(`/admin/testimonials/${id}/`);
        showToast('Testimonial deleted.', 'success');
        await loadData();
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
      } finally {
        setSaving(false);
      }
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>
      <AnimatePresence>
        <Modal
          open={confirmDelete.open}
          title="Confirm deletion"
          message="This action cannot be undone. Are you sure you want to delete this testimonial?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <CmsSubNav />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Testimonials</h2>
          <p className="text-sm text-gray-500">Manage student testimonials shown on the homepage.</p>
        </div>
        <button onClick={openCreate} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black ${accent.button}`}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-sm font-black text-white">
                  {item.student_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.student_name}</h3>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= (item.rating || 5) ? 'text-amber-400' : 'text-gray-300'} fill={s <= (item.rating || 5) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
              </div>
              <Badge>{item.is_active ? 'active' : 'inactive'}</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">"{item.message}"</p>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
              <button onClick={() => openEdit(item)}
                className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all">
                <Edit3 size={13} className="inline mr-1" /> Edit
              </button>
              <button onClick={() => toggleActive(item)}
                className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all">
                {item.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => deleteItem(item.id)}
                className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all ml-auto">
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}
        {!items.length && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
            <Star size={48} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">No testimonials yet</p>
            <button onClick={openCreate} className="mt-3 text-xs font-bold text-[#15c8fb] hover:underline">Add your first testimonial</button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={saveItem} className="space-y-4">
                  <Field label="Student Name">
                    <TextInput required value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} placeholder="Full name" />
                  </Field>
                  <Field label="Rating">
                    <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                  </Field>
                  <Field label="Message">
                    <TextArea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="3" placeholder="What did the student say?" />
                  </Field>
                  <Field label="Photo">
                    <TextInput type="file" accept="image/*" onChange={(e) => setForm({ ...form, student_image: e.target.files?.[0] || null })} />
                  </Field>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Active on homepage
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button disabled={saving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                      {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : null}
                      {editingId ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)}
                      className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-50 transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
