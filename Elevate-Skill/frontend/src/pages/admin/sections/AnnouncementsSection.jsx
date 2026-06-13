import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Newspaper, Edit3, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../services/api';
import {
  Field, TextInput, TextArea, Select, Badge, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, objectToFormData, apiError
} from '../components/AdminShared';

const emptyAnnouncement = { title: '', content: '', is_published: true };
const emptyNews = { title: '', excerpt: '', content: '', status: 'published', image: null };

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [newsForm, setNewsForm] = useState(emptyNews);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editingNews, setEditingNews] = useState(null);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const [annRes, newsRes] = await Promise.all([
        api.get('/admin/announcements/'),
        api.get('/admin/news/'),
      ]);
      setAnnouncements(unwrapResults(annRes.data));
      setNews(unwrapResults(newsRes.data));
    } catch (err) {
      showToast(apiError(err, 'Could not load data.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const saveAnnouncement = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingAnnouncement) {
        const res = await api.patch(`/admin/announcements/${editingAnnouncement.id}/`, announcementForm);
        setAnnouncements((items) => items.map((a) => (a.id === editingAnnouncement.id ? res.data : a)));
        showToast('Announcement updated.', 'success');
      } else {
        const res = await api.post('/admin/announcements/', announcementForm);
        setAnnouncements((items) => [res.data, ...items]);
        showToast('Announcement saved.', 'success');
      }
      setAnnouncementForm(emptyAnnouncement);
      setEditingAnnouncement(null);
      setShowAnnModal(false);
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditAnnouncement = (item) => {
    setEditingAnnouncement(item);
    setAnnouncementForm({
      title: item.title || '',
      content: item.content || '',
      is_published: item.is_published !== undefined ? item.is_published : true,
    });
    setShowAnnModal(true);
  };

  const patchAnnouncement = async (item, payload) => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/announcements/${item.id}/`, payload);
      setAnnouncements((items) => items.map((current) => (current.id === item.id ? res.data : current)));
      showToast('Announcement updated.', 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteAnnouncement = (id) => {
    confirmThen(async () => {
      setSaving(true);
      try {
        await api.delete(`/admin/announcements/${id}/`);
        setAnnouncements((items) => items.filter((item) => item.id !== id));
        showToast('Announcement deleted.', 'success');
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
      } finally {
        setSaving(false);
      }
    });
  };

  const saveNews = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingNews) {
        const res = await api.patch(`/admin/news/${editingNews.id}/`, objectToFormData(newsForm));
        setNews((items) => items.map((n) => (n.id === editingNews.id ? res.data : n)));
        showToast('News post updated.', 'success');
      } else {
        const res = await api.post('/admin/news/', objectToFormData(newsForm));
        setNews((items) => [res.data, ...items]);
        showToast('News post saved.', 'success');
      }
      setNewsForm(emptyNews);
      setEditingNews(null);
      setShowNewsModal(false);
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditNews = (item) => {
    setEditingNews(item);
    setNewsForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      status: item.status || 'published',
      image: null,
    });
    setShowNewsModal(true);
  };

  const patchNews = async (item, payload) => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/news/${item.id}/`, payload);
      setNews((items) => items.map((current) => (current.id === item.id ? res.data : current)));
      showToast('News post updated.', 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteNews = (id) => {
    confirmThen(async () => {
      setSaving(true);
      try {
        await api.delete(`/admin/news/${id}/`);
        setNews((items) => items.filter((item) => item.id !== id));
        showToast('News post deleted.', 'success');
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
    <div className="grid gap-6 xl:grid-cols-2">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>
      <AnimatePresence>
        <Modal
          open={confirmDelete.open}
          title="Confirm deletion"
          message="This action cannot be undone. Are you sure?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      {/* Left column: create forms */}
      <div className="space-y-6">
        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={saveAnnouncement} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Megaphone size={18} className="text-[#15c8fb]" /> Announcement
          </h2>
          <Field label="Title"><TextInput required value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} placeholder="Announcement title" /></Field>
          <Field label="Content"><TextArea required value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} rows="5" placeholder="Write your announcement..." /></Field>
          <label className="mb-5 mt-3 flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/20 px-3.5 py-3 text-sm font-bold text-gray-900 dark:text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
            <input type="checkbox" checked={announcementForm.is_published} onChange={(e) => setAnnouncementForm({ ...announcementForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Publish to students
          </label>
          <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save announcement</button>
        </motion.form>

        <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          onSubmit={saveNews} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Newspaper size={18} className="text-[#15c8fb]" /> News post
          </h2>
          <Field label="Title"><TextInput required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="News title" /></Field>
          <Field label="Excerpt"><TextArea required value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} rows="2" placeholder="Brief summary..." /></Field>
          <Field label="Content"><TextArea required value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows="5" placeholder="Full article content..." /></Field>
          <Field label="Status">
            <Select value={newsForm.status} onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </Field>
          <Field label="Image">
            <input type="file" accept="image/*" onChange={(e) => setNewsForm({ ...newsForm, image: e.target.files?.[0] || null })}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:bg-[#15c8fb]/10 file:text-[#15c8fb] hover:file:bg-[#15c8fb]/20" />
          </Field>
          <button disabled={saving} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save news</button>
        </motion.form>
      </div>

      {/* Right column: lists */}
      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-black text-gray-900 dark:text-white">Announcements</h2>
          <div className="space-y-3">
            {announcements.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/30 p-4 transition-all hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-black text-gray-900 dark:text-white text-sm sm:text-base">{item.title}</h3>
                  <Badge>{item.is_published ? 'published' : 'draft'}</Badge>
                </div>
                <p className="text-sm leading-6 text-gray-900 dark:text-white line-clamp-3">{item.content}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEditAnnouncement(item)}
                    className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
                    <Edit3 size={13} className="inline mr-1" /> Edit
                  </button>
                  <button onClick={() => patchAnnouncement(item, { is_published: !item.is_published })}
                    className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
                    {item.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteAnnouncement(item.id)}
                    className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 ml-auto">Delete</button>
                </div>
              </article>
            ))}
            {!announcements.length && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Megaphone size={36} className="mb-2 text-gray-300" />
                <p className="text-sm">No announcements yet</p>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-black text-gray-900 dark:text-white">News posts</h2>
          <div className="space-y-3">
            {news.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/30 p-4 transition-all hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-black text-gray-900 dark:text-white">{item.title}</h3>
                  <Badge>{item.status}</Badge>
                </div>
                <p className="text-sm leading-6 text-gray-900 dark:text-white line-clamp-2">{item.excerpt}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEditNews(item)}
                    className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
                    <Edit3 size={13} className="inline mr-1" /> Edit
                  </button>
                  <button onClick={() => patchNews(item, { status: item.status === 'published' ? 'draft' : 'published' })}
                    className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
                    {item.status === 'published' ? 'Move to draft' : 'Publish'}
                  </button>
                  <button onClick={() => deleteNews(item.id)}
                    className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50 ml-auto">Delete</button>
                </div>
              </article>
            ))}
            {!news.length && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Newspaper size={36} className="mb-2 text-gray-300" />
                <p className="text-sm">No news posts yet</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Edit Announcement Modal */}
      <AnimatePresence>
        {showAnnModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAnnModal(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                  </h3>
                  <button onClick={() => { setShowAnnModal(false); setEditingAnnouncement(null); setAnnouncementForm(emptyAnnouncement); }}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={saveAnnouncement} className="space-y-4">
                  <Field label="Title">
                    <TextInput required value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} placeholder="Announcement title" />
                  </Field>
                  <Field label="Content">
                    <TextArea required value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} rows="5" placeholder="Write your announcement..." />
                  </Field>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
                    <input type="checkbox" checked={announcementForm.is_published} onChange={(e) => setAnnouncementForm({ ...announcementForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Publish to students
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button disabled={saving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                      {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : null}
                      {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                    </button>
                    <button type="button" onClick={() => { setShowAnnModal(false); setEditingAnnouncement(null); setAnnouncementForm(emptyAnnouncement); }}
                      className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-50 transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit News Modal */}
      <AnimatePresence>
        {showNewsModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNewsModal(false)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">
                    {editingNews ? 'Edit News Post' : 'New News Post'}
                  </h3>
                  <button onClick={() => { setShowNewsModal(false); setEditingNews(null); setNewsForm(emptyNews); }}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <form onSubmit={saveNews} className="space-y-4">
                  <Field label="Title">
                    <TextInput required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="News title" />
                  </Field>
                  <Field label="Excerpt">
                    <TextArea required value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} rows="2" placeholder="Brief summary..." />
                  </Field>
                  <Field label="Content">
                    <TextArea required value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows="5" placeholder="Full article content..." />
                  </Field>
                  <Field label="Status">
                    <Select value={newsForm.status} onChange={(e) => setNewsForm({ ...newsForm, status: e.target.value })}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </Select>
                  </Field>
                  <Field label="Image">
                    <input type="file" accept="image/*" onChange={(e) => setNewsForm({ ...newsForm, image: e.target.files?.[0] || null })}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:bg-[#15c8fb]/10 file:text-[#15c8fb] hover:file:bg-[#15c8fb]/20" />
                  </Field>
                  <div className="flex gap-3 pt-2">
                    <button disabled={saving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                      {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : null}
                      {editingNews ? 'Update News' : 'Create News'}
                    </button>
                    <button type="button" onClick={() => { setShowNewsModal(false); setEditingNews(null); setNewsForm(emptyNews); }}
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
