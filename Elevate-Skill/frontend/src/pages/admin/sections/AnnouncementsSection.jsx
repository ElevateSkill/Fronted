import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Newspaper, Edit3, Loader, Plus, Trash2, CheckCircle, XCircle, Eye, EyeOff, Save, X, Calendar, Clock, FileText, Image, RefreshCw } from 'lucide-react';
import { api, unwrapResults } from '../../../services/api';
import {
  Field, TextInput, TextArea, Select, Badge, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, objectToFormData, apiError
} from '../components/AdminShared';

const emptyAnnouncement = { title: '', content: '', is_published: true };
const emptyNews = { title: '', excerpt: '', content: '', status: 'published', image: null };

function StatusPill({ published }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
      published
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }`}>
      {published ? <Eye size={10} /> : <EyeOff size={10} />}
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

function StatBadge({ count, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15c8fb]/10 border border-[#15c8fb]/20 px-3 py-1.5 text-xs font-bold text-[#15c8fb]">
      {count} {label}
    </span>
  );
}

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
        showToast('Announcement created.', 'success');
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
    const prev = announcements;
    setAnnouncements((items) => items.map((current) =>
      current.id === item.id ? { ...current, ...payload } : current
    ));
    try {
      const res = await api.patch(`/admin/announcements/${item.id}/`, payload);
      setAnnouncements((items) => items.map((current) => (current.id === item.id ? res.data : current)));
      showToast('Announcement updated.', 'success');
    } catch {
      setAnnouncements(prev);
      showToast('Update failed.', 'error');
    }
  };

  const deleteAnnouncement = (id) => {
    confirmThen(async () => {
      try {
        await api.delete(`/admin/announcements/${id}/`);
        setAnnouncements((items) => items.filter((item) => item.id !== id));
        showToast('Announcement deleted.', 'success');
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
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
        showToast('News post created.', 'success');
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
    const prev = news;
    setNews((items) => items.map((current) =>
      current.id === item.id ? { ...current, ...payload } : current
    ));
    try {
      const res = await api.patch(`/admin/news/${item.id}/`, payload);
      setNews((items) => items.map((current) => (current.id === item.id ? res.data : current)));
      showToast('News post updated.', 'success');
    } catch {
      setNews(prev);
      showToast('Update failed.', 'error');
    }
  };

  const deleteNews = (id) => {
    confirmThen(async () => {
      try {
        await api.delete(`/admin/news/${id}/`);
        setNews((items) => items.filter((item) => item.id !== id));
        showToast('News post deleted.', 'success');
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin" size={32} />
          <p className="text-sm text-gray-400">Loading content...</p>
        </div>
      </div>
    );
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
          message="This action cannot be undone. Are you sure?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Content Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage announcements and news posts.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={loadData} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 transition-all hover:text-[#15c8fb]" title="Refresh">
            <RefreshCw size={14} />
          </button>
          <StatBadge count={announcements.length} label="announcements" />
          <StatBadge count={news.length} label="news posts" />
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={saveAnnouncement}
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-sm">
                <Megaphone size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Send updates to students</p>
              </div>
            </div>
            <div className="space-y-4">
              <Field label="Title">
                <TextInput required value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} placeholder="e.g. New course batch opening" />
              </Field>
              <Field label="Content">
                <TextArea required value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} rows="4" placeholder="Write your announcement message..." />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
                <input type="checkbox" checked={announcementForm.is_published} onChange={(e) => setAnnouncementForm({ ...announcementForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" />
                <span className="flex items-center gap-1.5">
                  {announcementForm.is_published ? <CheckCircle size={14} className="text-emerald-400" /> : <EyeOff size={14} className="text-amber-400" />}
                  Publish immediately
                </span>
              </label>
              <button disabled={saving} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black disabled:opacity-60 shadow-lg ${accent.button}`}>
                {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                {editingAnnouncement ? 'Update Announcement' : 'Save Announcement'}
              </button>
            </div>
          </motion.form>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onSubmit={saveNews}
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-sm">
                <Newspaper size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {editingNews ? 'Edit News Post' : 'New News Post'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Publish news for the public</p>
              </div>
            </div>
            <div className="space-y-4">
              <Field label="Title">
                <TextInput required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="e.g. Elevate Skill launches new program" />
              </Field>
              <Field label="Excerpt">
                <TextArea required value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} rows="2" placeholder="Brief summary for preview..." />
              </Field>
              <Field label="Content">
                <TextArea required value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} rows="4" placeholder="Full article content..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              <button disabled={saving} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black disabled:opacity-60 shadow-lg ${accent.button}`}>
                {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                {editingNews ? 'Update News Post' : 'Save News Post'}
              </button>
            </div>
          </motion.form>
        </div>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-[#15c8fb]" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">Announcements</h3>
              </div>
              <span className="text-xs text-gray-400">{announcements.length} total</span>
            </div>
            <div className="space-y-3">
              {announcements.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900/20 p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="pl-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h4 className="font-black text-gray-900 dark:text-white text-sm group-hover:text-[#15c8fb] transition-colors">{item.title}</h4>
                      <StatusPill published={item.is_published} />
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">{item.content}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => openEditAnnouncement(item)}
                        className="rounded-lg border border-[#15c8fb]/30 px-2.5 py-1.5 text-[10px] font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10 inline-flex items-center gap-1">
                        <Edit3 size={11} /> Edit
                      </button>
                      <button onClick={() => patchAnnouncement(item, { is_published: !item.is_published })}
                        className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-all inline-flex items-center gap-1 ${
                          item.is_published
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}>
                        {item.is_published ? <EyeOff size={11} /> : <Eye size={11} />}
                        {item.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => deleteAnnouncement(item.id)}
                        className="rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[10px] font-bold text-rose-500 transition-all hover:bg-rose-500/10 inline-flex items-center gap-1 ml-auto">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
              {!announcements.length && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Megaphone size={36} className="mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm font-medium">No announcements yet</p>
                  <p className="text-xs mt-1">Create your first announcement above.</p>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper size={16} className="text-[#15c8fb]" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">News Posts</h3>
              </div>
              <span className="text-xs text-gray-400">{news.length} total</span>
            </div>
            <div className="space-y-3">
              {news.map((item, i) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900/20 p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${item.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="pl-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h4 className="font-black text-gray-900 dark:text-white text-sm group-hover:text-[#15c8fb] transition-colors line-clamp-1">{item.title}</h4>
                      <Badge>{item.status}</Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">{item.excerpt || item.content}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => openEditNews(item)}
                        className="rounded-lg border border-[#15c8fb]/30 px-2.5 py-1.5 text-[10px] font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10 inline-flex items-center gap-1">
                        <Edit3 size={11} /> Edit
                      </button>
                      <button onClick={() => patchNews(item, { status: item.status === 'published' ? 'draft' : 'published' })}
                        className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-all inline-flex items-center gap-1 ${
                          item.status === 'published'
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}>
                        {item.status === 'published' ? <EyeOff size={11} /> : <Eye size={11} />}
                        {item.status === 'published' ? 'To Draft' : 'Publish'}
                      </button>
                      <button onClick={() => deleteNews(item.id)}
                        className="rounded-lg border border-rose-500/30 px-2.5 py-1.5 text-[10px] font-bold text-rose-500 transition-all hover:bg-rose-500/10 inline-flex items-center gap-1 ml-auto">
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
              {!news.length && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Newspaper size={36} className="mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm font-medium">No news posts yet</p>
                  <p className="text-xs mt-1">Create your first news post above.</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {showAnnModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAnnModal(false); setEditingAnnouncement(null); setAnnouncementForm(emptyAnnouncement); }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29]">
                      <Megaphone size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                    </h3>
                  </div>
                  <button onClick={() => { setShowAnnModal(false); setEditingAnnouncement(null); setAnnouncementForm(emptyAnnouncement); }}
                    className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all">
                    <X size={18} />
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
                    <input type="checkbox" checked={announcementForm.is_published} onChange={(e) => setAnnouncementForm({ ...announcementForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" />
                    Publish to students
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button disabled={saving} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                      {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                      {editingAnnouncement ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => { setShowAnnModal(false); setEditingAnnouncement(null); setAnnouncementForm(emptyAnnouncement); }}
                      className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewsModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowNewsModal(false); setEditingNews(null); setNewsForm(emptyNews); }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29]">
                      <Newspaper size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {editingNews ? 'Edit News Post' : 'New News Post'}
                    </h3>
                  </div>
                  <button onClick={() => { setShowNewsModal(false); setEditingNews(null); setNewsForm(emptyNews); }}
                    className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all">
                    <X size={18} />
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
                  <div className="grid grid-cols-2 gap-3">
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
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button disabled={saving} className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                      {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                      {editingNews ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => { setShowNewsModal(false); setEditingNews(null); setNewsForm(emptyNews); }}
                      className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
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
