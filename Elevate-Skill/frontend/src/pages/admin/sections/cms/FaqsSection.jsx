import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Edit3, Trash2, Plus, ChevronDown, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';
import {
  Field, TextInput, TextArea, Badge, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, objectToFormData, apiError
} from '../../components/AdminShared';

const emptyForm = { question: '', answer: '', order: 0, is_active: true, category: '' };

export default function FaqsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const res = await api.get('/admin/faqs/');
      setItems(unwrapResults(res.data).sort((a, b) => a.order - b.order));
    } catch (err) {
      showToast(apiError(err, 'Could not load FAQs.'), 'error');
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
      question: item.question || '',
      answer: item.answer || '',
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true,
      category: item.category || '',
    });
    setShowModal(true);
  };

  const saveItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await api.patch(`/admin/faqs/${editingId}/`, form);
        setItems((prev) => prev.map((item) => (item.id === editingId ? res.data : item)).sort((a, b) => a.order - b.order));
        showToast('FAQ updated.', 'success');
      } else {
        const res = await api.post('/admin/faqs/', form);
        setItems((prev) => [...prev, res.data].sort((a, b) => a.order - b.order));
        showToast('FAQ created.', 'success');
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/faqs/${item.id}/`, { is_active: !item.is_active });
      setItems((prev) => prev.map((i) => (i.id === item.id ? res.data : i)).sort((a, b) => a.order - b.order));
      showToast('FAQ updated.', 'success');
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
        await api.delete(`/admin/faqs/${id}/`);
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast('FAQ deleted.', 'success');
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
          message="This action cannot be undone. Are you sure you want to delete this FAQ?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <CmsSubNav />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-500">Create and manage FAQs displayed on the homepage.</p>
        </div>
        <button onClick={openCreate} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black ${accent.button}`}>
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="space-y-2 max-w-3xl">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <HelpCircle size={18} className="shrink-0 text-[#15c8fb]" />
                <span className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.question}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge>{item.is_active ? 'active' : 'inactive'}</Badge>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-white/10">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span>Order: {item.order}</span>
                      {item.category && <span>· Category: {item.category}</span>}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                        className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all">
                        <Edit3 size={13} className="inline mr-1" /> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleActive(item); }}
                        className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all">
                        {item.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                        className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all ml-auto">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {!items.length && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <HelpCircle size={48} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">No FAQs yet</p>
            <button onClick={openCreate} className="mt-3 text-xs font-bold text-[#15c8fb] hover:underline">Add your first FAQ</button>
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
                    {editingId ? 'Edit FAQ' : 'New FAQ'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={saveItem} className="space-y-4">
                  <Field label="Question">
                    <TextInput required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="What is Elevate Skill?" />
                  </Field>
                  <Field label="Answer">
                    <TextArea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows="4" placeholder="Detailed answer..." />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Order">
                      <TextInput type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="0" />
                    </Field>
                    <Field label="Category">
                      <TextInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General" />
                    </Field>
                  </div>
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
