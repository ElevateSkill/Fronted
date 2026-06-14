import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Save, Loader, Info } from 'lucide-react';
import CmsSubNav from './CmsSubNav';
import { ToastMessage, useToast, accent } from '../../components/AdminShared';

const STORAGE_KEY = 'elevateskill_section_visibility';

const defaultVisibility = {
  hero: true,
  news: true,
  services: true,
  courses: true,
  testimonials: true,
  faq: true,
  blog: true,
  about: true,
  contact: true,
};

function loadVisibility() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultVisibility, ...parsed };
    }
  } catch {}
  return { ...defaultVisibility };
}

export default function SectionsVisibility() {
  const [visibility, setVisibility] = useState(loadVisibility);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    setVisibility(loadVisibility());
  }, []);

  const toggle = (key) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
        showToast('Section visibility updated.', 'success');
      } catch {
        showToast('Failed to save visibility settings.', 'error');
      }
      setSaving(false);
    }, 300);
  };

  const sections = [
    {
      key: 'hero',
      label: 'Hero / Landing',
      desc: 'Show or hide the hero/landing section on the homepage.',
    },
    {
      key: 'news',
      label: 'Latest News',
      desc: 'Show or hide the latest news section on the homepage.',
    },
    {
      key: 'services',
      label: 'Services',
      desc: 'Show or hide the Services section (Solutions For GROWTH).',
    },
    {
      key: 'courses',
      label: 'Courses',
      desc: 'Show or hide the Courses section on the homepage.',
    },
    {
      key: 'testimonials',
      label: 'Testimonials',
      desc: 'Show or hide the Testimonials section on the homepage.',
    },
    {
      key: 'faq',
      label: 'FAQ',
      desc: 'Show or hide the FAQ section on the homepage.',
    },
    {
      key: 'blog',
      label: 'Blog',
      desc: 'Show or hide the Blog section on the homepage.',
    },
    {
      key: 'about',
      label: 'About Section',
      desc: 'Show or hide the About section on the homepage.',
    },
    {
      key: 'contact',
      label: 'Contact Section',
      desc: 'Show or hide the Contact section on the homepage.',
    },
  ];

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
          <div className="flex items-center gap-2 mb-1">
            <Eye size={18} className="text-[#15c8fb]" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Section Visibility
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Toggle homepage sections on or off. Changes are saved locally and applied immediately.
          </p>

          <div className="space-y-4">
            {sections.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900/50 p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                      {label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        visibility[key]
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                      }`}
                    >
                      {visibility[key] ? (
                        <><Eye size={10} /> Visible</>
                      ) : (
                        <><EyeOff size={10} /> Hidden</>
                      )}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    visibility[key]
                      ? 'bg-emerald-500'
                      : 'bg-gray-300 dark:bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      visibility[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-4">
            <Info size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              These settings affect only the homepage. The standalone About page (/about) and Contact page remain accessible regardless of these toggles.
            </p>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}
          >
            {saving ? (
              <Loader className="animate-spin inline mr-2" size={16} />
            ) : (
              <Save size={16} className="inline mr-2" />
            )}
            Save Visibility Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
