import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Edit3, Trash2, Plus, Eye, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';
import {
  Field, TextInput, TextArea, Badge, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, apiError
} from '../../components/AdminShared';

const emptyForm = { title: '', content: '', image: null };

export default function CmsAboutSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const res = await api.get('/admin/about/');
      const data = unwrapResults(res.data);
      setItems(Array.isArray(data) ? data : (data?.id ? [data] : []));
    } catch (err) {
      showToast(apiError(err, 'Could not load about section.'), 'error');
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
      title: item.title || '',
      content: item.content || '',
      image: null,
    });
    setShowModal(true);
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      if (form.image instanceof File) fd.append('image', form.image);
      if (editingId) {
        await api.patch(`/admin/about/${editingId}/`, fd);
        showToast('About section updated.', 'success');
      } else {
        await api.post('/admin/about/', fd);
        showToast('About section created.', 'success');
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

  const deleteItem = (id) => {
    confirmThen(async () => {
      try {
        await api.delete(`/admin/about/${id}/`);
        showToast('About entry deleted.', 'success');
        await loadData();
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
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
          message="This action cannot be undone. Are you sure you want to delete this about entry?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <CmsSubNav />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">About Section</h2>
          <p className="text-sm text-gray-500">Manage about us content displayed on the homepage.</p>
        </div>
        <button onClick={openCreate} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black ${accent.button}`}>
          <Plus size={16} /> Add About Entry
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#3b82f6] text-white shadow-sm">
                <FileText size={18} />
              </div>
              <Badge>{item.is_active !== false ? 'active' : 'inactive'}</Badge>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">{item.title || 'Untitled'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">{item.content}</p>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
              <button onClick={() => { setPreviewId(previewId === item.id ? null : item.id); }}
                className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all">
                <Eye size={13} className="inline mr-1" /> {previewId === item.id ? 'Hide' : 'Preview'}
              </button>
              <button onClick={() => openEdit(item)}
                className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all">
                <Edit3 size={13} className="inline mr-1" /> Edit
              </button>
              <button onClick={() => deleteItem(item.id)}
                className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all ml-auto">
                <Trash2 size={13} />
              </button>
            </div>
            {previewId === item.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-gray-100 dark:border-white/10">
                <div className="bg-gradient-to-br from-[#15c8fb]/5 to-[#f89f29]/5 rounded-lg p-4">
                  <h4 className="font-black text-gray-900 dark:text-white text-sm">{item.title}</h4>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        {!items.length && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
            <FileText size={48} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">No about entries yet</p>
            <button onClick={openCreate} className="mt-3 text-xs font-bold text-[#15c8fb] hover:underline">Add your first entry</button>
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
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {editingId ? 'Edit About Entry' : 'New About Entry'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={saveItem} className="space-y-4">
                  <Field label="Title">
                    <TextInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="About Elevate Skill" />
                  </Field>
                  <Field label="Content">
                    <TextArea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows="6" placeholder="Tell your story about the platform..." />
                  </Field>
                  <Field label="Image">
                    <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:bg-[#15c8fb]/10 file:text-[#15c8fb] hover:file:bg-[#15c8fb]/20" />
                  </Field>
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
