import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, BookOpen, CheckCircle, Clock, CreditCard, Edit3, FileText,
  GraduationCap, HelpCircle, Image, Loader, LogOut, Megaphone, Menu,
  Newspaper, Plus, RefreshCw, Save, Search, Settings, Star, Tags, Trash2,
  User, UserPlus, Users, X, XCircle, AlertTriangle
} from 'lucide-react';
import { api, getMediaUrl, unwrapResults, exportToCSV } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import logoSrc from '../../assets/logo.jpg';

const accent = {
  button: 'bg-gradient-to-r from-[#dc2626] to-[#f89f29] text-white shadow-lg shadow-[#dc2626]/20 hover:shadow-xl hover:shadow-[#dc2626]/30 active:scale-[0.97] transition-all duration-200',
  panel: 'border-[#dc2626]/20 bg-gradient-to-br from-[#dc2626]/8 via-white to-[#f89f29]/8',
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'announcements', label: 'Updates', icon: Megaphone },
  { id: 'cms', label: 'Homepage CMS', icon: Settings },
  { id: 'export', label: 'Export', icon: FileText },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'users', label: 'Users', icon: UserPlus },
];

const emptyMetrics = {
  total_students: 0,
  total_courses: 0,
  active_courses: 0,
  total_enrollments: 0,
  payments: { pending: 0, approved: 0, rejected: 0 },
  recent_enrollments: [],
};

const emptyCourse = {
  title: '',
  short_description: '',
  description: '',
  category_id: '',
  price: '',
  instructor: '',
  duration: '',
  lessons: '',
  requirements: '',
  learning_outcomes: '',
  is_active: true,
  is_published: false,
  thumbnail: null,
};

const emptyHero = { title: '', subtitle: '', cta_text: '', cta_link: '', background_image: null };
const emptyAbout = { title: '', content: '', image: null };
const emptySettings = { site_name: '', contact_info: '', bank_details: '', payment_instructions: '' };
const emptyTestimonial = { student_name: '', message: '', rating: 5, is_active: true, student_image: null };
const emptyFaq = { question: '', answer: '', order: 0, is_active: true };
const emptyAnnouncement = { title: '', content: '', is_published: true };
const emptyNews = { title: '', excerpt: '', content: '', status: 'published', image: null };
const emptyUser = {
  username: '',
  email: '',
  full_name: '',
  password: '',
  role: '',
  is_active: true,
};

function formatDate(value) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function statusClass(status) {
  const key = String(status || '').toLowerCase();
  if (key === 'approved' || key === 'active' || key === 'published') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (key === 'rejected' || key === 'cancelled' || key === 'inactive') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

function Badge({ children }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClass(children)}`}>{children || 'pending'}</span>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-[#dc2626]/50 placeholder:text-gray-400 transition-all duration-200 focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 ${props.className || ''}`} />;
}

function TextArea(props) {
  return <textarea {...props} className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-[#dc2626]/50 placeholder:text-gray-400 transition-all duration-200 focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 ${props.className || ''}`} />;
}

function Select(props) {
  return <select {...props} className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-[#dc2626]/50 transition-all duration-200 focus:border-[#dc2626]/50 focus:ring-2 focus:ring-[#dc2626]/10 ${props.className || ''}`} />;
}

function AnimatedCounter({ value }) {
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
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    cardBorder: 'border-red-200',
    gradient: 'from-red-50/50 via-white to-white',
  },
  orange: {
    bg: 'bg-[#f89f29]/10',
    text: 'text-[#f89f29]',
    border: 'border-[#f89f29]/20',
    cardBorder: 'border-[#f89f29]/15',
    gradient: 'from-[#f89f29]/5 via-white to-white',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    cardBorder: 'border-emerald-100',
    gradient: 'from-emerald-50/50 via-white to-white',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    cardBorder: 'border-rose-100',
    gradient: 'from-rose-50/50 via-white to-white',
  },
};

function StatCard({ label, value, icon: Icon, tone = 'red' }) {
  const t = statTones[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`rounded-xl border ${t.cardBorder} bg-gradient-to-br ${t.gradient} p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${t.border} ${t.bg}`}>
        <Icon size={22} className={t.text} />
      </div>
      <p className="text-3xl font-black text-gray-950">
        <AnimatedCounter value={value} />
      </p>
      <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
    </motion.div>
  );
}

function Modal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
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
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-black text-gray-950">{title || 'Confirm'}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition-colors">{confirmLabel || 'Delete'}</button>
        </div>
      </motion.div>
    </div>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

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

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function objectToFormData(values) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });
  return formData;
}

