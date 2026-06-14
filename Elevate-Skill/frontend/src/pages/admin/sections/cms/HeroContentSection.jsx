import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Save, Loader } from 'lucide-react';
import { api, getMediaUrl } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';
import {
  Field, TextInput, TextArea, ToastMessage,
  useToast, accent, apiError
} from '../../components/AdminShared';

const emptyForm = { title: '', subtitle: '', cta_text: '', cta_link: '', is_published: true, background_image: null };

export default function HeroContentSection() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast, showToast, closeToast } = useToast();

  const loadData = async () => {
    try {
      const res = await api.get('/admin/hero/');
      const d = res.data;
      setHero(d);
      setForm({
        title: d.title || '',
        subtitle: d.subtitle || '',
        cta_text: d.cta_text || '',
        cta_link: d.cta_link || '',
        is_published: d.is_published !== undefined ? d.is_published : true,
        background_image: null,
      });
    } catch (err) {
      showToast(apiError(err, 'Could not load hero section.'), 'error');
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
      fd.append('is_published', form.is_published);
      if (form.background_image instanceof File) fd.append('background_image', form.background_image);
      await api.put('/admin/hero/', fd);
      showToast('Hero section updated.', 'success');
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>

      <CmsSubNav />

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={saveItem}
        className="max-w-2xl rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
          <Image size={18} className="text-[#15c8fb]" /> Hero Section
        </h2>

        {hero?.background_image && (
          <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
            <img src={getMediaUrl(hero.background_image)} alt="Current hero background" className="h-40 w-full object-cover" />
          </div>
        )}

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
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Published
        </label>
        <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
          {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : <Save size={16} className="inline mr-2" />}
          Save Hero Section
        </button>
      </motion.form>
    </div>
  );
}
