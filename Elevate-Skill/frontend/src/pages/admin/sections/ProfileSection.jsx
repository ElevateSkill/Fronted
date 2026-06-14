import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Loader, Eye, EyeOff, Globe, GlobeX } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { Field, TextInput, useToast, ToastMessage, accent, apiError } from '../components/AdminShared';

export default function ProfileSection() {
  const { user, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(() => {
    return localStorage.getItem('elevateskill_profile_visible') !== 'false';
  });
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '', phone_number: '', password: '' });
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        password: '',
      });
    }
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = { ...profileForm };
    if (!payload.password) delete payload.password;
    try {
      await api.put('/profile/', payload);
      refreshProfile();
      localStorage.setItem('elevateskill_profile_visible', profileVisibility);
      showToast('Profile updated successfully.', 'success');
      setProfileForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      showToast(apiError(err, 'Could not update profile.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>

      <form onSubmit={saveProfile} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
          <User size={18} className="text-[#15c8fb]" /> Profile settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-2xl font-black text-white shadow-lg">
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-black text-gray-900 dark:text-white text-lg">{user?.full_name || user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email} &middot; {user?.role}</p>
            </div>
          </div>
          <Field label="Full name"><TextInput required value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} placeholder="Full name" /></Field>
          <Field label="Email"><TextInput required type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="Email" /></Field>
          <Field label="Phone number"><TextInput value={profileForm.phone_number} onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })} placeholder="Phone number" /></Field>
          <Field label="New password (leave blank to keep current)">
            <div className="relative">
              <TextInput type={showPassword ? 'text' : 'password'} value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} placeholder="••••••••" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#15c8fb] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          <Field label="Profile visibility">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProfileVisibility(!profileVisibility)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all border ${
                  profileVisibility
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'
                }`}
              >
                {profileVisibility ? <Globe size={16} /> : <GlobeX size={16} />}
                {profileVisibility ? 'Public' : 'Private'}
              </button>
              <span className="text-xs text-gray-500">Other users can see your profile when public.</span>
            </div>
          </Field>
          <button disabled={saving} className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
            {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save profile
          </button>
        </div>
      </form>
    </motion.div>
  );
}
