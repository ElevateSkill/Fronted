import { useLocation, useNavigate } from 'react-router-dom';
import { Image, FileText, Settings, Star, HelpCircle, LayoutDashboard } from 'lucide-react';

const cmsTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin/cms' },
  { id: 'hero', label: 'Hero', icon: Image, path: '/admin/cms/hero' },
  { id: 'about', label: 'About', icon: FileText, path: '/admin/cms/about' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/cms/settings' },
  { id: 'testimonials', label: 'Testimonials', icon: Star, path: '/admin/cms/testimonials' },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle, path: '/admin/cms/faqs' },
];

export default function CmsSubNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeId = cmsTabs.find((t) => {
    if (t.path === '/admin/cms') return location.pathname === '/admin/cms';
    return location.pathname.startsWith(t.path);
  })?.id || 'overview';

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6">
      {cmsTabs.map(({ id, label, icon: Icon, path }) => (
        <button
          key={id}
          onClick={() => navigate(path)}
          className={`inline-flex items-center gap-1.5 shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
            activeId === id
              ? 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white shadow-sm'
              : 'bg-white dark:bg-white/5 text-gray-600 dark:text-white/60 border border-gray-200 dark:border-white/10 hover:border-[#15c8fb]/30 hover:text-[#15c8fb]'
          }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
