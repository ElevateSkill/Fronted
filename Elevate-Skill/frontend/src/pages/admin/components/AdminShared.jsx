import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, X, Loader, Users, BookOpen, GraduationCap,
  Clock, XCircle, BarChart3, Tags, CreditCard, Megaphone, Settings, FileText, User, UserPlus
} from 'lucide-react';
import { api } from '../../../services/api';

export const accent = {
  button: 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white font-black hover:brightness-110 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-[#15c8fb]/20',
  panel: 'border-[#15c8fb]/20 bg-surface',
};

export const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3, path: '/admin' },
  { id: 'courses', label: 'Courses', icon: BookOpen, path: '/admin/courses' },
  { id: 'categories', label: 'Categories', icon: Tags, path: '/admin/categories' },
  { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { id: 'announcements', label: 'Updates', icon: Megaphone, path: '/admin/announcements' },
  { id: 'cms', label: 'Homepage CMS', icon: Settings, path: '/admin/cms' },
  { id: 'export', label: 'Export', icon: FileText, path: '/admin/export' },
  { id: 'users', label: 'Users', icon: UserPlus, path: '/admin/users' },
];

export function formatDate(value) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function statusClass(status) {
  const key = String(status || '').toLowerCase();
  if (key === 'approved' || key === 'active' || key === 'published') return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
  if (key === 'rejected' || key === 'cancelled' || key === 'inactive') return 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
  return 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
}

export function Badge({ children }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClass(children)}`}>{children || 'pending'}</span>;
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-gray-900 dark:text-white">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input {...props} className={`w-full rounded-xl border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 focus:border-[#15c8fb]/50 focus:ring-4 focus:ring-[#15c8fb]/10 shadow-sm ${props.className || ''}`} />;
}

export function TextArea(props) {
  return <textarea {...props} className={`w-full rounded-xl border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 focus:border-[#15c8fb]/50 focus:ring-4 focus:ring-[#15c8fb]/10 shadow-sm ${props.className || ''}`} />;
}

export function Select(props) {
  return <select {...props} className={`w-full rounded-xl border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 focus:border-[#15c8fb]/50 focus:ring-4 focus:ring-[#15c8fb]/10 shadow-sm ${props.className || ''}`} />;
}

export function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const start = prev.current;
    const end = Number(value);
    prev.current = end;
    if (start === end) { setDisplay(end); return; }
    const duration = 600;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{display}</>;
}

const statTones = {
  red: {
    bg: 'bg-[#15c8fb]/10',
    text: 'text-[#15c8fb]',
    border: 'border-[#15c8fb]/20',
    cardBorder: 'border-[#15c8fb]/20',
    gradient: 'from-[#15c8fb]/5 via-surface to-surface',
  },
  orange: {
    bg: 'bg-[#f89f29]/10',
    text: 'text-[#f89f29]',
    border: 'border-[#f89f29]/20',
    cardBorder: 'border-[#f89f29]/20',
    gradient: 'from-[#f89f29]/5 via-surface to-surface',
  },
  green: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    cardBorder: 'border-emerald-500/20',
    gradient: 'from-emerald-500/5 via-surface to-surface',
  },
  rose: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    cardBorder: 'border-rose-500/20',
    gradient: 'from-rose-500/5 via-surface to-surface',
  },
};

export function StatCard({ label, value, icon: Icon, tone = 'red' }) {
  const t = statTones[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-xl border ${t.cardBorder} bg-white dark:bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${t.gradient.replace(' via-surface to-surface', '')}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            <AnimatedCounter value={value} />
          </p>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.border}`}>
          <Icon size={20} className={t.text} />
        </div>
      </div>
    </motion.div>
  );
}

export function Modal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white">{title || 'Confirm'}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition-colors">{confirmLabel || 'Delete'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

export function ToastMessage({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!message) return null;

  const styles = {
    success: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20',
    error: 'bg-rose-600 text-white shadow-lg shadow-rose-600/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-2 sm:right-4 z-50 flex items-center gap-3 rounded-xl px-4 sm:px-5 py-3 text-sm font-bold shadow-xl ${styles[type] || styles.success}`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity"><X size={16} /></button>
    </motion.div>
  );
}

export function useToast() {
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ message, type });
  const closeToast = () => setToast({ message: '', type: 'success' });
  return { toast, showToast, closeToast };
}

export function useConfirmDelete() {
  const [confirmDelete, setConfirmDelete] = useState({ open: false, action: null });
  const confirmThen = (action) => setConfirmDelete({ open: true, action: () => { setConfirmDelete({ open: false, action: null }); action(); } });
  return { confirmDelete, setConfirmDelete, confirmThen };
}

export function useSaving() {
  const [saving, setSaving] = useState(false);
  const runSave = async (work, successText, showToast) => {
    setSaving(true);
    try {
      await work();
      showToast(successText, 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed. Please check the form and try again.'), 'error');
    } finally {
      setSaving(false);
    }
  };
  return { saving, setSaving, runSave };
}

export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export function objectToFormData(values) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });
  return formData;
}

export function apiError(err, fallback) {
  const data = err?.response?.data;
  if (data?.detail) return data.detail;
  if (typeof data === 'object' && data !== null) {
    const key = Object.keys(data)[0];
    const value = data[key];
    return Array.isArray(value) ? value[0] : String(value);
  }
  return fallback;
}

export const emptyMetrics = {
  total_students: 0,
  total_courses: 0,
  active_courses: 0,
  total_enrollments: 0,
  payments: { pending: 0, approved: 0, rejected: 0 },
  recent_enrollments: [],
};


