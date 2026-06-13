import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, FileText, Settings, Edit3, Trash2, Eye, Save, X, Upload, Star, HelpCircle } from 'lucide-react';

const accent = {
  button: 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white font-black hover:brightness-110 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-[#15c8fb]/20',
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className={`w-full rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 focus:border-[#15c8fb]/50 focus:ring-4 focus:ring-[#15c8fb]/10 shadow-sm ${props.className || ''}`} />;
}

function TextArea(props) {
  return <textarea {...props} className={`w-full rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 focus:border-[#15c8fb]/50 focus:ring-4 focus:ring-[#15c8fb]/10 shadow-sm ${props.className || ''}`} />;
}

/**
 * Enhanced CMS Manager Component
 * Manages Hero, About, and Site Settings with edit/view functionality
 */
export default function CMSManager({ 
  heroData, 
  aboutData, 
  settingsData,
  onSaveHero,
  onSaveAbout,
  onSaveSettings,
  saving 
}) {
  const [editingSection, setEditingSection] = useState(null); // 'hero', 'about', 'settings', or null
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null });
  const [aboutForm, setAboutForm] = useState({ title: '', content: '', image: null });
  const [settingsForm, setSettingsForm] = useState({ site_name: '', contact_info: '', bank_details: '', payment_instructions: '' });

  const startEditHero = () => {
    setHeroForm({
      title: heroData?.title || '',
      subtitle: heroData?.subtitle || '',
      cta_text: heroData?.cta_text || '',
      cta_link: heroData?.cta_link || '',
      background_image: null,
    });
    setEditingSection('hero');
  };

  const startEditAbout = () => {
    setAboutForm({
      title: aboutData?.title || '',
      content: aboutData?.content || '',
      image: null,
    });
    setEditingSection('about');
  };

  const startEditSettings = () => {
    setSettingsForm({
      site_name: settingsData?.site_name || '',
      contact_info: settingsData?.contact_info || '',
      bank_details: settingsData?.bank_details || '',
      payment_instructions: settingsData?.payment_instructions || '',
    });
    setEditingSection('settings');
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setHeroForm({ title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null });
    setAboutForm({ title: '', content: '', image: null });
    setSettingsForm({ site_name: '', contact_info: '', bank_details: '', payment_instructions: '' });
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    onSaveHero(heroForm);
    setEditingSection(null);
  };

  const handleSaveAbout = (e) => {
    e.preventDefault();
    onSaveAbout(aboutForm);
    setEditingSection(null);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Image size={18} className="text-[#15c8fb]" /> Hero Section
          </h2>
          {!editingSection && (
            <button onClick={startEditHero} className="inline-flex items-center gap-2 rounded-lg border border-[#15c8fb]/30 px-4 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {editingSection === 'hero' ? (
          <form onSubmit={handleSaveHero} className="space-y-4">
            <Field label="Title"><TextInput value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} placeholder="Welcome to Elevate Skill" /></Field>
            <Field label="Subtitle"><TextArea value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} rows="3" placeholder="Grow your skills today" /></Field>
            <Field label="CTA text"><TextInput value={heroForm.cta_text} onChange={(e) => setHeroForm({ ...heroForm, cta_text: e.target.value })} placeholder="Explore Courses" /></Field>
            <Field label="CTA link"><TextInput value={heroForm.cta_link} onChange={(e) => setHeroForm({ ...heroForm, cta_link: e.target.value })} placeholder="/courses/" /></Field>
            <Field label="Background image">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/30 bg-gray-50 dark:bg-gray-900 px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-all hover:border-[#15c8fb]/50">
                <Upload size={18} />
                <span>{heroForm.background_image?.name || 'Click to upload'}</span>
                <input type="file" accept="image/*" onChange={(e) => setHeroForm({ ...heroForm, background_image: e.target.files?.[0] || null })} className="hidden" />
              </label>
            </Field>
            <div className="flex gap-2 pt-2">
              <button disabled={saving} type="submit" className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                <Save size={16} className="inline mr-2" /> Update Hero
              </button>
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-bold text-gray-500">Title:</span>
              <p className="text-gray-900 dark:text-white mt-1">{heroData?.title || 'Not set'}</p>
            </div>
            <div>
              <span className="font-bold text-gray-500">Subtitle:</span>
              <p className="text-gray-900 dark:text-white mt-1">{heroData?.subtitle || 'Not set'}</p>
            </div>
            <div>
              <span className="font-bold text-gray-500">CTA:</span>
              <p className="text-gray-900 dark:text-white mt-1">{heroData?.cta_text || 'Not set'} → {heroData?.cta_link || 'Not set'}</p>
            </div>
            {heroData?.background_image && (
              <div>
                <span className="font-bold text-gray-500">Background:</span>
                <p className="text-gray-900 dark:text-white mt-1">✅ Image uploaded</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <FileText size={18} className="text-[#15c8fb]" /> About Section
          </h2>
          {!editingSection && (
            <button onClick={startEditAbout} className="inline-flex items-center gap-2 rounded-lg border border-[#15c8fb]/30 px-4 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {editingSection === 'about' ? (
          <form onSubmit={handleSaveAbout} className="space-y-4">
            <Field label="Title"><TextInput value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} placeholder="About Elevate Skill" /></Field>
            <Field label="Content"><TextArea value={aboutForm.content} onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })} rows="8" placeholder="Tell your story..." /></Field>
            <Field label="Image">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/30 bg-gray-50 dark:bg-gray-900 px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-all hover:border-[#15c8fb]/50">
                <Upload size={18} />
                <span>{aboutForm.image?.name || 'Click to upload'}</span>
                <input type="file" accept="image/*" onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.files?.[0] || null })} className="hidden" />
              </label>
            </Field>
            <div className="flex gap-2 pt-2">
              <button disabled={saving} type="submit" className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                <Save size={16} className="inline mr-2" /> Update About
              </button>
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-bold text-gray-500">Title:</span>
              <p className="text-gray-900 dark:text-white mt-1">{aboutData?.title || 'Not set'}</p>
            </div>
            <div>
              <span className="font-bold text-gray-500">Content:</span>
              <p className="text-gray-900 dark:text-white mt-1 line-clamp-3">{aboutData?.content || 'Not set'}</p>
            </div>
            {aboutData?.image && (
              <div>
                <span className="font-bold text-gray-500">Image:</span>
                <p className="text-gray-900 dark:text-white mt-1">✅ Image uploaded</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Settings size={18} className="text-[#15c8fb]" /> Site Settings
          </h2>
          {!editingSection && (
            <button onClick={startEditSettings} className="inline-flex items-center gap-2 rounded-lg border border-[#15c8fb]/30 px-4 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {editingSection === 'settings' ? (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <Field label="Site name"><TextInput value={settingsForm.site_name} onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })} placeholder="Elevate Skill LMS" /></Field>
            <Field label="Contact info"><TextArea value={settingsForm.contact_info} onChange={(e) => setSettingsForm({ ...settingsForm, contact_info: e.target.value })} rows="3" placeholder="support@elevateskill.com" /></Field>
            <Field label="Bank details"><TextArea value={settingsForm.bank_details} onChange={(e) => setSettingsForm({ ...settingsForm, bank_details: e.target.value })} rows="3" /></Field>
            <Field label="Payment instructions"><TextArea value={settingsForm.payment_instructions} onChange={(e) => setSettingsForm({ ...settingsForm, payment_instructions: e.target.value })} rows="4" /></Field>
            <div className="flex gap-2 pt-2">
              <button disabled={saving} type="submit" className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
                <Save size={16} className="inline mr-2" /> Update Settings
              </button>
              <button type="button" onClick={cancelEdit} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-bold text-gray-500">Site name:</span>
              <p className="text-gray-900 dark:text-white mt-1">{settingsData?.site_name || 'Not set'}</p>
            </div>
            <div>
              <span className="font-bold text-gray-500">Contact info:</span>
              <p className="text-gray-900 dark:text-white mt-1 line-clamp-2">{settingsData?.contact_info || 'Not set'}</p>
            </div>
            <div>
              <span className="font-bold text-gray-500">Bank details:</span>
              <p className="text-gray-900 dark:text-white mt-1 line-clamp-2">{settingsData?.bank_details || 'Not set'}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
