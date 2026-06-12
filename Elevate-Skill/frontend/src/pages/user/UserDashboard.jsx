import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bell, BookOpen, CheckCircle, Clock, CreditCard, FileText, GraduationCap,
  Home, Loader, LogOut, Mail, Megaphone, Menu, MessageCircle, Phone,
  RefreshCw, Save, Send, Settings, Shield, Upload, User, X, AlertTriangle,
  Calendar, BarChart3, ExternalLink, Filter, Download
} from 'lucide-react';
import { api, getMediaUrl, unwrapResults, exportToCSV } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const accent = {
  button: 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white shadow-lg shadow-[#15c8fb]/20 hover:shadow-xl hover:shadow-[#15c8fb]/30 active:scale-[0.97] transition-all duration-200',
  panel: 'border-[#15c8fb]/20 bg-gradient-to-br from-[#15c8fb]/5 via-white to-[#f89f29]/5',
};

const tabs = [
  { id: 'home', label: 'Overview', icon: Home },
  { id: 'courses', label: 'My Courses', icon: BookOpen },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'announcements', label: 'Updates', icon: Megaphone },
  { id: 'settings', label: 'Profile', icon: Settings },
];

function formatDate(value) {
  if (!value) return 'Not set';
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusClass(status) {
  const key = String(status || '').toLowerCase();
  if (key === 'approved' || key === 'active' || key === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (key === 'rejected' || key === 'cancelled') return 'bg-rose-100 text-rose-700 border-rose-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

function Badge({ children }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClass(children)}`}>{children || 'pending'}</span>;
}

function StatCard({ label, value, icon: Icon, tone = 'red' }) {
  const tones = {
    red: { bg: 'bg-[#15c8fb]/10', text: 'text-[#15c8fb]', border: 'border-[#15c8fb]/20' },
    orange: { bg: 'bg-[#f89f29]/10', text: 'text-[#f89f29]', border: 'border-[#f89f29]/20' },
    green: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
  };
  const t = tones[tone] || tones.red;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`rounded-xl border ${t.border} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${t.border} ${t.bg}`}>
        <Icon size={20} className={t.text} />
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-500">{label}</p>
    </motion.div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-2 sm:right-4 z-50 flex items-center gap-3 rounded-xl px-4 sm:px-5 py-3 text-sm font-bold shadow-xl ${styles[type] || styles.success}`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </motion.div>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function UserDashboard() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ full_name: '', email: '', phone: '' });
  const [profile, setProfile] = useState({ full_name: '', email: '', phone_number: '' });

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const closeToast = () => setToast({ message: '', type: 'success' });

  const loadStudentData = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const [enrollmentsRes, paymentsRes, announcementsRes, coursesRes] = await Promise.all([
        api.get('/my-enrollments/'),
        api.get('/payments/'),
        api.get('/announcements/'),
        api.get('/courses/'),
      ]);
      setEnrollments(unwrapResults(enrollmentsRes.data));
      setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : unwrapResults(paymentsRes.data));
      setAnnouncements(unwrapResults(announcementsRes.data));
      setCourses(unwrapResults(coursesRes.data));
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not load dashboard data.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  useEffect(() => {
    if (mobileSidebar) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebar]);

  useEffect(() => {
    const nextProfile = {
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
    };
    setProfile(nextProfile);
    setPaymentForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone_number || '',
    });
  }, [user]);

  // Derived data
  const pendingEnrollments = useMemo(() => enrollments.filter((item) => item.status === 'pending'), [enrollments]);
  const activeEnrollments = useMemo(() => enrollments.filter((item) => item.status === 'active' || item.status === 'approved'), [enrollments]);
  const completedEnrollments = useMemo(() => enrollments.filter((item) => item.status === 'completed'), [enrollments]);
  const cancelledEnrollments = useMemo(() => enrollments.filter((item) => item.status === 'cancelled'), [enrollments]);
  
  const unpaidCourses = useMemo(() => {
    const enrolledIds = new Set(enrollments.map((item) => item.course?.id));
    return courses.filter((course) => !enrolledIds.has(course.id));
  }, [courses, enrollments]);
  
  const pendingPaymentCount = payments.filter(p => p.status === 'pending').length;
  const approvedPaymentCount = payments.filter(p => p.status === 'approved').length;
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  const enrollInCourse = async (courseId) => {
    setSaving(true);
    setError('');
    try {
      await api.post('/enrollments/', { course: courseId });
      showToast('Enrolled! Upload payment proof to activate.', 'success');
      setActiveTab('payments');
      await loadStudentData();
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Could not enroll.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    if (!selectedEnrollment || !proofFile) {
      showToast('Select a pending enrollment and upload proof.', 'error');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('enrollment_id', selectedEnrollment);
      formData.append('proof_file', proofFile);
      formData.append('full_name', paymentForm.full_name);
      formData.append('email', paymentForm.email);
      formData.append('phone', paymentForm.phone);
      await api.post('/payments/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProofFile(null);
      setSelectedEnrollment('');
      showToast('Payment proof submitted. Awaiting admin approval.', 'success');
      await loadStudentData();
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Could not submit payment.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/profile/', profile);
      setUser(res.data);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Could not update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="mb-6 sm:mb-8 flex items-center gap-3">
        <div className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-white shadow-lg shadow-[#15c8fb]/20">
          <GraduationCap size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-black text-white text-sm sm:text-base truncate">ElevateSkill</p>
          <p className="text-[11px] sm:text-xs font-medium text-gray-400">Student dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setMobileSidebar(false); }}
            className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 sm:py-2.5 text-sm font-bold transition-all duration-200 ${
              activeTab === id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {activeTab === id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-gradient-to-b from-[#15c8fb] to-[#f89f29]" />
            )}
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${
              activeTab === id ? 'bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-white shadow-sm' : ''
            }`}>
              <Icon size={16} />
            </span>
            <span className="flex-1 text-left">{label}</span>
            {id === 'payments' && pendingPaymentCount > 0 && (
              <span className="rounded-full bg-[#f89f29] px-2 py-0.5 text-[10px] font-black text-white shadow-sm">{pendingPaymentCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-xs font-black text-white shadow-sm">
            {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.full_name || user?.username || 'Student'}</p>
            <p className="truncate text-[11px] font-medium text-gray-400 capitalize">{user?.role || 'student'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // ========== HOME TAB ==========
  const renderHome = () => (
    <div className="space-y-6">
      {/* Welcome + Latest Announcement */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#15c8fb]/20 bg-gradient-to-br from-[#15c8fb]/5 via-white to-[#f89f29]/5 p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-2xl font-black text-white shadow-lg shadow-[#15c8fb]/20">
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#f89f29]">Student Portal</p>
              <h1 className="text-2xl font-black text-gray-900">Welcome back, {user?.full_name || user?.username || 'Student'}!</h1>
              <p className="mt-1 text-sm text-gray-500">{user?.email} · {enrollments.length} enrollments</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={loadStudentData} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"><RefreshCw size={16} /> Refresh</button>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-3.5 py-2.5 text-sm font-bold text-white"><LogOut size={16} /> Logout</button>
          </div>
        </div>
        {latestAnnouncement && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#15c8fb]/10 to-[#f89f29]/10 px-4 py-3 text-sm">
            <Megaphone size={16} className="shrink-0 text-[#f89f29]" />
            <span className="font-semibold text-gray-900">{latestAnnouncement.title}:</span>
            <span className="text-gray-600 truncate">{latestAnnouncement.content}</span>
          </div>
        )}
      </motion.section>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard label="Total Enrollments" value={enrollments.length} icon={BookOpen} />
        <StatCard label="Active Courses" value={activeEnrollments.length} icon={CheckCircle} tone="green" />
        <StatCard label="Pending Payments" value={pendingEnrollments.length} icon={Clock} tone="orange" />
        <StatCard label="Completed" value={completedEnrollments.length} icon={GraduationCap} />
      </motion.div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-black text-gray-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <button onClick={() => setActiveTab('courses')} className="group rounded-xl border border-gray-200 p-4 text-left hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5 transition-all">
            <BookOpen size={22} className="mb-2 text-[#15c8fb] group-hover:scale-110 transition-transform" />
            <p className="font-black text-gray-900">Browse Courses</p>
            <p className="mt-1 text-xs text-gray-500">{unpaidCourses.length} available to enroll</p>
          </button>
          <button onClick={() => setActiveTab('payments')} className="group rounded-xl border border-gray-200 p-4 text-left hover:border-[#f89f29]/30 hover:bg-[#f89f29]/5 transition-all">
            <Upload size={22} className="mb-2 text-[#f89f29] group-hover:scale-110 transition-transform" />
            <p className="font-black text-gray-900">Upload Proof</p>
            <p className="mt-1 text-xs text-gray-500">{pendingEnrollments.length} pending payments</p>
          </button>
          <button onClick={() => setActiveTab('announcements')} className="group rounded-xl border border-gray-200 p-4 text-left hover:border-emerald-500/30 hover:bg-emerald-50 transition-all">
            <Bell size={22} className="mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
            <p className="font-black text-gray-900">View Updates</p>
            <p className="mt-1 text-xs text-gray-500">{announcements.length} new announcements</p>
          </button>
        </div>
      </motion.section>

      {/* Payment Status Overview */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-black text-gray-900">Payment Summary</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-2xl font-black text-amber-700">{pendingPaymentCount}</p>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-2xl font-black text-emerald-700">{approvedPaymentCount}</p>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved</p>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
            <p className="text-2xl font-black text-rose-700">{payments.filter(p => p.status === 'rejected').length}</p>
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Rejected</p>
          </div>
        </div>
      </motion.section>

      {/* Enrollments Status Bar */}
      {enrollments.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-3 text-lg font-black text-gray-900">Enrollment Breakdown</h2>
          <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
            {activeEnrollments.length > 0 && (
              <div 
                className="bg-emerald-500 transition-all duration-500" 
                style={{ width: `${(activeEnrollments.length / enrollments.length) * 100}%` }}
                title={`Active: ${activeEnrollments.length}`}
              />
            )}
            {pendingEnrollments.length > 0 && (
              <div 
                className="bg-amber-400 transition-all duration-500" 
                style={{ width: `${(pendingEnrollments.length / enrollments.length) * 100}%` }}
                title={`Pending: ${pendingEnrollments.length}`}
              />
            )}
            {completedEnrollments.length > 0 && (
              <div 
                className="bg-[#15c8fb] transition-all duration-500" 
                style={{ width: `${(completedEnrollments.length / enrollments.length) * 100}%` }}
                title={`Completed: ${completedEnrollments.length}`}
              />
            )}
            {cancelledEnrollments.length > 0 && (
              <div 
                className="bg-rose-400 transition-all duration-500" 
                style={{ width: `${(cancelledEnrollments.length / enrollments.length) * 100}%` }}
                title={`Cancelled: ${cancelledEnrollments.length}`}
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
            {activeEnrollments.length > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active ({activeEnrollments.length})</span>}
            {pendingEnrollments.length > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Pending ({pendingEnrollments.length})</span>}
            {completedEnrollments.length > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#15c8fb]" /> Completed ({completedEnrollments.length})</span>}
            {cancelledEnrollments.length > 0 && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Cancelled ({cancelledEnrollments.length})</span>}
          </div>
        </motion.section>
      )}
    </div>
  );

  // ========== COURSES TAB ==========
  const renderCourses = () => (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">My Enrollments</h2>
            <p className="text-sm text-gray-500">{enrollments.length} total · {activeEnrollments.length} active</p>
          </div>
        </div>
        {enrollments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {enrollments.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={getMediaUrl(item.course?.thumbnail) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900'}
                    alt={item.course?.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase text-[#15c8fb] backdrop-blur">
                      {item.course?.category?.name || 'Course'}
                    </span>
                    <Badge>{item.status}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-gray-900">{item.course?.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">{item.course?.short_description}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(item.created_at)}
                    </span>
                    {item.course?.price && (
                      <span className="font-black text-gray-900 text-sm">{item.course.price} ETB</span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <BookOpen size={48} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No enrollments yet</p>
            <p className="text-xs mt-1">Choose a course below to get started</p>
          </div>
        )}
      </motion.section>

      {unpaidCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-black text-gray-900">
            Available Courses <span className="text-sm font-medium text-gray-500">({unpaidCourses.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {unpaidCourses.map((course, i) => (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={getMediaUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900'}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase text-[#f89f29] backdrop-blur">
                      {course.category?.name || 'Course'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-gray-900">{course.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">{course.short_description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500">
                    <span>{course.lessons || 0} lessons</span>
                    <span>·</span>
                    <span>{course.instructor || 'No instructor'}</span>
                    <span>·</span>
                    <span>{course.duration || 'Self-paced'}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="font-black text-gray-900">{course.price || 'Free'} ETB</span>
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      disabled={saving}
                      className="rounded-lg bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-4 py-2 text-xs font-bold text-white hover:brightness-110 transition-all disabled:opacity-60 shadow-lg shadow-[#15c8fb]/20"
                    >
                      {saving ? <Loader size={13} className="animate-spin" /> : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );

  // ========== PAYMENTS TAB ==========
  const renderPayments = () => (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <form onSubmit={submitPayment} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900">
            <Upload size={18} className="text-[#15c8fb]" /> Submit Proof
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-gray-500">Select Enrollment</label>
              <select
                required
                value={selectedEnrollment}
                onChange={(e) => setSelectedEnrollment(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 focus:ring-2 focus:ring-[#15c8fb]/10 transition-all"
              >
                <option value="">Choose a pending enrollment...</option>
                {pendingEnrollments.map((item) => (
                  <option key={item.id} value={item.id}>{item.course?.title}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required value={paymentForm.full_name} onChange={(e) => setPaymentForm({ ...paymentForm, full_name: e.target.value })} placeholder="Full name" className="col-span-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 transition-all" />
              <input required type="email" value={paymentForm.email} onChange={(e) => setPaymentForm({ ...paymentForm, email: e.target.value })} placeholder="Email" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 transition-all" />
              <input required value={paymentForm.phone} onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 transition-all" />
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 py-6 text-center hover:border-[#15c8fb]/40 hover:bg-[#15c8fb]/5 transition-all">
              <FileText className="mb-2 text-[#15c8fb]" size={28} />
              <p className="text-sm font-medium text-gray-600">{proofFile ? proofFile.name : 'Upload receipt or screenshot'}</p>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG · Max 5MB</p>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setProofFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
            <button
              disabled={saving || !pendingEnrollments.length}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-4 py-3 text-sm font-black text-white hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[#15c8fb]/20"
            >
              {saving ? <Loader className="animate-spin" size={16} /> : <Send size={16} />}
              Submit Payment Proof
            </button>
          </div>
        </form>

        {payments.length > 0 && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-gray-900">Export Data</h3>
              <button
                onClick={() => {
                  const data = payments.map(p => ({
                    course: p.course_title,
                    status: p.status,
                    submitted_at: p.submitted_at
                  }));
                  exportToCSV(data, 'my_payments.csv');
                }}
                className="rounded-lg border border-[#15c8fb]/30 px-3 py-1.5 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all"
              >
                <Download size={12} className="inline mr-1" /> CSV
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.section
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">Payment History</h2>
          <Badge>{payments.length} total</Badge>
        </div>
        {payments.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3 font-bold">Course</th>
                  <th className="px-4 py-3 font-bold">Submitted</th>
                  <th className="px-4 py-3 font-bold">Proof</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{payment.course_title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(payment.submitted_at)}</td>
                    <td className="px-4 py-3">
                      {payment.proof_file ? (
                        <a href={getMediaUrl(payment.proof_file)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#15c8fb]/10 px-3 py-1.5 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/20 transition-all">
                          <FileText size={13} /> View
                        </a>
                      ) : <span className="text-gray-500 text-xs">No file</span>}
                    </td>
                    <td className="px-4 py-3"><Badge>{payment.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <CreditCard size={40} className="mb-2 opacity-30" />
            <p className="text-sm">No payment records yet</p>
          </div>
        )}
      </motion.section>
    </div>
  );

  // ========== ANNOUNCEMENTS TAB ==========
  const renderAnnouncements = () => (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb]/20 to-[#f89f29]/20">
                    <Megaphone size={16} className="text-[#f89f29]" />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900">{item.title}</h2>
                    <p className="text-xs text-gray-500">{formatDate(item.created_at || item.date)}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{item.content}</p>
              {item.created_by && (
                <p className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  Posted by {item.created_by?.full_name || item.created_by?.username || 'Admin'}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <Megaphone size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="font-medium text-gray-500">No announcements yet</p>
          <p className="text-sm text-gray-400 mt-1">Check back later for updates from your instructors.</p>
        </div>
      )}
    </motion.section>
  );

  // ========== PROFILE TAB ==========
  const renderSettings = () => (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <form onSubmit={saveProfile} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900">
            <User size={18} className="text-[#15c8fb]" /> Profile Settings
          </h2>
          <div className="space-y-4">
              <div className="flex items-center gap-5 mb-4 pb-5 border-b border-gray-100">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-3xl font-black text-white shadow-lg shadow-[#15c8fb]/20">
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{user?.full_name || user?.username}</p>
                <div className="mt-1.5 space-y-1">
                  <p className="text-sm text-gray-500 flex items-center gap-2"><Mail size={14} /> {user?.email}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-2"><Shield size={14} /> {user?.role}</p>
                  {user?.phone_number && <p className="text-sm text-gray-500 flex items-center gap-2"><Phone size={14} /> {user.phone_number}</p>}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <input required value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 focus:ring-2 focus:ring-[#15c8fb]/10 transition-all" />
              <input required type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email address" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 focus:ring-2 focus:ring-[#15c8fb]/10 transition-all" />
              <input value={profile.phone_number} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} placeholder="Phone number" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-[#15c8fb]/50 focus:border-[#15c8fb]/40 focus:ring-2 focus:ring-[#15c8fb]/10 transition-all" />
            </div>
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-6 py-3 text-sm font-black text-white hover:brightness-110 transition-all disabled:opacity-60 shadow-lg shadow-[#15c8fb]/20">
              {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-gray-900"><Download size={16} className="text-[#15c8fb]" /> Export My Data</h3>
          <p className="text-xs text-gray-500 mb-4">Download your records as CSV files.</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                const data = enrollments.map(e => ({
                  course: e.course?.title || '',
                  status: e.status,
                  enrolled: formatDate(e.created_at),
                  updated: formatDate(e.updated_at)
                }));
                exportToCSV(data, 'my_enrollments.csv');
              }}
              disabled={!enrollments.length}
              className="w-full rounded-lg border border-[#15c8fb]/30 px-3 py-2.5 text-xs font-bold text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all disabled:opacity-40 flex items-center justify-between"
            >
              <span><FileText size={13} className="inline mr-1.5" />Enrollments</span>
              <span className="text-gray-500">{enrollments.length}</span>
            </button>
            <button
              onClick={() => {
                const data = payments.map(p => ({
                  course: p.course_title,
                  status: p.status,
                  submitted: formatDate(p.submitted_at)
                }));
                exportToCSV(data, 'my_payments.csv');
              }}
              disabled={!payments.length}
              className="w-full rounded-lg border border-[#f89f29]/30 px-3 py-2.5 text-xs font-bold text-orange-400 hover:bg-[#f89f29]/10 transition-all disabled:opacity-40 flex items-center justify-between"
            >
              <span><FileText size={13} className="inline mr-1.5" />Payments</span>
              <span className="text-gray-500">{payments.length}</span>
            </button>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black text-gray-900">Account Info</h3>
          <div className="mt-3 space-y-2 text-xs text-gray-500">
            <div className="flex justify-between"><span>Username</span><span className="font-medium text-gray-900">{user?.username || '-'}</span></div>
            <div className="flex justify-between"><span>Role</span><span className="font-medium text-gray-900 capitalize">{user?.role || '-'}</span></div>
            <div className="flex justify-between"><span>Joined</span><span className="font-medium text-gray-900">{user?.created_at ? formatDate(user.created_at) : '-'}</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AnimatePresence>
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
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
              className="fixed inset-y-0 left-0 z-50 w-68 border-r border-white/10 bg-surface p-5 shadow-2xl overflow-y-auto flex flex-col lg:hidden"
            >
              <button onClick={() => setMobileSidebar(false)} className="absolute top-5 right-5 rounded-lg p-2 text-gray-400 hover:bg-white/10">
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 border-r border-white/10 bg-surface p-5 overflow-y-auto flex flex-col lg:block">
        {sidebarContent}
      </aside>

      <main className="lg:pl-68">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-lg lg:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-all hover:text-[#15c8fb]" title="Go home">
                <ArrowLeft size={20} />
              </button>
              <button onClick={() => setMobileSidebar(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#f89f29]">Backend Integrated</p>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">Student Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadStudentData} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                <RefreshCw size={16} /> Refresh
              </button>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-3.5 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all">
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

        {/* Main content */}
        <div className="p-4 lg:p-6">
          {/* Toast message area */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
            >
              <CheckCircle size={16} className="inline mr-2" />{message}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700"
            >
              <AlertTriangle size={16} className="inline mr-2" />{error}
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="animate-pulse rounded-lg bg-gray-200 mb-4 h-10 w-10" />
                    <div className="animate-pulse rounded-lg bg-gray-200 mb-2 h-8 w-20" />
                    <div className="animate-pulse rounded-lg bg-gray-200 h-4 w-24" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="animate-pulse rounded-lg bg-gray-200 mb-4 h-6 w-48" />
                <div className="animate-pulse rounded-lg bg-gray-200 h-40 w-full" />
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
                {activeTab === 'home' && renderHome()}
                {activeTab === 'courses' && renderCourses()}
                {activeTab === 'payments' && renderPayments()}
                {activeTab === 'announcements' && renderAnnouncements()}
                {activeTab === 'settings' && renderSettings()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}