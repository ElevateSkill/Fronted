import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Edit3, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';
import {
  Field, TextInput, TextArea, Badge, ToastMessage,
  useToast, useConfirmDelete, accent, apiError
} from '../../components/AdminShared';

const emptyForm = { title: '', subtitle: '', cta_text: '', cta_link: '', is_published: true, background_image: null };

export default function HeroContentSection() {
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
      const res = await api.get('/admin/hero/slides/');
      const data = unwrapResults(res.data);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      try {
        const res = await api.get('/admin/hero/');
        const d = res.data;
        setItems(d?.id ? [d] : []);
      } catch (err) {
        showToast(apiError(err, 'Could not load hero.'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subtitle', form.subtitle);
      fd.append('cta_text', form.cta_text);
      fd.append('cta_link', form.cta_link);
      if (form.background_image instanceof File) fd.append('background_image', form.background_image);
      if (editingId) {
        await api.patch(`/admin/hero/${editingId}/`, fd);
        showToast('Hero entry updated.', 'success');
      } else {
        await api.post('/admin/hero/', fd);
        showToast('Hero entry created.', 'success');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowModal(false);
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      cta_text: item.cta_text || '',
      cta_link: item.cta_link || '',
      is_published: item.is_published !== undefined ? item.is_published : true,
      background_image: null,
    });
    setShowModal(true);
  };

  const patchItem = async (item, payload) => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/hero/${item.id}/`, payload);
      setItems((prev) => prev.map((i) => (i.id === item.id ? res.data : i)));
      showToast('Hero entry updated.', 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = (id) => {
    confirmThen(async () => {
      try {
        await api.delete(`/admin/hero/${id}/`);
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast('Hero entry deleted.', 'success');
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
      }
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>

      {/* Left column: create form */}
      <div className="space-y-6">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={saveItem} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Image size={18} className="text-[#15c8fb]" /> New Hero Entry
          </h2>
          <Field label="Title">
            <TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Elevate Skill" />
          </Field>
          <Field label="Subtitle">
            <TextArea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows="3" placeholder="Your journey to mastery starts here." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA Text">
              <TextInput value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="Explore Courses" />
            </Field>
            <Field label="CTA Link">
              <TextInput value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="/courses/" />
            </Field>
          </div>
          <Field label="Background Image">
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, background_image: e.target.files?.[0] || null })}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:bg-[#15c8fb]/10 file:text-[#15c8fb] hover:file:bg-[#15c8fb]/20" />
          </Field>
          <label className="mt-3 mb-5 flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/20 px-3.5 py-3 text-sm font-bold text-gray-900 dark:text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Publish
          </label>
          <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save hero</button>
        </motion.form>
      </div>

      {/* Right column: list */}
      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-black text-gray-900 dark:text-white">Hero Entries</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/30 p-4 transition-all hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-black text-gray-900 dark:text-white text-sm sm:text-base">{item.title}</h3>
                  <Badge>{item.is_published !== false ? 'published' : 'draft'}</Badge>
                </div>
                <p className="text-sm leading-6 text-gray-900 dark:text-white line-clamp-2">{item.subtitle}</p>
                {item.cta_text && <p className="mt-1 text-xs text-[#15c8fb] font-bold">{item.cta_text} →</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(item)}
                    className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
                    <Edit3 size={13} className="inline mr-1" /> Edit
                  </button>
                  <button onClick={() => patchItem(item, { is_published: item.is_published === false ? true : false })}
                    className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
                    {item.is_published !== false ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteItem(item.id)}
                    className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 ml-auto">Delete</button>
                </div>
              </article>
            ))}
            {!items.length && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Image size={36} className="mb-2 text-gray-300" />
                <p className="text-sm">No hero entries yet</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {editingId ? 'Edit Hero Entry' : 'New Hero Entry'}
                  </h3>
                  <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); }}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={saveItem} className="space-y-4">
                  <Field label="Title">
                    <TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Elevate Skill" />
                  </Field>
                  <Field label="Subtitle">
                    <TextArea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows="3" placeholder="Your journey to mastery starts here." />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="CTA Text">
                      <TextInput value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="Explore Courses" />
                    </Field>
                    <Field label="CTA Link">
                      <TextInput value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} placeholder="/courses/" />
                    </Field>
                  </div>
                  <Field label="Background Image">
                    <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, background_image: e.target.files?.[0] || null })}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:bg-[#15c8fb]/10 file:text-[#15c8fb] hover:file:bg-[#15c8fb]/20" />
                  </Field>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Publish
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button disabled={saving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                      {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : null}
                      {editingId ? 'Update Hero' : 'Create Hero'}
                    </button>
                    <button type="button" onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); }}
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