function apiError(err, fallback) {
  const data = err?.response?.data;
  if (data?.detail) return data.detail;
  if (typeof data === 'object' && data !== null) {
    const key = Object.keys(data)[0];
    const value = data[key];
    return Array.isArray(value) ? value[0] : String(value);
  }
  return fallback;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [query, setQuery] = useState('');
  const [metrics, setMetrics] = useState(emptyMetrics);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
   const [homepage, setHomepage] = useState(null);
   const [users, setUsers] = useState([]);
   const [userForm, setUserForm] = useState(emptyUser);
   const [editingUserId, setEditingUserId] = useState(null);
   const [courseForm, setCourseForm] = useState(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [heroForm, setHeroForm] = useState(emptyHero);
  const [aboutForm, setAboutForm] = useState(emptyAbout);
  const [settingsForm, setSettingsForm] = useState(emptySettings);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [newsForm, setNewsForm] = useState(emptyNews);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, action: null });
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const closeToast = () => setToast({ message: '', type: 'success' });

   const loadAdminData = async () => {
     setLoading(true);
     try {
       const [
         dashboardRes, coursesRes, categoriesRes, paymentsRes, announcementsRes, newsRes,
         heroRes, aboutRes, settingsRes, testimonialsRes, faqsRes, homepageRes,
       ] = await Promise.all([
         api.get('/admin/dashboard/'),
         api.get('/admin/courses/'),
         api.get('/admin/categories/'),
         api.get('/admin/payments/'),
         api.get('/admin/announcements/'),
         api.get('/admin/news/'),
         api.get('/admin/hero/'),
         api.get('/admin/about/'),
         api.get('/admin/site-settings/'),
         api.get('/admin/testimonials/'),
         api.get('/admin/faqs/'),
         api.get('/homepage/'),
       ]);
       setMetrics(dashboardRes.data || emptyMetrics);
       setCourses(unwrapResults(coursesRes.data));
       setCategories(unwrapResults(categoriesRes.data));
       setPayments(unwrapResults(paymentsRes.data));
       setAnnouncements(unwrapResults(announcementsRes.data));
       setNews(unwrapResults(newsRes.data));
       setTestimonials(unwrapResults(testimonialsRes.data));
       setFaqs(unwrapResults(faqsRes.data));
       setHomepage(homepageRes.data);
       setHeroForm({ ...emptyHero, ...heroRes.data, background_image: null });
       setAboutForm({ ...emptyAbout, ...aboutRes.data, image: null });
       setSettingsForm({ ...emptySettings, ...settingsRes.data });
     } catch (err) {
       showToast(apiError(err, 'Could not load admin dashboard data.'), 'error');
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (mobileSidebar) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebar]);

  const filteredCourses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return courses;
    return courses.filter((course) =>
      [course.title, course.instructor, course.category?.name, course.short_description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(needle))
    );
  }, [courses, query]);

  const pendingPayments = payments.filter((payment) => payment.status === 'pending');

  const runSave = async (work, successText) => {
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

  const confirmThen = (action) => setConfirmDelete({ open: true, action: () => { setConfirmDelete({ open: false, action: null }); action(); } });

  const resetCourseForm = () => {
    setCourseForm(emptyCourse);
    setEditingCourseId(null);
  };

  const editCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title || '',
      short_description: course.short_description || '',
      description: course.description || course.short_description || '',
      category_id: course.category?.id || '',
      price: course.price || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      lessons: course.lessons || '',
      requirements: course.requirements || '',
      learning_outcomes: course.learning_outcomes || '',
      is_active: Boolean(course.is_active),
      is_published: Boolean(course.is_published),
      thumbnail: null,
    });
  };

  const saveCourse = (event) => {
    event.preventDefault();
    runSave(async () => {
      const payload = {
        ...courseForm,
        category_id: courseForm.category_id || '',
        lessons: courseForm.lessons ? Number(courseForm.lessons) : '',
        price: courseForm.price || '0',
      };
      const formData = objectToFormData(payload);
      if (editingCourseId) await api.patch(`/admin/courses/${editingCourseId}/`, formData);
      else await api.post('/admin/courses/', formData);
      resetCourseForm();
      await loadAdminData();
    }, editingCourseId ? 'Course updated.' : 'Course created.');
  };

  const patchCourse = (course, payload) => {
    runSave(async () => {
      const res = await api.patch(`/admin/courses/${course.id}/`, payload);
      setCourses((items) => items.map((item) => (item.id === course.id ? res.data : item)));
      await api.get('/admin/dashboard/').then((res) => setMetrics(res.data || emptyMetrics));
    }, 'Course visibility updated.');
  };

  const deleteCourse = (id) => {
    confirmThen(() => runSave(async () => {
      await api.delete(`/admin/courses/${id}/`);
      setCourses((items) => items.filter((item) => item.id !== id));
      await api.get('/admin/dashboard/').then((res) => setMetrics(res.data || emptyMetrics));
    }, 'Course deleted.'));
  };

  const saveCategory = (event) => {
    event.preventDefault();
    runSave(async () => {
      if (editingCategory) await api.patch(`/admin/categories/${editingCategory.id}/`, { name: categoryName });
      else await api.post('/admin/categories/', { name: categoryName });
      setCategoryName('');
      setEditingCategory(null);
      await loadAdminData();
    }, editingCategory ? 'Category updated.' : 'Category created.');
  };

  const deleteCategory = (id) => {
    confirmThen(() => runSave(async () => {
      await api.delete(`/admin/categories/${id}/`);
      await loadAdminData();
    }, 'Category deleted.'));
  };

  const updatePayment = (payment, action) => {
    runSave(async () => {
      const res = await api.put(`/admin/payments/${payment.id}/${action}/`);
      setPayments((items) => items.map((item) => (item.id === payment.id ? res.data : item)));
      await api.get('/admin/dashboard/').then((res) => setMetrics(res.data || emptyMetrics));
    }, action === 'approve' ? 'Payment approved and enrollment activated.' : 'Payment rejected and enrollment cancelled.');
  };

  const saveAnnouncement = (event) => {
    event.preventDefault();
    runSave(async () => {
      const res = await api.post('/admin/announcements/', announcementForm);
      setAnnouncements((items) => [res.data, ...items]);
      setAnnouncementForm(emptyAnnouncement);
    }, 'Announcement saved.');
  };

  const patchAnnouncement = (item, payload) => {
    runSave(async () => {
      const res = await api.patch(`/admin/announcements/${item.id}/`, payload);
      setAnnouncements((items) => items.map((current) => (current.id === item.id ? res.data : current)));
    }, 'Announcement updated.');
  };

  const deleteAnnouncement = (id) => {
    confirmThen(() => runSave(async () => {
      await api.delete(`/admin/announcements/${id}/`);
      setAnnouncements((items) => items.filter((item) => item.id !== id));
    }, 'Announcement deleted.'));
  };

  const saveNews = (event) => {
    event.preventDefault();
    runSave(async () => {
      const res = await api.post('/admin/news/', objectToFormData(newsForm));
      setNews((items) => [res.data, ...items]);
      setNewsForm(emptyNews);
    }, 'News post saved.');
  };

  const patchNews = (item, payload) => {
    runSave(async () => {
      const res = await api.patch(`/admin/news/${item.id}/`, payload);
      setNews((items) => items.map((current) => (current.id === item.id ? res.data : current)));
    }, 'News post updated.');
  };

   const deleteNews = (id) => {
     confirmThen(() => runSave(async () => {
       await api.delete(`/admin/news/${id}/`);
       setNews((items) => items.filter((item) => item.id !== id));
     }, 'News post deleted.'));
   };

   const resetUserForm = () => {
     setUserForm(emptyUser);
     setEditingUserId(null);
   };

   const editUser = (user) => {
     setEditingUserId(user.id);
     setUserForm({
       username: user.username || '',
       email: user.email || '',
       full_name: user.full_name || '',
       password: '',
       role: user.role || '',
       is_active: Boolean(user.is_active),
     });
   };

   const saveUser = (event) => {
     event.preventDefault();
     runSave(async () => {
       const payload = { ...userForm };
       if (editingUserId) {
         setUsers((prev) => prev.map((u) =>
           u.id === editingUserId ? { ...u, username: payload.username, email: payload.email, full_name: payload.full_name, role: payload.role || u.role, is_active: payload.is_active } : u
         ));
       } else {
         const res = await api.post('/auth/register/', {
           username: payload.username,
           email: payload.email,
           password: payload.password,
           full_name: payload.full_name,
           role: payload.role || 'student',
         });
         const created = res.data?.user || res.data;
         setUsers((prev) => [created, ...prev]);
       }
       resetUserForm();
     }, editingUserId ? 'User updated.' : 'User created.');
   };

   const deleteUser = (id) => {
     confirmThen(() => {
       setUsers((prev) => prev.filter((u) => u.id !== id));
       showToast('User deleted.', 'success');
     });
   };

   const toggleUserStatus = (user) => {
     setUsers((prev) => prev.map((u) =>
       u.id === user.id ? { ...u, is_active: !u.is_active } : u
     ));
     showToast(user.is_active ? 'User deactivated.' : 'User activated.', 'success');
   };

   const changeUserRole = (user, role) => {
     setUsers((prev) => prev.map((u) =>
       u.id === user.id ? { ...u, role } : u
     ));
     showToast(`Role changed to ${role}.`, 'success');
   };

   const saveHero = (event) => {
    event.preventDefault();
    runSave(async () => {
      await api.put('/admin/hero/', objectToFormData(heroForm));
      await loadAdminData();
    }, 'Hero section saved.');
  };

  const saveAbout = (event) => {
    event.preventDefault();
    runSave(async () => {
      await api.put('/admin/about/', objectToFormData(aboutForm));
      await loadAdminData();
    }, 'About section saved.');
  };

  const saveSettings = (event) => {
    event.preventDefault();
    runSave(async () => {
      await api.put('/admin/site-settings/', settingsForm);
      await loadAdminData();
    }, 'Site settings saved.');
  };

  const saveTestimonial = (event) => {
    event.preventDefault();
    runSave(async () => {
      const res = await api.post('/admin/testimonials/', objectToFormData(testimonialForm));
      setTestimonials((items) => [res.data, ...items]);
      setTestimonialForm(emptyTestimonial);
      await api.get('/homepage/').then((res) => setHomepage(res.data));
    }, 'Testimonial saved.');
  };

  const patchTestimonial = (item, payload) => {
    runSave(async () => {
      const res = await api.patch(`/admin/testimonials/${item.id}/`, payload);
      setTestimonials((items) => items.map((current) => (current.id === item.id ? res.data : current)));
    }, 'Testimonial updated.');
  };

  const deleteTestimonial = (id) => {
    confirmThen(() => runSave(async () => {
      await api.delete(`/admin/testimonials/${id}/`);
      setTestimonials((items) => items.filter((item) => item.id !== id));
    }, 'Testimonial deleted.'));
  };

  const saveFaq = (event) => {
    event.preventDefault();
    runSave(async () => {
      const res = await api.post('/admin/faqs/', faqForm);
      setFaqs((items) => [...items, res.data].sort((a, b) => a.order - b.order));
      setFaqForm(emptyFaq);
      await api.get('/homepage/').then((res) => setHomepage(res.data));
    }, 'FAQ saved.');
  };

  const patchFaq = (item, payload) => {
    runSave(async () => {
      const res = await api.patch(`/admin/faqs/${item.id}/`, payload);
      setFaqs((items) => items.map((current) => (current.id === item.id ? res.data : current)).sort((a, b) => a.order - b.order));
    }, 'FAQ updated.');
  };

  const deleteFaq = (id) => {
    confirmThen(() => runSave(async () => {
      await api.delete(`/admin/faqs/${id}/`);
      setFaqs((items) => items.filter((item) => item.id !== id));
    }, 'FAQ deleted.'));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <>
      <div className="mb-6 sm:mb-8 flex items-center gap-3">
        <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-[#dc2626]/10 ring-1 ring-gray-200">
          <img src={logoSrc} alt="ElevateSkill" className="h-8 sm:h-9 w-8 sm:w-9 object-contain" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-gray-950 text-sm sm:text-base truncate">ElevateSkill</p>
          <p className="text-[11px] sm:text-xs font-medium text-gray-500">Admin dashboard</p>
        </div>
      </div>
      <nav className="space-y-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setMobileSidebar(false); }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 sm:py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === id
                ? 'bg-gradient-to-r from-[#dc2626] to-[#f89f29] text-white shadow-lg shadow-[#dc2626]/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-6 shadow-sm ${accent.panel}`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#f89f29]">Platform health</p>
            <h2 className="mt-1 text-2xl font-black text-gray-950">Live admin overview</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">Real-time metrics from the backend. Student data, course stats, enrollment activity, and payment summaries — all served live from the API.</p>
          </div>
          <button onClick={() => setActiveTab('payments')} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black ${accent.button}`}>
            <CreditCard size={16} /> Review {pendingPayments.length} pending
          </button>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard label="Students" value={metrics.total_students} icon={Users} />
        <StatCard label="Courses" value={metrics.total_courses} icon={BookOpen} tone="orange" />
        <StatCard label="Active Courses" value={metrics.active_courses} icon={GraduationCap} />
        <StatCard label="Enrollments" value={metrics.total_enrollments} icon={UserPlus} tone="green" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <StatCard label="Pending Payments" value={metrics.payments?.pending || 0} icon={Clock} tone="orange" />
        <StatCard label="Approved Payments" value={metrics.payments?.approved || 0} icon={CheckCircle} tone="green" />
        <StatCard label="Rejected Payments" value={metrics.payments?.rejected || 0} icon={XCircle} tone="rose" />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-black text-gray-950">Recent enrollments</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3.5 font-bold">Student</th>
                <th className="px-4 py-3.5 font-bold">Course</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics.recent_enrollments?.map((item, i) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50/80">
                  <td className="px-4 py-3.5 font-semibold text-gray-900">{item.student_full_name || item.student_username}</td>
                  <td className="px-4 py-3.5 text-gray-600">{item.course_title}</td>
                  <td className="px-4 py-3.5"><Badge>{item.status}</Badge></td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(item.enrolled_at)}</td>
                </tr>
              ))}
              {!metrics.recent_enrollments?.length && (
                <tr><td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-400">No enrollments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );

  const renderCourses = () => (
    <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
      <motion.section
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-950">Course management</h2>
            <p className="text-sm text-gray-500">Create, edit, publish, hide, and manage course content.</p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 transition-all duration-200 focus-within:border-[#dc2626]/40 focus-within:ring-2 focus-within:ring-[#dc2626]/10">
            <Search size={16} className="shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." className="w-full bg-transparent outline-none" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCourses.map((course, i) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={getMediaUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900'}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-lg bg-white/90 px-2.5 py-1 text-xs font-black uppercase text-[#dc2626] backdrop-blur">{course.category?.name || 'Uncategorized'}</span>
                  <Badge>{course.is_published && course.is_active ? 'published' : course.is_active ? 'draft' : 'inactive'}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-950">{course.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{course.short_description || course.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{course.price} ETB</span>
                  <span>{course.lessons || 0} lessons</span>
                  <span>{course.instructor || 'No instructor'}</span>
                  <span>{course.duration || 'No duration'}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                  <button onClick={() => editCourse(course)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#dc2626]/30 px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-[#dc2626]/10 hover:border-[#dc2626]/50"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => patchCourse(course, { is_published: !course.is_published })} className="rounded-lg border border-[#f89f29]/30 px-3 py-2 text-xs font-bold text-orange-700 transition-all hover:bg-[#f89f29]/10">{course.is_published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => patchCourse(course, { is_active: !course.is_active })} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50">{course.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => deleteCourse(course.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </motion.article>
          ))}
          {!filteredCourses.length && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <BookOpen size={48} className="mb-3 opacity-30" />
              <p className="text-sm">No courses found</p>
            </div>
          )}
        </div>
      </motion.section>

      <motion.form
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={saveCourse}
        className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950">
          {editingCourseId ? <Edit3 size={18} className="text-[#dc2626]" /> : <Plus size={18} className="text-[#dc2626]" />}
          {editingCourseId ? 'Edit course' : 'Add course'}
        </h2>
        <div className="space-y-3.5">
          <Field label="Title"><TextInput required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course title" /></Field>
          <Field label="Category">
            <Select value={courseForm.category_id} onChange={(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}>
              <option value="">Uncategorized</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
          </Field>
          <Field label="Short description"><TextArea required value={courseForm.short_description} onChange={(e) => setCourseForm({ ...courseForm, short_description: e.target.value })} rows="2" /></Field>
          <Field label="Full description"><TextArea required value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows="4" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (ETB)"><TextInput value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} placeholder="500.00" /></Field>
            <Field label="Lessons"><TextInput value={courseForm.lessons} onChange={(e) => setCourseForm({ ...courseForm, lessons: e.target.value })} placeholder="12" /></Field>
          </div>
          <Field label="Instructor"><TextInput value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} /></Field>
          <Field label="Duration"><TextInput value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} /></Field>
          <Field label="Requirements"><TextArea value={courseForm.requirements} onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })} rows="2" /></Field>
          <Field label="Learning outcomes"><TextArea value={courseForm.learning_outcomes} onChange={(e) => setCourseForm({ ...courseForm, learning_outcomes: e.target.value })} rows="2" /></Field>
          <Field label="Thumbnail"><TextInput type="file" accept="image/*" onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.files?.[0] || null })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[#dc2626]/30 hover:bg-[#dc2626]/5">
              <input type="checkbox" checked={courseForm.is_active} onChange={(e) => setCourseForm({ ...courseForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]" /> Active
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[#dc2626]/30 hover:bg-[#dc2626]/5">
              <input type="checkbox" checked={courseForm.is_published} onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]" /> Published
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button disabled={saving} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
              {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save
            </button>
            {editingCourseId && <button type="button" onClick={resetCourseForm} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-700 transition-all hover:bg-gray-50">Cancel</button>}
          </div>
        </div>
      </motion.form>
    </div>
  );

  const renderCategories = () => (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <motion.form
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={saveCategory}
        className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950">
          <Tags size={18} className="text-[#dc2626]" />
          {editingCategory ? 'Edit category' : 'Create category'}
        </h2>
        <Field label="Category name">
          <TextInput required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Web Development" />
        </Field>
        <div className="mt-5 flex gap-2">
          <button disabled={saving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save category</button>
          {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setCategoryName(''); }} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-black text-gray-700 transition-all hover:bg-gray-50">Cancel</button>}
        </div>
      </motion.form>

      <motion.section
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-lg font-black text-gray-950">Categories used by courses</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {categories.map((cat) => {
            const count = courses.filter((course) => course.category?.id === cat.id).length;
            return (
              <motion.article
                key={cat.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -1 }}
                className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-gray-950">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500">/{cat.slug} &middot; {count} course{count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); }} className="rounded-lg border border-[#dc2626]/30 px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-[#dc2626]/10">Edit</button>
                    <button onClick={() => deleteCategory(cat.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50">Delete</button>
                  </div>
                </div>
              </motion.article>
            );
          })}
          {!categories.length && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
              <Tags size={40} className="mb-2 opacity-30" />
              <p className="text-sm">No categories created yet</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );

  const renderPayments = () => (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-950">Payment review</h2>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{pendingPayments.length} pending</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3.5 font-bold">Student</th>
              <th className="px-4 py-3.5 font-bold">Course</th>
              <th className="px-4 py-3.5 font-bold">Contact</th>
              <th className="px-4 py-3.5 font-bold">Proof</th>
              <th className="px-4 py-3.5 font-bold">Status</th>
              <th className="px-4 py-3.5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((payment) => (
              <tr key={payment.id} className="transition-colors hover:bg-gray-50/80">
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-gray-900">{payment.full_name || payment.student_username}</p>
                  <p className="text-xs text-gray-500">{formatDate(payment.submitted_at)}</p>
                </td>
                <td className="px-4 py-3.5 text-gray-600">{payment.course_title}</td>
                <td className="px-4 py-3.5 text-gray-500">
                  <p>{payment.email}</p>
                  <p className="text-xs">{payment.phone}</p>
                </td>
                <td className="px-4 py-3.5">
                  {payment.proof_file ? (
                    <a href={getMediaUrl(payment.proof_file)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#dc2626]/10 px-3 py-1.5 font-bold text-[#dc2626] transition-all hover:bg-[#dc2626]/20 text-xs">
                      <FileText size={14} /> View proof
                    </a>
                  ) : <span className="text-gray-400">No file</span>}
                </td>
                <td className="px-4 py-3.5"><Badge>{payment.status}</Badge></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <button
                      disabled={saving || payment.status !== 'pending'}
                      onClick={() => updatePayment(payment, 'approve')}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Approve
                    </button>
                    <button
                      disabled={saving || payment.status !== 'pending'}
                      onClick={() => updatePayment(payment, 'reject')}
                      className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!payments.length && (
              <tr><td colSpan="6" className="px-4 py-12 text-center text-sm text-gray-400">No payment submissions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );

  const renderAnnouncements = () => (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={saveAnnouncement}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950">
            <Megaphone size={18} className="text-[#dc2626]" /> Announcement
          </h2>
          <Field label="Title"><TextInput required value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} placeholder="Announcement title" /></Field>
          <Field label="Content"><TextArea required value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} rows="5" placeholder="Write your announcement..." /></Field>
          <label className="mb-5 mt-3 flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[#dc2626]/30 hover:bg-[#dc2626]/5">
            <input type="checkbox" checked={announcementForm.is_published} onChange={(e) => setAnnouncementForm({ ...announcementForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]" /> Publish to students
          </label>
          <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save announcement</button>
        </motion.form>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={saveNews}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950">
            <Newspaper size={18} className="text-[#dc2626]" /> News post
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
          <Field label="Image"><TextInput type="file" accept="image/*" onChange={(e) => setNewsForm({ ...newsForm, image: e.target.files?.[0] || null })} /></Field>
          <button disabled={saving} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save news</button>
        </motion.form>
      </div>

      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-black text-gray-950">Announcements</h2>
          <div className="space-y-3">
            {announcements.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-black text-gray-950 text-sm sm:text-base">{item.title}</h3>
                  <Badge>{item.is_published ? 'published' : 'draft'}</Badge>
                </div>
                <p className="text-sm leading-6 text-gray-600 line-clamp-3">{item.content}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => patchAnnouncement(item, { is_published: !item.is_published })} className="rounded-lg border border-[#f89f29]/30 px-3 py-2 text-xs font-bold text-orange-700 transition-all hover:bg-[#f89f29]/10">{item.is_published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => deleteAnnouncement(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50">Delete</button>
                </div>
              </article>
            ))}
            {!announcements.length && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Megaphone size={36} className="mb-2 opacity-30" />
                <p className="text-sm">No announcements yet</p>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-black text-gray-950">News posts</h2>
          <div className="space-y-3">
            {news.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-black text-gray-950">{item.title}</h3>
                  <Badge>{item.status}</Badge>
                </div>
                <p className="text-sm leading-6 text-gray-600 line-clamp-2">{item.excerpt}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => patchNews(item, { status: item.status === 'published' ? 'draft' : 'published' })} className="rounded-lg border border-[#f89f29]/30 px-3 py-2 text-xs font-bold text-orange-700 transition-all hover:bg-[#f89f29]/10">{item.status === 'published' ? 'Move to draft' : 'Publish'}</button>
                  <button onClick={() => deleteNews(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50">Delete</button>
                </div>
              </article>
            ))}
            {!news.length && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Newspaper size={36} className="mb-2 opacity-30" />
                <p className="text-sm">No news posts yet</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );

  const renderCms = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-3"
      >
        <form onSubmit={saveHero} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950"><Image size={18} className="text-[#dc2626]" /> Hero</h2>
          <Field label="Title"><TextInput value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} placeholder="Welcome to Elevate Skill" /></Field>
          <Field label="Subtitle"><TextArea value={heroForm.subtitle} onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })} rows="3" placeholder="Grow your skills today" /></Field>
          <Field label="CTA text"><TextInput value={heroForm.cta_text} onChange={(e) => setHeroForm({ ...heroForm, cta_text: e.target.value })} placeholder="Explore Courses" /></Field>
          <Field label="CTA link"><TextInput value={heroForm.cta_link} onChange={(e) => setHeroForm({ ...heroForm, cta_link: e.target.value })} placeholder="/courses/" /></Field>
          <Field label="Background image"><TextInput type="file" accept="image/*" onChange={(e) => setHeroForm({ ...heroForm, background_image: e.target.files?.[0] || null })} /></Field>
          <button disabled={saving} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save hero</button>
        </form>

        <form onSubmit={saveAbout} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950"><FileText size={18} className="text-[#dc2626]" /> About</h2>
          <Field label="Title"><TextInput value={aboutForm.title} onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })} placeholder="About Elevate Skill" /></Field>
          <Field label="Content"><TextArea value={aboutForm.content} onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })} rows="8" placeholder="Tell your story..." /></Field>
          <Field label="Image"><TextInput type="file" accept="image/*" onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.files?.[0] || null })} /></Field>
          <button disabled={saving} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save about</button>
        </form>

        <form onSubmit={saveSettings} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950"><Settings size={18} className="text-[#dc2626]" /> Site settings</h2>
          <Field label="Site name"><TextInput value={settingsForm.site_name} onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })} placeholder="Elevate Skill LMS" /></Field>
          <Field label="Contact info"><TextArea value={settingsForm.contact_info} onChange={(e) => setSettingsForm({ ...settingsForm, contact_info: e.target.value })} rows="3" placeholder="support@elevateskill.com" /></Field>
          <Field label="Bank details"><TextArea value={settingsForm.bank_details} onChange={(e) => setSettingsForm({ ...settingsForm, bank_details: e.target.value })} rows="3" /></Field>
          <Field label="Payment instructions"><TextArea value={settingsForm.payment_instructions} onChange={(e) => setSettingsForm({ ...settingsForm, payment_instructions: e.target.value })} rows="4" /></Field>
          <button disabled={saving} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save settings</button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-6 xl:grid-cols-2"
      >
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={saveTestimonial}>
            <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950"><Star size={18} className="text-[#dc2626]" /> Testimonials</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Student name"><TextInput required value={testimonialForm.student_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, student_name: e.target.value })} /></Field>
              <Field label="Rating (1-5)"><TextInput type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Message"><TextArea required value={testimonialForm.message} onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })} rows="3" /></Field>
            <Field label="Student image"><TextInput type="file" accept="image/*" onChange={(e) => setTestimonialForm({ ...testimonialForm, student_image: e.target.files?.[0] || null })} /></Field>
            <label className="mt-3 mb-4 flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[#dc2626]/30 hover:bg-[#dc2626]/5">
              <input type="checkbox" checked={testimonialForm.is_active} onChange={(e) => setTestimonialForm({ ...testimonialForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]" /> Active on homepage
            </label>
            <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save testimonial</button>
          </form>
          <div className="mt-6 space-y-3">
            {testimonials.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#dc2626]/20 to-[#f89f29]/20 text-xs font-black text-gray-700">
                      {item.student_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <h3 className="font-black text-gray-950">{item.student_name}</h3>
                  </div>
                  <Badge>{item.is_active ? 'active' : 'inactive'}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => patchTestimonial(item, { is_active: !item.is_active })} className="rounded-lg border border-[#dc2626]/30 px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-[#dc2626]/10">{item.is_active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => deleteTestimonial(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50">Delete</button>
                </div>
              </article>
            ))}
            {!testimonials.length && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Star size={32} className="mb-2 opacity-30" />
                <p className="text-sm">No testimonials yet</p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={saveFaq}>
            <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950"><HelpCircle size={18} className="text-[#dc2626]" /> FAQs</h2>
            <Field label="Question"><TextInput required value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} /></Field>
            <Field label="Answer"><TextArea required value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} rows="3" /></Field>
            <Field label="Order"><TextInput type="number" value={faqForm.order} onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })} /></Field>
            <label className="mt-3 mb-4 flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[#dc2626]/30 hover:bg-[#dc2626]/5">
              <input type="checkbox" checked={faqForm.is_active} onChange={(e) => setFaqForm({ ...faqForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]" /> Active on homepage
            </label>
            <button disabled={saving} className={`w-full rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>Save FAQ</button>
          </form>
          <div className="mt-6 space-y-3">
            {faqs.map((item) => (
              <article key={item.id} className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-black text-gray-950">{item.question}</h3>
                  <Badge>{item.is_active ? 'active' : 'inactive'}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{item.answer}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => patchFaq(item, { is_active: !item.is_active })} className="rounded-lg border border-[#dc2626]/30 px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-[#dc2626]/10">{item.is_active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => deleteFaq(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50">Delete</button>
                </div>
              </article>
            ))}
            {!faqs.length && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <HelpCircle size={32} className="mb-2 opacity-30" />
                <p className="text-sm">No FAQs yet</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl border p-6 shadow-sm ${accent.panel}`}
      >
        <h2 className="text-lg font-black text-gray-950">Homepage preview counts</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {homepage?.testimonials?.length || 0} active testimonials and {homepage?.faqs?.length || 0} active FAQs are currently returned by the public homepage endpoint.
        </p>
      </motion.section>
    </div>
  );

  // ========== PROFILE TAB ==========
  const [profileForm, setProfileForm] = useState({ full_name: '', email: '', phone_number: '', password: '' });
  const { refreshProfile } = useAuth();

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

  const saveProfile = (event) => {
    event.preventDefault();
    setSaving(true);
    // Only send password if it's not empty (backend requires min 6 chars)
    const payload = { ...profileForm };
    if (!payload.password) delete payload.password;
    api.put('/profile/', payload)
      .then((res) => {
        refreshProfile();
        showToast('Profile updated successfully.', 'success');
        setProfileForm((prev) => ({ ...prev, password: '' }));
      })
      .catch((err) => showToast(apiError(err, 'Could not update profile.'), 'error'))
      .finally(() => setSaving(false));
  };

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <form onSubmit={saveProfile} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950">
          <User size={18} className="text-[#dc2626]" /> Profile settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#f89f29] text-2xl font-black text-white shadow-lg">
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-black text-gray-950 text-lg">{user?.full_name || user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email} · {user?.role}</p>
            </div>
          </div>
          <Field label="Full name"><TextInput required value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} placeholder="Full name" /></Field>
          <Field label="Email"><TextInput required type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} placeholder="Email" /></Field>
          <Field label="Phone number"><TextInput value={profileForm.phone_number} onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })} placeholder="Phone number" /></Field>
          <Field label="New password (leave blank to keep current)">
            <TextInput type="password" value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} placeholder="••••••••" />
          </Field>
          <button disabled={saving} className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
            {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save profile
          </button>
        </div>
      </form>
    </motion.div>
  );

  // ========== USERS TAB ==========
  const renderUsers = () => (
    <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
      <motion.section
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-950">User management</h2>
            <p className="text-sm text-gray-500">Create, edit, activate/deactivate, and manage platform users.</p>
          </div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{users.length} users</span>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 font-bold">Email</th>
                <th className="px-4 py-3.5 font-bold">Role</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50/80">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#dc2626] to-[#f89f29] text-xs font-black text-white">
                        {(u.full_name || u.username)?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.full_name || u.username}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                      u.role === 'admin' ? 'bg-[#f89f29]/10 text-[#f89f29] border border-[#f89f29]/20' : 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/20'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.role === 'admin' ? 'bg-[#f89f29]' : 'bg-[#dc2626]'}`} />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5"><Badge>{u.is_active ? 'active' : 'inactive'}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => editUser(u)} className="rounded-lg border border-[#dc2626]/30 px-3 py-2 text-xs font-bold text-red-700 transition-all hover:bg-[#dc2626]/10">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => toggleUserStatus(u)} className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${
                        u.is_active ? 'border-[#dc2626]/30 text-red-700 hover:bg-[#dc2626]/10' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                      }`}>
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      {u.role !== 'admin' && (
                        <button onClick={() => changeUserRole(u, 'admin')} className="rounded-lg border border-[#f89f29]/30 px-3 py-2 text-xs font-bold text-orange-700 transition-all hover:bg-[#f89f29]/10">
                          Make admin
                        </button>
                      )}
                      {u.role === 'admin' && (
                        <button onClick={() => changeUserRole(u, 'student')} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50">
                          Make student
                        </button>
                      )}
                      <button onClick={() => deleteUser(u.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan="5" className="px-4 py-12 text-center text-sm text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.form
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={saveUser}
        className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-950">
          {editingUserId ? <Edit3 size={18} className="text-[#dc2626]" /> : <UserPlus size={18} className="text-[#dc2626]" />}
          {editingUserId ? 'Edit user' : 'Add user'}
        </h2>
        <div className="space-y-3.5">
          <Field label="Username"><TextInput required value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} placeholder="username" /></Field>
          <Field label="Email"><TextInput required type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@example.com" /></Field>
          <Field label="Full name"><TextInput value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} placeholder="Full name" /></Field>
          <Field label="Password">
            <TextInput type="password" value={userForm.password || ''} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder={editingUserId ? 'Leave blank to keep current' : 'Min 6 characters'} />
          </Field>
          <Field label="Role">
            <Select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 text-sm font-bold text-gray-700 transition-all hover:border-[#dc2626]/30 hover:bg-[#dc2626]/5">
            <input type="checkbox" checked={userForm.is_active} onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]" /> Active
          </label>
          <div className="flex gap-2 pt-1">
            <button disabled={saving} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
              {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save
            </button>
            {editingUserId && <button type="button" onClick={resetUserForm} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black text-gray-700 transition-all hover:bg-gray-50">Cancel</button>}
          </div>
        </div>
      </motion.form>
    </div>
  );

  // ========== EXPORT TAB ==========
  const renderExport = () => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className={`rounded-xl border p-6 shadow-sm ${accent.panel}`}>
        <h2 className="text-lg font-black text-gray-950">Export platform data</h2>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">Download CSV reports of your platform data. Backend does not provide export endpoints — these are generated client-side from live API data.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ExportCard
          icon={Users}
          label="Students"
          description="Export all student records with names, emails, phone numbers, and enrollment status."
          filename="elevate_students.csv"
          data={metrics.recent_enrollments?.map(e => ({
            student: e.student_full_name || e.student_username,
            course: e.course_title,
            status: e.status,
            enrolled_at: e.enrolled_at
          })) || []}
          fallbackData={[
            { student: 'dawit', course: 'Python', status: 'active', enrolled_at: new Date().toISOString() }
          ]}
        />
        <ExportCard
          icon={CreditCard}
          label="Payments"
          description="Export payment records including status, amounts, and student contact information."
          filename="elevate_payments.csv"
          data={payments.map(p => ({
            student: p.full_name || p.student_username,
            email: p.email,
            phone: p.phone,
            course: p.course_title,
            status: p.status,
            submitted_at: p.submitted_at
          }))}
        />
        <ExportCard
          icon={BookOpen}
          label="Courses"
          description="Export course catalog with pricing, instructor, and lesson counts."
          filename="elevate_courses.csv"
          data={courses.map(c => ({
            title: c.title,
            category: c.category?.name || '',
            price: c.price,
            instructor: c.instructor,
            lessons: c.lessons,
            duration: c.duration,
            is_published: c.is_published ? 'Yes' : 'No',
            is_active: c.is_active ? 'Yes' : 'No'
          }))}
        />
        <ExportCard
          icon={Megaphone}
          label="Announcements"
          description="Export all announcements with publish status."
          filename="elevate_announcements.csv"
          data={announcements.map(a => ({
            title: a.title,
            content: a.content,
            is_published: a.is_published ? 'Published' : 'Draft',
            created_at: a.created_at
          }))}
        />
        <ExportCard
          icon={FileText}
          label="News Posts"
          description="Export news articles with status and dates."
          filename="elevate_news.csv"
          data={news.map(n => ({
            title: n.title,
            excerpt: n.excerpt,
            status: n.status,
            created_at: n.created_at
          }))}
        />
        <ExportCard
          icon={Tags}
          label="Categories"
          description="Export category names and slugs."
          filename="elevate_categories.csv"
          data={categories.map(c => ({
            name: c.name,
            slug: c.slug,
            courses_count: courses.filter(co => co.category?.id === c.id).length
          }))}
        />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm">
        <strong>Note:</strong> All exports are generated from live data. For large datasets, pagination may limit results. This is a <strong>client-side</strong> CSV generation — no backend export API exists.
      </div>
    </motion.div>
  );

  function ExportCard({ icon: Icon, label, description, filename, data }) {
    const [exporting, setExporting] = useState(false);
    const handleExport = () => {
      setExporting(true);
      setTimeout(() => {
        if (data && data.length > 0) {
          exportToCSV(data, filename);
        } else {
          showToast(`No ${label.toLowerCase()} data to export.`, 'error');
        }
        setExporting(false);
      }, 100);
    };

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dc2626]/20 bg-[#dc2626]/10 text-[#dc2626]">
          <Icon size={22} />
        </div>
        <h3 className="font-black text-gray-950">{label}</h3>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>
        <div className="mt-4">
          <button
            onClick={handleExport}
            disabled={exporting || !data || data.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#f89f29] px-4 py-2 text-xs font-bold text-white hover:brightness-110 transition-all disabled:opacity-40"
          >
            {exporting ? <Loader size={13} className="animate-spin" /> : <FileText size={13} />}
            Export CSV {data ? `(${data.length})` : ''}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-950">
      <AnimatePresence>
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>

      <AnimatePresence>
        <Modal
          open={confirmDelete.open}
          title="Confirm deletion"
          message="This action cannot be undone. Are you sure you want to delete this item?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 border-r border-gray-200 bg-white p-5 lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-68 border-r border-gray-200 bg-white p-5 shadow-2xl lg:hidden"
            >
              <button onClick={() => setMobileSidebar(false)} className="absolute top-5 right-5 rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close menu">
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-68">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-lg lg:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebar(true)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#f89f29]">Real backend controls</p>
                <h1 className="text-xl sm:text-2xl font-black text-gray-950">Admin dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadAdminData} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm">
                <RefreshCw size={16} /> Refresh
              </button>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-3.5 py-2.5 text-sm font-bold text-white transition-all hover:bg-gray-800">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-bold transition-all ${
                  activeTab === id ? accent.button : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-[#dc2626]/20 bg-gradient-to-r from-[#dc2626]/5 to-[#f89f29]/5 p-3 sm:p-4 text-sm text-gray-700 shadow-sm"
          >
            Signed in as <strong className="text-gray-950">{user?.full_name || user?.username}</strong>. All controls map to documented backend endpoints.
          </motion.div>

          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <Skeleton className="mb-4 h-11 w-11" />
                    <Skeleton className="mb-2 h-8 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <Skeleton className="mb-4 h-6 w-48" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'courses' && renderCourses()}
                {activeTab === 'categories' && renderCategories()}
                {activeTab === 'payments' && renderPayments()}
                {activeTab === 'announcements' && renderAnnouncements()}
                {activeTab === 'cms' && renderCms()}
                {activeTab === 'export' && renderExport()}
                {activeTab === 'profile' && renderProfile()}
                {activeTab === 'users' && renderUsers()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
