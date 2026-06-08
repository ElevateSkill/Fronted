import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 LayoutDashboard, Users, BookOpen, Megaphone, LogOut,
 CheckCircle, XCircle, Eye, ChevronDown, Search,
 UserPlus, Bell, FileText, Plus, Sparkles,
  GraduationCap, Clock, TrendingUp, ArrowRight,
 Image, Camera, Newspaper, MessageSquare, ChevronRight,
 Edit3, Trash2, Star, Link, Download, Upload,
 Filter, Mail, Phone, Calendar, MapPin, Send,
 AlertTriangle, Info, RefreshCw, CheckCheck, Ban,
 Maximize2, Grid, List, Heart, Share2, Play,
 UserCheck, UserX, UserCog, Shield, Award,
 ChevronLeft, ChevronRight as ChevronRightIcon, SlidersHorizontal, Zap, EyeOff, X, HelpCircle, CreditCard
} from 'lucide-react';
import { loadData, saveData } from '../../data/dataStore';
import { useAuth } from '../../context/AuthContext';
import { api, coursesAPI, testimonialsAPI, announcementsAPI, faqsAPI, newsAPI, categoriesAPI, dashboardAPI, authAPI } from '../../services/api';
import UsersSection from './sections/Users';
import PaymentsSection from './sections/Payments';
import PaymentDetailModal from '../../components/dashboard/PaymentDetailModal';
import Lightbox from '../../components/dashboard/Lightbox';
import { paymentsAPI } from '../../services/api';

