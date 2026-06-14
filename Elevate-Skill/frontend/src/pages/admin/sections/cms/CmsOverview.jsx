import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, FileText, Settings as SettingsIcon, Star, HelpCircle, Eye, ArrowRight, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../../services/api';
import CmsSubNav from './CmsSubNav';

const cards = [
  { label: 'Hero Content', desc: 'Edit hero title, subtitle, CTA, and background image', icon: Image, path: '/admin/cms/hero', color: 'from-[#15c8fb] to-[#3b82f6]' },
  { label: 'About Section', desc: 'Manage the about us content and image', icon: FileText, path: '/admin/cms/about', color: 'from-[#f89f29] to-[#f97316]' },
  { label: 'Site Settings', desc: 'Configure site name, contact info, and payment details', icon: SettingsIcon, path: '/admin/cms/settings', color: 'from-[#6366f1] to-[#8b5cf6]' },
  { label: 'Testimonials', desc: 'Manage student testimonials and reviews', icon: Star, path: '/admin/cms/testimonials', color: 'from-[#f59e0b] to-[#eab308]' },
  { label: 'FAQs', desc: 'Create and manage frequently asked questions', icon: HelpCircle, path: '/admin/cms/faqs', color: 'from-[#10b981] to-[#14b8a6]' },
  { label: 'Section Visibility', desc: 'Show or hide homepage sections like About and Contact', icon: Eye, path: '/admin/cms/visibility', color: 'from-[#8b5cf6] to-[#a855f7]' },
];

export default function CmsOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/testimonials/'),
      api.get('/admin/faqs/'),
      api.get('/admin/hero/'),
      api.get('/admin/about/'),
      api.get('/admin/site-settings/'),
    ])
      .then(([testimonialsRes, faqsRes, heroRes, aboutRes, settingsRes]) => {
        setStats({
          testimonials: unwrapResults(testimonialsRes.data).length,
          faqs: unwrapResults(faqsRes.data).length,
          heroExists: !!heroRes.data?.title,
          aboutExists: !!aboutRes.data?.title,
          settingsConfigured: !!settingsRes.data?.site_name,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-1">Content Management</h2>
        <p className="text-sm text-gray-500 mb-4">Manage all homepage content, settings, and dynamic sections.</p>
        <CmsSubNav />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => (
          <motion.button
            key={card.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate(card.path)}
            className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-300 text-left"
          >
            <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm`}>
              <card.icon size={20} />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white">{card.label}</h3>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#15c8fb] group-hover:gap-2 transition-all">
              Manage <ArrowRight size={12} />
            </div>
            {stats && !loading && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-2 text-xs text-gray-400">
                {card.label === 'Testimonials' && <span>{stats.testimonials} entries</span>}
                {card.label === 'FAQs' && <span>{stats.faqs} entries</span>}
                {card.label === 'Hero Content' && <span className={stats.heroExists ? 'text-emerald-500' : 'text-amber-500'}>{stats.heroExists ? 'Configured' : 'Not set'}</span>}
                {card.label === 'About Section' && <span className={stats.aboutExists ? 'text-emerald-500' : 'text-amber-500'}>{stats.aboutExists ? 'Configured' : 'Not set'}</span>}
                {card.label === 'Site Settings' && <span className={stats.settingsConfigured ? 'text-emerald-500' : 'text-amber-500'}>{stats.settingsConfigured ? 'Configured' : 'Not set'}</span>}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
