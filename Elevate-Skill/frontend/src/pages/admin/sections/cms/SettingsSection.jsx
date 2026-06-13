import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Save, Loader } from 'lucide-react';
import { api } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';
import {
  Field, TextInput, TextArea, ToastMessage,
  useToast, accent, apiError
} from '../../components/AdminShared';

const emptySettings = { site_name: '', contact_info: '', bank_details: '', payment_instructions: '' };

export default function SettingsSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptySettings);
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    api.get('/admin/site-settings/')
      .then((res) => setForm({ ...emptySettings, ...res.data }))
      .catch((err) => showToast(apiError(err, 'Could not load settings.'), 'error'))
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/site-settings/', form);
      showToast('Site settings saved.', 'success');
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white mb-5">
            <SettingsIcon size={18} className="text-[#15c8fb]" /> Site Settings
          </h2>

          <form onSubmit={saveSettings} className="space-y-4">
            <Field label="Site Name">
              <TextInput value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} placeholder="Elevate Skill LMS" />
            </Field>
            <Field label="Contact Info">
              <TextArea value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} rows="3" placeholder="Email, phone, address..." />
            </Field>
            <Field label="Bank Details">
              <TextArea value={form.bank_details} onChange={(e) => setForm({ ...form, bank_details: e.target.value })} rows="3" placeholder="Bank name, account number..." />
            </Field>
            <Field label="Payment Instructions">
              <TextArea value={form.payment_instructions} onChange={(e) => setForm({ ...form, payment_instructions: e.target.value })} rows="4" placeholder="Instructions displayed to students on checkout..." />
            </Field>
            <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
              {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : <Save size={16} className="inline mr-2" />}
              Save Settings
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