const sidebarItems = [
 { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
 { id: 'hero', label: 'Hero Slides', icon: <SlidersHorizontal size={20} /> },
  { id: 'registrations', label: 'Registrations', icon: <UserPlus size={20} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
  { id: 'users', label: 'Users', icon: <Users size={20} /> },
 { id: 'courses', label: 'Courses', icon: <BookOpen size={20} /> },
 {
 id: 'media', label: 'Media', icon: <Image size={20} />,
 children: [
 { id: 'posts', label: 'Posts', icon: <Newspaper size={16} /> },
 { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={16} /> },
 { id: 'photos', label: 'Photos', icon: <Camera size={16} /> },
 { id: 'gallery', label: 'Gallery', icon: <Image size={16} /> },
 ]
 },
 { id: 'faqs', label: 'FAQs', icon: <HelpCircle size={20} /> },
 { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
];

const genId = () => Date.now() + Math.random();

const Modal = ({ title, children, onClose }) => (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-brand-bg rounded-3xl border border-gray-200 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
 <div className="flex items-center justify-between p-5 border-b border-gray-200 ">
 <h3 className="text-lg font-black text-gray-900 ">{title}</h3>
 <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-all"><X size={18} /></button>
 </div>
 <div className="p-5">{children}</div>
 </motion.div>
 </motion.div>
);

const Input = ({ label, ...props }) => (
 <div className="space-y-1.5">
 {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>}
 <input {...props} className={`w-full px-4 py-3 bg-brand-bg border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#5A2DA8]/50 transition-all placeholder:text-gray-400 ${props.className || ''}`} />
 </div>
);

const TextArea = ({ label, ...props }) => (
 <div className="space-y-1.5">
 {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>}
 <textarea {...props} className={`w-full px-4 py-3 bg-brand-bg border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#5A2DA8]/50 transition-all placeholder:text-gray-400 resize-none ${props.className || ''}`} />
 </div>
);

const Select = ({ label, options, ...props }) => (
 <div className="space-y-1.5">
 {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>}
 <select {...props} className="w-full px-4 py-3 bg-brand-bg border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#5A2DA8]/50 transition-all">
 {options.map(o => <option key={o} value={o}>{o}</option>)}
 </select>
 </div>
);

const StatusBadge = ({ status }) => {
 const map = {
 Approved: 'bg-green-100 text-green-700 ',
 Rejected: 'bg-[#FDE0DC] text-red-700 ',
 Pending: 'bg-amber-100 text-amber-700 ',
 Active: 'bg-green-100 text-green-700 ',
 Inactive: 'bg-gray-100 text-gray-600 ',
 Published: 'bg-green-100 text-green-700 ',
 Draft: 'bg-amber-100 text-amber-700 ',
 Admin: 'bg-violet-100 text-violet-700 ',
 Student: 'bg-[#E0E0F0] text-[#EE8433] ',
 };
 return <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider inline-block ${map[status] || 'bg-gray-100 text-gray-500 '}`}>{status}</span>;
};

const ToastComp = ({ toast }) => toast ? (
 <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-bold ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 ' : 'bg-[#FEF0EE] border-red-200 text-red-700 '}`}>
 {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
 {toast.message}
</motion.div>
) : null;

const DeleteConfirm = ({ onConfirm, onCancel }) => (
 <Modal title="Confirm Delete" onClose={onCancel}>
 <div className="text-center">
 <Trash2 size={48} className="mx-auto text-[#D95C4A] mb-4" />
 <p className="text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
 <div className="flex gap-3 justify-center">
 <button onClick={onCancel} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
 <button onClick={onConfirm} className="px-6 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all">Delete</button>
 </div>
 </div>
 </Modal>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
 const [mediaOpen, setMediaOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');
 const [statusFilter, setStatusFilter] = useState('All');
 const [toast, setToast] = useState(null);
 const [selectedItem, setSelectedItem] = useState(null);
 const [showModal, setShowModal] = useState(null);
 const [editItem, setEditItem] = useState(null);

 const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

 const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState(() => {
  const stored = loadData('users');
  return stored.length ? stored : [];
  });
  const [userLoading, setUserLoading] = useState(false);
  const [courses, setCourses] = useState(() => loadData('courses'));
  const [posts, setPosts] = useState(() => loadData('posts'));
  const [testimonials, setTestimonials] = useState(() => loadData('testimonials'));
  const [photos, setPhotos] = useState([]);
  const [galleryAlbums, setGalleryAlbums] = useState([]);
  const [announcements, setAnnouncements] = useState(() => loadData('announcements'));
  const [heroSlides, setHeroSlides] = useState(() => loadData('heroSlides').length ? loadData('heroSlides') : []);
  const [faqs, setFaqs] = useState(() => loadData('faqs'));
  const [categories, setCategories] = useState([]);

  // Auto-persist all data to localStorage
  useEffect(() => {
  saveData('heroSlides', heroSlides);
  saveData('courses', courses);
  saveData('testimonials', testimonials);
  saveData('posts', posts);
  saveData('announcements', announcements);
  saveData('faqs', faqs);
  saveData('users', users);
  }, [heroSlides, courses, testimonials, posts, announcements, faqs, users]);

  // Fetch live data from backend API on mount (falls back to localStorage)
  useEffect(() => {
    const syncFromAPI = async () => {
      try {
        const [coursesRes, testimonialsRes, postsRes, announcementsRes, faqsRes, statsRes, categoriesRes] = await Promise.allSettled([
          coursesAPI.adminList({ page_size: 100 }),
          testimonialsAPI.adminList({ page_size: 100 }),
          newsAPI.adminList({ page_size: 100 }),
          announcementsAPI.adminList({ page_size: 100 }),
          faqsAPI.adminList({ page_size: 100 }),
          dashboardAPI.getStats(),
          categoriesAPI.adminList({ page_size: 100 }),
        ]);

        if (coursesRes.status === 'fulfilled' && coursesRes.value?.results?.length) {
          const adapted = coursesRes.value.results.map(c => ({
            id: c.id, title: c.title || '', category: c.category?.name || c.category || '', students: c.students || 0,
            lessons: c.lessons || 0, status: c.is_active ? 'Active' : 'Inactive', price: c.price ? `${c.price} ETB` : 'Free',
            desc: c.short_description || c.description || '',
          }));
          setCourses(prev => adapted.length ? adapted : prev);
        }
        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value?.results?.length) {
          const adapted = testimonialsRes.value.results.map(t => ({
            id: t.id, name: t.student_name || '', role: '', company: '',
            text: t.message || '', rating: t.rating || 5,
            avatar: t.student_image || '',
            is_active: t.is_active !== false,
          }));
          setTestimonials(prev => adapted.length ? adapted : prev);
        }
        if (postsRes.status === 'fulfilled' && postsRes.value?.results?.length) {
          const adapted = postsRes.value.results.map(p => ({
            id: p.id, title: p.title || '', author: p.author?.full_name || p.author || 'Admin',
            date: p.created_at?.split('T')[0] || p.date || '', status: p.status === 'published' ? 'Published' : 'Draft',
            image: p.image || '', excerpt: p.excerpt || p.content?.substring(0, 150) || '',
          }));
          setPosts(prev => adapted.length ? adapted : prev);
        }
        if (announcementsRes.status === 'fulfilled' && announcementsRes.value?.results?.length) {
          const adapted = announcementsRes.value.results.map(a => ({
            id: a.id, title: a.title || '', body: a.content || '',
            date: a.date || a.created_at?.split('T')[0] || '', is_published: a.is_published !== false,
          }));
          setAnnouncements(prev => adapted.length ? adapted : prev);
        }
        if (faqsRes.status === 'fulfilled' && faqsRes.value?.results?.length) {
          const adapted = faqsRes.value.results.map(f => ({
            id: f.id, question: f.question || '', answer: f.answer || '',
            order: f.order || 0, is_active: f.is_active !== false,
          }));
          setFaqs(prev => adapted.length ? adapted : prev);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value) {
          const s = statsRes.value;
          if (s.total_registrations !== undefined || s.total_users !== undefined) return;
        }
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.results) {
          setCategories(categoriesRes.value.results);
        }
      } catch (e) {
        // API unavailable — keep localStorage data
      }
      setApiSynced(true);
    };
    syncFromAPI();
    // Fetch payments
    const fetchPayments = async () => {
      setPaymentLoading(true);
      try {
        const res = await paymentsAPI.adminList({ page_size: 200 });
        setPaymentList(Array.isArray(res) ? res : res.results || []);
      } catch (e) {
        // keep empty
      }
      setPaymentLoading(false);
    };
    fetchPayments();
  }, []);

  const [apiSynced, setApiSynced] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });
  const [newCourse, setNewCourse] = useState({ title: '', category: '', desc: '', price: '', status: 'Active' });
  const [paymentList, setPaymentList] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

 const stats = {
 total: registrations.length,
 pending: registrations.filter(r => r.status === 'Pending').length,
 approved: registrations.filter(r => r.status === 'Approved').length,
 rejected: registrations.filter(r => r.status === 'Rejected').length,
 activeUsers: users.filter(u => u.status === 'Active').length,
 totalCourses: courses.length,
 totalPosts: posts.length,
 totalPhotos: photos.length,
 };

 const statCards = [
 { label: 'Total Registrations', value: stats.total, icon: <UserPlus size={24} />, color: 'from-[#EE8433] to-[#EE8433]' },
 { label: 'Pending Review', value: stats.pending, icon: <Clock size={24} />, color: 'from-[#3A3992] to-[#3A3992]' },
 { label: 'Approved', value: stats.approved, icon: <CheckCircle size={24} />, color: 'from-green-500 to-green-600' },
 { label: 'Active Users', value: stats.activeUsers, icon: <Users size={24} />, color: 'from-[#7A3FB5] to-[#7A3FB5]' },
 { label: 'Courses', value: stats.totalCourses, icon: <BookOpen size={24} />, color: 'from-[#EE8433] to-[#EE8433]' },
 { label: 'Published Posts', value: stats.totalPosts, icon: <Newspaper size={24} />, color: 'from-pink-500 to-pink-600' },
 ];

 const handleSidebarClick = (id) => {
 if (id === 'media') { setMediaOpen(!mediaOpen); if (!mediaOpen) setActiveTab('posts'); }
 else { setActiveTab(id); setMediaOpen(false); }
 };

 const renderContent = () => {
 switch (activeTab) {
 case 'dashboard':
 return (
 <div className="space-y-5">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Dashboard</h2>
 <p className="text-gray-500 text-sm font-medium">Overview of your platform activity</p>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
 {statCards.map((card, i) => (
 <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 p-4 group hover:border-gray-300 transition-all cursor-pointer" onClick={() => { const map = { 'Total Registrations': 'registrations', 'Pending Review': 'registrations', 'Approved': 'registrations', 'Active Users': 'users', 'Courses': 'courses', 'Published Posts': 'posts' }; setActiveTab(map[card.label]); }}>
 <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${card.color}`} />
 <div className="flex items-center justify-between mb-3">
 <div className="p-2.5 rounded-xl bg-gray-200 text-gray-600 ">{card.icon}</div>
 <TrendingUp size={16} className="text-green-500/60" />
 </div>
 <p className="text-2xl font-black text-gray-900 tracking-tight">{card.value}</p>
 <p className="text-[10px] text-gray-500 font-medium mt-1 tracking-wide">{card.label}</p>
 </motion.div>
 ))}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="rounded-2xl bg-gray-100 border border-gray-200 p-5">
 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-[#3A3992]" /> Recent Activity</h3>
 <div className="space-y-3">
 {registrations.slice(0, 5).map(r => (
 <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
 <div className="flex items-center gap-3">
 <div className={`w-2 h-2 rounded-full ${r.status === 'Approved' ? 'bg-green-500' : r.status === 'Rejected' ? 'bg-[#FEF0EE]' : 'bg-[#3A3992]'}`} />
 <div>
 <p className="text-sm font-semibold text-gray-900 ">{r.name} registered</p>
 <p className="text-[10px] text-gray-400 ">{r.date}</p>
 </div>
 </div>
 <StatusBadge status={r.status} />
 </div>
 ))}
 </div>
 </div>
 <div className="rounded-2xl bg-gray-100 border border-gray-200 p-6">
 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap size={18} className="text-[#5A2DA8]" /> Quick Actions</h3>
 <div className="grid grid-cols-2 gap-3">
 {[
 { label: 'New Course', icon: <BookOpen size={16} />, tab: 'courses', color: 'from-[#EE8433]/20 to-[#EE8433]/20 text-[#5A2DA8]' },
 { label: 'New Post', icon: <Newspaper size={16} />, tab: 'posts', color: 'from-pink-500/20 to-rose-500/20 text-pink-600 ' },
 { label: 'New User', icon: <UserPlus size={16} />, tab: 'users', color: 'from-[#7A3FB5]/20 to-purple-500/20 text-[#7A3FB5] ' },
 { label: 'Announcement', icon: <Megaphone size={16} />, tab: 'announcements', color: 'from-[#3A3992]/20 to-[#3A3992]/20 text-[#3A3992] ' },
 ].map(a => (
 <button key={a.label} onClick={() => { setActiveTab(a.tab); if (a.tab === 'posts' || a.tab === 'testimonials' || a.tab === 'photos' || a.tab === 'gallery') { setMediaOpen(true); } }} className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${a.color} border border-white/10 font-bold text-xs hover:scale-[1.02] transition-all`}>
 {a.icon} {a.label}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 );

 case 'registrations':
 return (
 <div className="space-y-4">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Registrations</h2>
 <p className="text-gray-500 text-sm font-medium">Manage user registrations</p>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " />
 <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-48 pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#5A2DA8]/50 placeholder:text-gray-400 " />
 </div>
 <div className="flex gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 ">
 {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
 <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${statusFilter === s ? 'bg-brand-bg text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 '}`}>{s}</button>
 ))}
 </div>
 </div>
 </div>
 <div className="overflow-x-auto rounded-2xl border border-gray-200 ">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-gray-200 bg-gray-50 ">
 {['Full Name', 'Email', 'Phone', 'Course', 'Status', 'Actions'].map(h => <th key={h} className={`text-left p-3 text-[10px] font-black text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>)}
 </tr>
 </thead>
 <tbody>
 {(searchQuery || statusFilter !== 'All' ? registrations.filter(r => {
 const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
 return matchesSearch && matchesStatus;
 }) : registrations).map((r, i) => (
 <motion.tr key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
 <td className="p-3"><span className="font-semibold text-gray-900 text-sm">{r.name}</span></td>
 <td className="p-3 text-gray-500 text-xs">{r.email}</td>
 <td className="p-3 text-gray-500 text-xs">{r.phone}</td>
 <td className="p-3 text-gray-500 text-xs">{r.course}</td>
 <td className="p-3"><StatusBadge status={r.status} /></td>
 <td className="p-3">
 <div className="flex items-center justify-end gap-2">
 <button onClick={() => { const updated = registrations.map(x => x.id === r.id ? { ...x, status: 'Approved' } : x); setRegistrations(updated); showToast(`${r.name} approved`); }} disabled={r.status === 'Approved'} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Approve"><CheckCircle size={16} /></button>
 <button onClick={() => { const updated = registrations.map(x => x.id === r.id ? { ...x, status: 'Rejected' } : x); setRegistrations(updated); showToast(`${r.name} rejected`); }} disabled={r.status === 'Rejected'} className="p-2 rounded-lg bg-[#FDE0DC] text-red-700 hover:bg-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Reject"><XCircle size={16} /></button>
 <button onClick={() => setSelectedItem({ type: 'registration', data: r })} className="p-2 rounded-lg bg-[#E0E0F0] #5A2DA8]/10 text-[#5A2DA8] hover:bg-[#C1C1E0] #5A2DA8]/20 transition-all" title="View Details"><Eye size={16} /></button>
 </div>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 {registrations.length === 0 && <div className="p-12 text-center"><UserPlus size={40} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-400 text-sm">No registrations yet</p></div>}
 </div>
 </div>
 );

  case 'payments':
  return (
  <PaymentsSection
  payments={paymentList}
  loading={paymentLoading}
  onRefresh={async () => {
  setPaymentLoading(true);
  try {
  const res = await paymentsAPI.adminList({ page_size: 200 });
  setPaymentList(Array.isArray(res) ? res : res.results || []);
  showToast('Payments refreshed');
  } catch (e) { showToast('Failed to refresh', 'error'); }
  setPaymentLoading(false);
  }}
  onApprove={async (id) => {
  try {
  await paymentsAPI.adminApprove(id);
  setPaymentList(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  showToast('Payment approved');
  } catch (e) { showToast('Approve failed', 'error'); }
  }}
  onReject={async (id) => {
  try {
  await paymentsAPI.adminReject(id);
  setPaymentList(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  showToast('Payment rejected');
  } catch (e) { showToast('Reject failed', 'error'); }
  }}
  onViewDetail={(payment) => setSelectedPayment(payment)}
  />
  );

  case 'users':
  return (
  <UsersSection
  users={users}
  loading={userLoading}
  onEdit={(u) => { setEditItem(u); setShowModal('user'); }}
  onDelete={(id) => { setSelectedItem({ type: 'user', id }); setShowModal('delete'); }}
  onAdd={() => { setEditItem({ name: '', email: '', role: 'Student', status: 'Active', phone: '' }); setShowModal('user'); }}
  onRefresh={() => {
  setUserLoading(true);
  Promise.resolve().then(() => { setUserLoading(false); showToast('Users refreshed'); });
  }}
  />
  );

 case 'courses':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Courses</h2>
 <p className="text-gray-500 text-sm font-medium">{courses.length} courses available</p>
 </div>
 <button onClick={() => { setNewCourse({ title: '', category: '', desc: '', price: '', status: 'Active' }); setShowModal('course'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add Course</button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {courses.map((course, i) => (
 <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 bg-gray-100 p-5 hover:border-[#5A2DA8]/30 transition-all group">
 <div className="flex items-start justify-between mb-4">
 <div className="p-3 rounded-xl bg-[#E0E0F0] #5A2DA8]/10 text-[#5A2DA8]"><BookOpen size={24} /></div>
 <StatusBadge status={course.status} />
 </div>
 <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#5A2DA8] transition-colors">{course.title}</h3>
 <p className="text-xs text-gray-500 mb-1">{course.category}</p>
 <p className="text-xs text-gray-400 mb-4 line-clamp-2">{course.desc}</p>
 <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
 <span>{course.students} students</span>
 <span>{course.lessons} lessons</span>
 <span className="font-bold text-[#5A2DA8]">{course.price}</span>
 </div>
 <div className="flex gap-2">
 <button className="flex-1 py-3 border border-[#5A2DA8]/30 text-[#5A2DA8] font-bold text-xs rounded-xl hover:bg-[#5A2DA8] hover:text-white transition-all">Apply</button>
 <button onClick={() => { setEditItem(course); setShowModal('course'); }} className="p-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-200 transition-all"><Edit3 size={14} /></button>
 <button onClick={() => { setSelectedItem({ type: 'course', id: course.id }); setShowModal('delete'); }} className="p-3 rounded-xl border border-gray-200 text-[#D95C4A]/60 hover:bg-[#FEF0EE] transition-all"><Trash2 size={14} /></button>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'posts':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Posts</h2>
 <p className="text-gray-500 text-sm font-medium">{posts.filter(p => p.status === 'Published').length} published, {posts.filter(p => p.status === 'Draft').length} drafts</p>
 </div>
 <button onClick={() => { setEditItem({ title: '', excerpt: '', image: '', status: 'Draft', author: 'Admin' }); setShowModal('post'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#5A2DA8] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> New Post</button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {posts.map((post, i) => (
 <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden hover:border-[#5A2DA8]/30 transition-all group">
 <div className="h-40 overflow-hidden relative">
 <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute top-3 right-3"><StatusBadge status={post.status} /></div>
 </div>
 <div className="p-5">
 <p className="text-[10px] text-gray-400 mb-1">{post.date} · {post.author}</p>
 <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#5A2DA8] transition-colors">{post.title}</h3>
 <p className="text-xs text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
 <div className="flex items-center gap-2">
 <button onClick={() => { setEditItem(post); setShowModal('post'); }} className="p-2 rounded-lg bg-[#E0E0F0] #5A2DA8]/10 text-[#5A2DA8] hover:bg-[#C1C1E0] #5A2DA8]/20 transition-all"><Edit3 size={14} /></button>
 <button onClick={() => { setSelectedItem({ type: 'post', id: post.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-[#FDE0DC] text-[#D95C4A] hover:bg-red-200 transition-all"><Trash2 size={14} /></button>
 <button onClick={() => { setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p)); showToast(`${post.title} ${post.status === 'Published' ? 'unpublished' : 'published'}`); }} className="ml-auto p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all" title="Toggle Status">{post.status === 'Published' ? <XCircle size={14} /> : <CheckCircle size={14} />}</button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'testimonials':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Testimonials</h2>
 <p className="text-gray-500 text-sm font-medium">{testimonials.length} student testimonials</p>
 </div>
 <button onClick={() => { setEditItem({ name: '', role: '', company: '', text: '', rating: 5 }); setShowModal('testimonial'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add Testimonial</button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {testimonials.map((t, i) => (
 <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 bg-gray-100 p-5 hover:border-[#3A3992]/30 transition-all group">
 <div className="flex items-center gap-2 mb-3">
 {[...Array(5)].map((_, j) => <Star key={j} size={14} className={j < t.rating ? 'fill-[#3A3992] text-[#3A3992]' : 'text-gray-300 '} />)}
 </div>
 <p className="text-sm text-gray-600 italic mb-4 line-clamp-3">"{t.text}"</p>
 <div className="flex items-center gap-3">
 <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
 <div className="flex-1">
 <p className="text-sm font-bold text-gray-900 ">{t.name}</p>
 <p className="text-[10px] text-gray-400 ">{t.role} · {t.company}</p>
 </div>
 <div className="flex gap-1">
 <button onClick={() => { setEditItem(t); setShowModal('testimonial'); }} className="p-2 rounded-lg bg-[#E0E0F0] #5A2DA8]/10 text-[#5A2DA8] hover:bg-[#C1C1E0] #5A2DA8]/20 transition-all"><Edit3 size={14} /></button>
 <button onClick={() => { setSelectedItem({ type: 'testimonial', id: t.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-[#FDE0DC] text-[#D95C4A] hover:bg-red-200 transition-all"><Trash2 size={14} /></button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'photos':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Photos</h2>
 <p className="text-gray-500 text-sm font-medium">{photos.length} photos uploaded</p>
 </div>
 <label className="flex items-center gap-2 px-5 py-2.5 bg-[#5A2DA8] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
 <Upload size={16} /> Upload Photos
 <input type="file" multiple accept="image/*" className="hidden" onChange={e => { const files = Array.from(e.target.files); files.forEach(f => { const reader = new FileReader(); reader.onload = (ev) => { const url = ev.target?.result; if (typeof url === 'string') { setPhotos(prev => [...prev, { id: genId(), url, name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, uploaded: new Date().toISOString().split('T')[0] }]); } }; reader.readAsDataURL(f); }); showToast(`${files.length} photo(s) uploaded`); }} />
 </label>
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
 {photos.map((photo, i) => (
 <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 ">
 <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
 <a href={photo.url} download className="p-2 rounded-lg bg-brand-bg/20 backdrop-blur text-white hover:bg-brand-bg/40 transition-all"><Download size={16} /></a>
 <button onClick={() => { setPhotos(prev => prev.filter(p => p.id !== photo.id)); showToast('Photo deleted'); }} className="p-2 rounded-lg bg-brand-bg/20 backdrop-blur text-white hover:bg-[#FEF0EE]/60 transition-all"><Trash2 size={16} /></button>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'gallery':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Gallery</h2>
 <p className="text-gray-500 text-sm font-medium">{galleryAlbums.length} albums</p>
 </div>
 <button onClick={() => { setEditItem({ name: '', cover: '' }); setShowModal('gallery'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> New Album</button>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {galleryAlbums.map((album, i) => (
 <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden hover:border-[#3A3992]/30 transition-all group cursor-pointer">
 <div className="h-48 overflow-hidden relative">
 <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
 <div className="absolute bottom-4 left-4 right-4">
 <h3 className="text-white font-bold text-lg">{album.name}</h3>
 <p className="text-white/70 text-xs">{album.count} photos</p>
 </div>
 </div>
 <div className="p-4 flex items-center justify-between">
 <button className="text-xs font-bold text-[#5A2DA8] hover:text-[#EE8433] transition-colors flex items-center gap-1">View Album <ChevronRightIcon size={14} /></button>
 <div className="flex items-center gap-2">
 <button onClick={(e) => { e.stopPropagation(); setEditItem(album); setShowModal('gallery'); }} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"><Edit3 size={14} /></button>
 <button onClick={(e) => { e.stopPropagation(); setSelectedItem({ type: 'gallery', id: album.id }); setShowModal('delete'); }} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"><Trash2 size={14} /></button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'announcements':
 return (
 <div className="space-y-4">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Announcements</h2>
 <p className="text-gray-500 text-sm font-medium">Post platform-wide announcements</p>
 </div>
 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 space-y-4">
 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Megaphone size={18} className="text-[#3A3992]" /> New Announcement</h3>
 <Input placeholder="Announcement Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement(p => ({ ...p, title: e.target.value }))} />
 <TextArea placeholder="Write your announcement..." rows={4} value={newAnnouncement.body} onChange={e => setNewAnnouncement(p => ({ ...p, body: e.target.value }))} />
 <div className="flex justify-end">
  <button onClick={async () => { if (!newAnnouncement.title || !newAnnouncement.body) return; try { const created = await announcementsAPI.adminCreate({ title: newAnnouncement.title, content: newAnnouncement.body, is_published: true }); setAnnouncements(prev => [...prev, { ...created, id: created.id, title: created.title, body: created.content || created.body, date: new Date().toISOString().split('T')[0] }]); setNewAnnouncement({ title: '', body: '' }); showToast('Announcement published to backend'); } catch (e) { showToast('Failed to publish', 'error'); } }} className="px-6 py-2.5 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider flex items-center gap-2"><Sparkles size={14} /> Publish</button>
 </div>
 </div>
 <div className="space-y-4">
 {announcements.length === 0 ? (
 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-12 text-center">
 <Megaphone size={40} className="mx-auto text-gray-300 mb-4" />
 <h3 className="text-lg font-bold text-gray-500 mb-1">No announcements yet</h3>
 <p className="text-gray-400 text-sm">Published announcements will appear here</p>
 </div>
 ) : announcements.map(a => (
 <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-200 bg-gray-100 p-6 hover:border-[#3A3992]/30 transition-all">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-2">
 <Megaphone size={16} className="text-[#3A3992]" />
 <h3 className="font-bold text-gray-900 ">{a.title}</h3>
 </div>
 <p className="text-sm text-gray-600 ">{a.body}</p>
 <p className="text-[10px] text-gray-400 mt-2">{a.date}</p>
 </div>
 <button onClick={() => { setAnnouncements(prev => prev.filter(x => x.id !== a.id)); showToast('Announcement deleted'); }} className="p-2 rounded-lg hover:bg-[#FDE0DC] text-gray-400 hover:text-[#D95C4A] transition-all"><Trash2 size={16} /></button>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'faqs':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">FAQs</h2>
 <p className="text-gray-500 text-sm font-medium">{faqs.length} questions</p>
 </div>
 <button onClick={() => { setEditItem({ question: '', answer: '', category: 'General' }); setShowModal('faq'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add FAQ</button>
 </div>
 <div className="space-y-3">
 {faqs.length === 0 ? (
 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-12 text-center">
 <HelpCircle size={40} className="mx-auto text-gray-300 mb-4" />
 <h3 className="text-lg font-bold text-gray-500 mb-1">No FAQs yet</h3>
 <p className="text-gray-400 text-sm">Add frequently asked questions for your students</p>
 </div>
 ) : faqs.map((faq, i) => (
 <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-gray-200 bg-gray-100 p-5 hover:border-[#3A3992]/30 transition-all">
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-2">
 <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-gray-200 text-gray-500 ">{faq.category || 'General'}</span>
 </div>
 <h3 className="font-bold text-gray-900 mb-1">{faq.question}</h3>
 <p className="text-sm text-gray-500 ">{faq.answer}</p>
 </div>
 <div className="flex items-center gap-2 shrink-0">
 <button onClick={() => { setEditItem(faq); setShowModal('faq'); }} className="p-2 rounded-lg bg-[#E0E0F0] #5A2DA8]/10 text-[#5A2DA8] hover:bg-[#C1C1E0] #5A2DA8]/20 transition-all"><Edit3 size={14} /></button>
 <button onClick={() => { setFaqs(prev => prev.filter(f => f.id !== faq.id)); showToast('FAQ deleted'); }} className="p-2 rounded-lg bg-[#FDE0DC] text-[#D95C4A] hover:bg-red-200 transition-all"><Trash2 size={14} /></button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 case 'hero':
 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Hero Slides</h2>
 <p className="text-gray-500 text-sm font-medium">{heroSlides.length} slides · Manage your landing page hero slider</p>
 </div>
 <button onClick={() => { setEditItem({ image: '', title: '', highlight: '', subtitle: '', cta: 'GET STARTED', color: '#EE8433', active: true }); setShowModal('hero'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3A3992] to-[#EE8433] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add Slide</button>
 </div>

 <div className="grid grid-cols-1 gap-4">
 {heroSlides.map((slide, i) => (
 <motion.div key={slide.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden hover:border-[#5A2DA8]/30 transition-all group">
 <div className="flex flex-col md:flex-row">
 <div className="md:w-72 h-48 md:h-auto relative shrink-0">
 <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
 <div className="absolute top-3 left-3">
 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${slide.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{slide.active ? 'Active' : 'Inactive'}</span>
 </div>
 <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
 </div>
 <div className="flex-1 p-5 flex flex-col justify-between">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-xs text-gray-400 font-bold">Slide {i + 1}</span>
 <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slide.color }} />
 </div>
 <h3 className="text-xl font-bold text-gray-900 mb-1">{slide.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A3992] to-[#EE8433]">{slide.highlight}</span></h3>
 <p className="text-sm text-gray-500 mb-3">{slide.subtitle}</p>
 <div className="flex items-center gap-4 text-xs">
 <span className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600 font-bold">{slide.cta}</span>
 <span className="flex items-center gap-1 text-gray-400 "><span className="w-3 h-3 rounded-full" style={{ backgroundColor: slide.color }} /> Color: {slide.color}</span>
 </div>
 </div>
 <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 ">
 <button onClick={() => { setEditItem(slide); setShowModal('hero'); }} className="p-2 rounded-lg bg-[#E0E0F0] #5A2DA8]/10 text-[#5A2DA8] hover:bg-[#C1C1E0] #5A2DA8]/20 transition-all"><Edit3 size={14} /></button>
 <button onClick={() => { setHeroSlides(prev => prev.map(s => s.id === slide.id ? { ...s, active: !s.active } : s)); showToast(`Slide ${slide.active ? 'deactivated' : 'activated'}`); }} className="p-2 rounded-lg bg-amber-100 text-[#3A3992] hover:bg-amber-200 transition-all">{slide.active ? <EyeOff size={14} /> : <Eye size={14} />}</button>
 <button onClick={() => { setSelectedItem({ type: 'hero', id: slide.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-[#FDE0DC] text-[#D95C4A] hover:bg-red-200 transition-all"><Trash2 size={14} /></button>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );

 default: return null;
 }
 };

 return (
 <div className="dashboard-layout" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
 <ToastComp toast={toast} />
 {showModal === 'delete' && selectedItem?.type && (
  <DeleteConfirm onConfirm={async () => {
    const { type, id } = selectedItem;
    try {
      if (type === 'course' && typeof id === 'number') await coursesAPI.adminDelete(id);
      if (type === 'post' && typeof id === 'number') await newsAPI.adminDelete(id);
      if (type === 'testimonial' && typeof id === 'number') await testimonialsAPI.adminDelete(id);
    } catch (e) { /* local-only items won't have API endpoints */ }
    if (type === 'user') setUsers(prev => prev.filter(u => u.id !== id));
    if (type === 'course') setCourses(prev => prev.filter(c => c.id !== id));
    if (type === 'post') setPosts(prev => prev.filter(p => p.id !== id));
    if (type === 'testimonial') setTestimonials(prev => prev.filter(t => t.id !== id));
    if (type === 'gallery') setGalleryAlbums(prev => prev.filter(a => a.id !== id));
    if (type === 'hero') setHeroSlides(prev => prev.filter(s => s.id !== id));
    showToast('Item deleted');
    setShowModal(null); setSelectedItem(null);
  }} onCancel={() => { setShowModal(null); setSelectedItem(null); }} />
 )}

 {showModal === 'course' && (
 <Modal title={editItem?.id ? 'Edit Course' : 'New Course'} onClose={() => setShowModal(null)}>
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <Input label="Title" value={editItem?.title || newCourse.title} onChange={e => editItem ? setEditItem(p => ({ ...p, title: e.target.value })) : setNewCourse(p => ({ ...p, title: e.target.value }))} placeholder="Course title" />
  <Input label="Category" value={editItem?.category || newCourse.category} onChange={e => editItem ? setEditItem(p => ({ ...p, category: e.target.value })) : setNewCourse(p => ({ ...p, category: e.target.value }))} placeholder="Development" />
 </div>
 <Input label="Price" value={editItem?.price || newCourse.price} onChange={e => editItem ? setEditItem(p => ({ ...p, price: e.target.value })) : setNewCourse(p => ({ ...p, price: e.target.value }))} placeholder="500 ETB" />
 <Select label="Status" value={editItem?.status || newCourse.status} onChange={e => editItem ? setEditItem(p => ({ ...p, status: e.target.value })) : setNewCourse(p => ({ ...p, status: e.target.value }))} options={['Active', 'Inactive']} />
 <TextArea label="Description" rows={3} value={editItem?.desc || newCourse.desc} onChange={e => editItem ? setEditItem(p => ({ ...p, desc: e.target.value })) : setNewCourse(p => ({ ...p, desc: e.target.value }))} placeholder="Course description..." />
 <div className="flex justify-end gap-3 pt-2">
 <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
  <button onClick={async () => {
  try {
    const payload = (item) => {
      const p = { title: item.title, short_description: item.desc, price: item.price };
      if (item.category_id) p.category_id = item.category_id;
      return p;
    };
    if (editItem?.id && typeof editItem.id === 'number') {
      const upd = await coursesAPI.adminUpdate(editItem.id, payload(editItem));
      setCourses(prev => prev.map(c => c.id === editItem.id ? { ...c, ...upd, status: upd.is_active ? 'Active' : 'Inactive' } : c));
      showToast('Course saved to backend');
    } else {
      const created = await coursesAPI.adminCreate(payload(editItem || newCourse));
      setCourses(prev => [...prev, { ...created, id: created.id, status: 'Active', students: 0, lessons: created.lessons || 0 }]);
      showToast('Course created on backend');
    }
  } catch (e) { showToast('Failed to save course', 'error'); }
  setShowModal(null); setEditItem(null);
  }} className="px-6 py-3 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
 </div>
 </div>
 </Modal>
 )}

 {showModal === 'post' && (
 <Modal title={editItem?.id ? 'Edit Post' : 'New Post'} onClose={() => setShowModal(null)}>
 <div className="space-y-4">
 <Input label="Title" value={editItem?.title || ''} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))} placeholder="Post title" />
 <Input label="Image URL" value={editItem?.image || ''} onChange={e => setEditItem(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
 <TextArea label="Excerpt" rows={3} value={editItem?.excerpt || ''} onChange={e => setEditItem(p => ({ ...p, excerpt: e.target.value }))} placeholder="Post excerpt..." />
 <Select label="Status" value={editItem?.status || 'Draft'} onChange={e => setEditItem(p => ({ ...p, status: e.target.value }))} options={['Draft', 'Published']} />
 <div className="flex justify-end gap-3 pt-2">
 <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
 <button onClick={() => {
 if (editItem?.id) { setPosts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...editItem } : p)); showToast('Post updated'); }
 else { setPosts(prev => [...prev, { id: genId(), ...editItem, author: 'Admin', date: new Date().toISOString().split('T')[0] }]); showToast('Post created'); }
 setShowModal(null); setEditItem(null);
 }} className="px-6 py-3 bg-[#5A2DA8] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
 </div>
 </div>
 </Modal>
 )}

 {showModal === 'testimonial' && (
 <Modal title={editItem?.id ? 'Edit Testimonial' : 'New Testimonial'} onClose={() => setShowModal(null)}>
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <Input label="Name" value={editItem?.name || ''} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
 <Input label="Role" value={editItem?.role || ''} onChange={e => setEditItem(p => ({ ...p, role: e.target.value }))} placeholder="Senior Engineer" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <Input label="Company" value={editItem?.company || ''} onChange={e => setEditItem(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
 <Input label="Avatar URL" value={editItem?.avatar || ''} onChange={e => setEditItem(p => ({ ...p, avatar: e.target.value }))} placeholder="https://..." />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</label>
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map(n => (
 <button key={n} onClick={() => setEditItem(p => ({ ...p, rating: n }))} className="transition-all hover:scale-110">
 <Star size={24} className={n <= (editItem?.rating || 5) ? 'fill-[#3A3992] text-[#3A3992]' : 'text-gray-300 '} />
 </button>
 ))}
 </div>
 </div>
 <TextArea label="Testimonial" rows={3} value={editItem?.text || ''} onChange={e => setEditItem(p => ({ ...p, text: e.target.value }))} placeholder="Write testimonial..." />
 <div className="flex justify-end gap-3 pt-2">
 <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
 <button onClick={() => {
 if (editItem?.id) { setTestimonials(prev => prev.map(t => t.id === editItem.id ? { ...t, ...editItem } : t)); showToast('Testimonial updated'); }
 else { setTestimonials(prev => [...prev, { id: genId(), ...editItem, avatar: editItem.avatar || `https://i.pravatar.cc/100?img=${prev.length + 1}` }]); showToast('Testimonial added'); }
 setShowModal(null); setEditItem(null);
 }} className="px-6 py-3 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
 </div>
 </div>
 </Modal>
 )}

 {showModal === 'gallery' && (
 <Modal title={editItem?.id ? 'Edit Album' : 'New Album'} onClose={() => setShowModal(null)}>
 <div className="space-y-4">
 <Input label="Album Name" value={editItem?.name || ''} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} placeholder="Album name" />
 <Input label="Cover Image URL" value={editItem?.cover || ''} onChange={e => setEditItem(p => ({ ...p, cover: e.target.value }))} placeholder="https://..." />
 <div className="flex justify-end gap-3 pt-2">
 <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
 <button onClick={() => {
 if (editItem?.id) { setGalleryAlbums(prev => prev.map(a => a.id === editItem.id ? { ...a, ...editItem } : a)); showToast('Album updated'); }
 else { setGalleryAlbums(prev => [...prev, { id: genId(), ...editItem, count: 0 }]); showToast('Album created'); }
 setShowModal(null); setEditItem(null);
 }} className="px-6 py-3 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
 </div>
 </div>
 </Modal>
 )}

  {showModal === 'user' && (
  <Modal title={editItem?.id ? 'Edit User' : 'New User'} onClose={() => setShowModal(null)}>
  <div className="space-y-4">
  <Input label="Full Name" value={editItem?.name || ''} onChange={e => setEditItem(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
  <Input label="Email" value={editItem?.email || ''} onChange={e => setEditItem(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
  <div className="grid grid-cols-2 gap-4">
  <Input label="Phone" value={editItem?.phone || ''} onChange={e => setEditItem(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" />
  <Select label="Role" value={editItem?.role || 'Student'} onChange={e => setEditItem(p => ({ ...p, role: e.target.value }))} options={['Student', 'Admin']} />
  </div>
  {!editItem?.id && (
  <Input label="Password" type="password" value={editItem?.password || ''} onChange={e => setEditItem(p => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" />
  )}
  <div className="flex justify-end gap-3 pt-2">
  <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
  <button onClick={async () => {
  if (editItem?.id) {
  setUsers(prev => prev.map(u => u.id === editItem.id ? { ...u, ...editItem } : u));
  showToast('User updated');
  setShowModal(null); setEditItem(null);
  } else {
  const newUser = { id: genId(), ...editItem, joined: new Date().toISOString().split('T')[0], courses: 0, status: 'Active' };
  setUsers(prev => [...prev, newUser]);
  showToast('User added locally');
  try {
  const payload = {
    username: editItem.email?.split('@')[0] || editItem.name?.toLowerCase().replace(/\s/g, ''),
    email: editItem.email,
    password: editItem.password,
    full_name: editItem.name,
    phone_number: editItem.phone,
    role: editItem.role?.toLowerCase() || 'student',
  };
  const res = await authAPI.register(payload);
  if (res?.user?.role === editItem.role?.toLowerCase()) {
    showToast(`User registered as ${editItem.role}`);
  } else {
    showToast(`User created but role set to "${res?.user?.role || 'student'}" — set via admin panel`, 'error');
  }
  } catch (e) {
  const msg = e?.response?.data?.detail || e?.response?.data?.email?.[0] || e?.response?.data?.username?.[0] || e?.message || 'API unavailable';
  showToast(`User saved locally (${msg})`, 'error');
  }
  setShowModal(null); setEditItem(null);
  }
  }} className="px-6 py-3 bg-[#5A2DA8] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
  </div>
  </div>
  </Modal>
  )}

 {showModal === 'faq' && (
 <Modal title={editItem?.id ? 'Edit FAQ' : 'New FAQ'} onClose={() => setShowModal(null)}>
 <div className="space-y-4">
 <Input label="Question" value={editItem?.question || ''} onChange={e => setEditItem(p => ({ ...p, question: e.target.value }))} placeholder="What is your question?" />
 <Input label="Category" value={editItem?.category || 'General'} onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))} placeholder="General, Access, Benefits..." />
 <TextArea label="Answer" rows={4} value={editItem?.answer || ''} onChange={e => setEditItem(p => ({ ...p, answer: e.target.value }))} placeholder="Write the answer..." />
 <div className="flex justify-end gap-3 pt-2">
 <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
 <button onClick={() => {
 if (editItem?.id) { setFaqs(prev => prev.map(f => f.id === editItem.id ? { ...f, ...editItem } : f)); showToast('FAQ updated'); }
 else { setFaqs(prev => [...prev, { id: genId(), ...editItem }]); showToast('FAQ added'); }
 setShowModal(null); setEditItem(null);
 }} className="px-6 py-3 bg-[#3A3992] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
 </div>
 </div>
 </Modal>
 )}

 {showModal === 'hero' && (
 <Modal title={editItem?.id ? 'Edit Hero Slide' : 'New Hero Slide'} onClose={() => setShowModal(null)}>
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <Input label="Title" value={editItem?.title || ''} onChange={e => setEditItem(p => ({ ...p, title: e.target.value }))} placeholder="ELEVATE" />
 <Input label="Highlight Word" value={editItem?.highlight || ''} onChange={e => setEditItem(p => ({ ...p, highlight: e.target.value }))} placeholder="SKILL" />
 </div>
 <Input label="Image URL" value={editItem?.image || ''} onChange={e => setEditItem(p => ({ ...p, image: e.target.value }))} placeholder="https://... or imported image" />
 <TextArea label="Subtitle" rows={2} value={editItem?.subtitle || ''} onChange={e => setEditItem(p => ({ ...p, subtitle: e.target.value }))} placeholder="Subtitle text..." />
 <div className="grid grid-cols-2 gap-4">
 <Input label="CTA Text" value={editItem?.cta || ''} onChange={e => setEditItem(p => ({ ...p, cta: e.target.value }))} placeholder="GET STARTED" />
 <Input label="Accent Color" value={editItem?.color || '#EE8433'} onChange={e => setEditItem(p => ({ ...p, color: e.target.value }))} placeholder="#EE8433" />
 </div>
 <div className="flex justify-end gap-3 pt-2">
 <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
 <button onClick={() => {
 if (editItem?.id) { setHeroSlides(prev => prev.map(s => s.id === editItem.id ? { ...s, ...editItem } : s)); showToast('Hero slide updated'); }
 else { setHeroSlides(prev => [...prev, { id: genId(), ...editItem, active: true }]); showToast('Hero slide added'); }
 setShowModal(null); setEditItem(null);
 }} className="px-6 py-3 bg-gradient-to-r from-[#3A3992] to-[#EE8433] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
 </div>
 </div>
 </Modal>
 )}

 {selectedItem?.type === 'registration' && (
 <Modal title="Registration Details" onClose={() => setSelectedItem(null)}>
 <div className="space-y-6">
 <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 ">
 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3A3992] to-[#5A2DA8] flex items-center justify-center text-white font-black text-xl">{selectedItem.data.name.charAt(0)}</div>
 <div>
 <h4 className="text-xl font-bold text-gray-900 ">{selectedItem.data.name}</h4>
 <p className="text-sm text-gray-500 ">{selectedItem.data.email}</p>
 </div>
 <div className="ml-auto"><StatusBadge status={selectedItem.data.status} /></div>
 </div>
 <div className="grid grid-cols-2 gap-4 text-sm">
 {[
 { icon: <Phone size={16} />, label: 'Phone', value: selectedItem.data.phone },
 { icon: <Mail size={16} />, label: 'Email', value: selectedItem.data.email },
 { icon: <BookOpen size={16} />, label: 'Course', value: selectedItem.data.course },
 { icon: <Calendar size={16} />, label: 'Registered', value: selectedItem.data.date },
 ].map((item, i) => (
 <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 ">
 <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{item.icon} {item.label}</div>
 <p className="text-gray-900 font-semibold">{item.value}</p>
 </div>
 ))}
 </div>
 <div className="flex gap-3">
 <button onClick={() => { setRegistrations(prev => prev.map(r => r.id === selectedItem.data.id ? { ...r, status: 'Approved' } : r)); setSelectedItem(null); showToast('Registration approved'); }} className="flex-1 py-3 bg-green-600 text-white font-black text-xs rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"><CheckCircle size={16} /> Approve</button>
 <button onClick={() => { setRegistrations(prev => prev.map(r => r.id === selectedItem.data.id ? { ...r, status: 'Rejected' } : r)); setSelectedItem(null); showToast('Registration rejected'); }} className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"><XCircle size={16} /> Reject</button>
 </div>
 </div>
 </Modal>
 )}

 <aside className="dashboard-sidebar gradient-brand-sidebar flex flex-col" style={{ background: 'linear-gradient(180deg, #1E1B4B 0%, #0F0A3A 100%)' }}>
  <div className="p-6 border-b border-white/10 shrink-0">
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A3992] to-[#D95C4A] flex items-center justify-center shadow-lg shadow-[#3A3992]/30"><GraduationCap size={20} className="text-white" /></div>
  <div>
  <h3 className="text-white font-black text-sm tracking-tight">Admin Panel</h3>
  <p className="text-white/50 text-[10px] font-medium">Elevate Skill</p>
  </div>
  </div>
  </div>

  <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
  {sidebarItems.map(item => {
  const isActive = activeTab === item.id || (item.children?.some(c => c.id === activeTab));
  return (
  <div key={item.id}>
  <button onClick={() => handleSidebarClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
  <span className={isActive ? 'text-[#3A3992]' : ''}>{item.icon}</span>
  <span className="flex-1 text-left">{item.label}</span>
  {item.children && <ChevronDown size={14} className={`transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />}
  </button>
  {item.children && mediaOpen && (
  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="ml-6 mt-1 space-y-1 overflow-hidden">
  {item.children.map(child => (
  <button key={child.id} onClick={() => { setActiveTab(child.id); setMediaOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === child.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
  <span className={activeTab === child.id ? 'text-[#3A3992]' : ''}>{child.icon}</span>
  {child.label}
  </button>
  ))}
  </motion.div>
  )}
  </div>
  );
  })}
  </nav>

  <div className="p-4 border-t border-white/10 shrink-0">
  <button onClick={() => { logout(); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#D95C4A] hover:bg-[#D95C4A]/10 transition-all"><LogOut size={18} /> Logout</button>
  </div>
  </aside>

  <div className="dashboard-main">
   <header className="dashboard-header bg-brand-card/80 backdrop-blur-xl border-b border-brand-border px-6 py-4 flex items-center justify-between">
   <div className="flex items-center gap-4">
   <span className="text-sm font-bold text-brand-text capitalize tracking-wide">{activeTab}</span>
   </div>
   <div className="flex items-center gap-4">
   <button className="relative p-2 rounded-lg hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary transition-all">
  <Bell size={18} />
  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3A3992] rounded-full animate-pulse" />
   </button>
   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3A3992] to-[#5A2DA8] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#3A3992]/20">{(user?.full_name || 'A')[0]}</div>
   </div>
   </header>

 <main className="dashboard-content p-4 lg:p-6">
 {renderContent()}
 </main>
  </div>

  {/* Payment Detail Modal */}
  {selectedPayment && (
  <PaymentDetailModal
  payment={selectedPayment}
  onClose={() => setSelectedPayment(null)}
  onApprove={async (id) => {
  try {
  await paymentsAPI.adminApprove(id);
  setPaymentList(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  setSelectedPayment(null);
  showToast('Payment approved');
  } catch (e) { showToast('Approve failed', 'error'); }
  }}
  onReject={async (id) => {
  try {
  await paymentsAPI.adminReject(id);
  setPaymentList(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  setSelectedPayment(null);
  showToast('Payment rejected');
  } catch (e) { showToast('Reject failed', 'error'); }
  }}
  onShowImage={(src) => setLightboxImage(src)}
  />
  )}

  {/* Lightbox */}
  {lightboxImage && (
  <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
  )}
  </div>
  );
}
