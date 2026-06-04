import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, Megaphone, LogOut,
  CheckCircle, XCircle, Eye, ChevronDown, Search,
  Menu, X, UserPlus, Bell, FileText, Plus, Sparkles,
  GraduationCap, Clock, TrendingUp, ArrowRight, Sun, Moon,
  Image, Camera, Newspaper, MessageSquare, ChevronRight,
  Edit3, Trash2, Star, Link, Download, Upload,
  Filter, Mail, Phone, Calendar, MapPin, Send,
  AlertTriangle, Info, RefreshCw, CheckCheck, Ban,
  Maximize2, Grid, List, Heart, Share2, Play,
  UserCheck, UserX, UserCog, Shield, Award,
  ChevronLeft, ChevronRight as ChevronRightIcon, SlidersHorizontal, Zap, EyeOff
} from 'lucide-react';
import gr1 from '../../assets/gr1.jpg';
import gr3 from '../../assets/gr3.jpg';
import grad2 from '../../assets/grad2.jpg';
import { loadData, saveData } from '../../data/dataStore';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'hero', label: 'Hero Slides', icon: <SlidersHorizontal size={20} /> },
  { id: 'registrations', label: 'Registrations', icon: <UserPlus size={20} /> },
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
  { id: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
];

const genId = () => Date.now() + Math.random();

const initialRegistrations = [
  { id: genId(), name: 'Dawit Mekonnen', email: 'dawit@example.com', phone: '+251 911 234 567', status: 'Pending', date: '2026-06-01', course: 'Full-Stack Web Dev', amount: '500 ETB' },
  { id: genId(), name: 'Selamawit Bekele', email: 'selam@example.com', phone: '+251 922 345 678', status: 'Approved', date: '2026-05-28', course: 'UI/UX Design', amount: '500 ETB' },
  { id: genId(), name: 'Abenezer Lemma', email: 'abenezer@example.com', phone: '+251 933 456 789', status: 'Rejected', date: '2026-05-25', course: 'AI & ML', amount: '500 ETB' },
];
const initialUsers = [
  { id: genId(), name: 'Dawit Mekonnen', email: 'dawit@example.com', role: 'Student', status: 'Active', joined: '2026-01-15', courses: 3 },
  { id: genId(), name: 'Selamawit Bekele', email: 'selam@example.com', role: 'Student', status: 'Active', joined: '2026-02-20', courses: 2 },
  { id: genId(), name: 'Admin User', email: 'admin@elevate.com', role: 'Admin', status: 'Active', joined: '2025-12-01', courses: 0 },
];
const initialCourses = [
  { id: genId(), title: 'Full-Stack Web Development', category: 'Development', students: 245, lessons: 48, status: 'Active', price: '500 ETB', desc: 'Master React, Node.js, and scalable architectures.' },
  { id: genId(), title: 'UI/UX Design Mastery', category: 'Design', students: 189, lessons: 36, status: 'Active', price: '450 ETB', desc: 'Prototyping and user-centric systems.' },
  { id: genId(), title: 'AI & Machine Learning', category: 'AI', students: 312, lessons: 52, status: 'Active', price: '600 ETB', desc: 'LLMs, Neural Networks, and practical AI.' },
];
const initialPosts = [
  { id: genId(), title: 'Why Full-Stack Development is the Future', author: 'Admin', date: '2026-05-20', status: 'Published', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', excerpt: 'The tech industry is evolving rapidly...' },
  { id: genId(), title: 'UI/UX Trends for 2026', author: 'Admin', date: '2026-05-18', status: 'Draft', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400', excerpt: 'Stay ahead of the curve with these trends...' },
];
const initialTestimonials = [
  { id: genId(), name: 'Dawit Mekonnen', role: 'Senior Fullstack Engineer', company: 'Addis Tech Hub', text: 'The project-based approach taught me how to architect complex systems. I doubled my salary in six months.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: genId(), name: 'Selamawit Bekele', role: 'UI/UX Lead', company: 'Creative Flow Agency', text: 'I learned the psychology of design. The feedback from world-class mentors helped me build a portfolio.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=2' },
];
const initialPhotos = [
  { id: genId(), url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', name: 'coding-session.jpg', size: '2.4 MB', uploaded: '2026-05-20' },
  { id: genId(), url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400', name: 'design-workshop.jpg', size: '1.8 MB', uploaded: '2026-05-18' },
  { id: genId(), url: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400', name: 'graduation-day.jpg', size: '3.1 MB', uploaded: '2026-05-15' },
  { id: genId(), url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400', name: 'campus-event.jpg', size: '2.7 MB', uploaded: '2026-05-12' },
  { id: genId(), url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', name: 'seminar.jpg', size: '1.9 MB', uploaded: '2026-05-10' },
];
const initialGalleryAlbums = [
  { id: genId(), name: 'Campus Events 2026', count: 12, cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400' },
  { id: genId(), name: 'Graduation Ceremony', count: 8, cover: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400' },
  { id: genId(), name: 'Workshops & Seminars', count: 15, cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
];
const initialAnnouncements = [];

const initialHeroSlides = [
  { id: genId(), image: gr1, title: 'ELEVATE', highlight: 'SKILL', subtitle: 'Project-based learning platform designed for the modern engineer.', cta: 'GET STARTED', color: '#3C83F6', active: true },
  { id: genId(), image: gr3, title: 'YOUR', highlight: 'JOURNEY', subtitle: 'From beginner to senior architect. Structured paths that adapt to your pace and goals.', cta: 'EXPLORE PATHS', color: '#f89f29', active: true },
  { id: genId(), image: grad2, title: 'MASTER', highlight: 'CRAFT', subtitle: 'Industry-driven curriculum with real mentors. Code, design, deploy — master the full stack.', cta: 'WATCH NOW', color: '#17c966', active: true },
];

export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('admin-theme') !== 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('admin-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mediaOpen, setMediaOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [users, setUsers] = useState(initialUsers);
  const [courses, setCourses] = useState(() => loadData('courses'));
  const [posts, setPosts] = useState(() => loadData('posts'));
  const [testimonials, setTestimonials] = useState(() => loadData('testimonials'));
  const [photos, setPhotos] = useState(initialPhotos);
  const [galleryAlbums, setGalleryAlbums] = useState(initialGalleryAlbums);
  const [announcements, setAnnouncements] = useState(() => loadData('announcements'));
  const [heroSlides, setHeroSlides] = useState(() => loadData('heroSlides').length ? loadData('heroSlides') : initialHeroSlides);

  useEffect(() => {
    saveData('heroSlides', heroSlides);
    saveData('courses', courses);
    saveData('testimonials', testimonials);
    saveData('posts', posts);
    saveData('announcements', announcements);
  }, [heroSlides, courses, testimonials, posts, announcements]);

  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '' });
  const [newCourse, setNewCourse] = useState({ title: '', category: '', desc: '', price: '', status: 'Active' });

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
    { label: 'Total Registrations', value: stats.total, icon: <UserPlus size={24} />, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Review', value: stats.pending, icon: <Clock size={24} />, color: 'from-amber-500 to-amber-600' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle size={24} />, color: 'from-green-500 to-green-600' },
    { label: 'Active Users', value: stats.activeUsers, icon: <Users size={24} />, color: 'from-violet-500 to-violet-600' },
    { label: 'Courses', value: stats.totalCourses, icon: <BookOpen size={24} />, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Published Posts', value: stats.totalPosts, icon: <Newspaper size={24} />, color: 'from-pink-500 to-pink-600' },
  ];

  const handleSidebarClick = (id) => {
    if (id === 'media') { setMediaOpen(!mediaOpen); if (!mediaOpen) setActiveTab('posts'); }
    else { setActiveTab(id); setMediaOpen(false); }
  };

  const Modal = ({ title, children, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-white/10 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/40 transition-all"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );

  const Toast = () => toast && (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-sm font-bold ${toast.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'}`}>
      {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
      {toast.message}
    </motion.div>
  );

  const DeleteConfirm = ({ onConfirm, onCancel }) => (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <div className="text-center">
        <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-white/70 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all">Delete</button>
        </div>
      </div>
    </Modal>
  );

  const Input = ({ label, ...props }) => (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">{label}</label>}
      <input {...props} className={`w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20 ${props.className || ''}`} />
    </div>
  );

  const TextArea = ({ label, ...props }) => (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">{label}</label>}
      <textarea {...props} className={`w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20 resize-none ${props.className || ''}`} />
    </div>
  );

  const Select = ({ label, options, ...props }) => (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">{label}</label>}
      <select {...props} className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const map = {
      Approved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
      Rejected: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
      Pending: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
      Active: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
      Inactive: 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400',
      Published: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
      Draft: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
      Admin: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400',
      Student: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
    };
    return <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider inline-block ${map[status] || 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40'}`}>{status}</span>;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Dashboard</h2>
              <p className="text-gray-500 dark:text-white/40 text-sm font-medium">Overview of your platform activity</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {statCards.map((card, i) => (
                <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 group hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer" onClick={() => { const map = { 'Total Registrations': 'registrations', 'Pending Review': 'registrations', 'Approved': 'registrations', 'Active Users': 'users', 'Courses': 'courses', 'Published Posts': 'posts' }; setActiveTab(map[card.label]); }}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${card.color}`} />
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-white/70">{card.icon}</div>
                    <TrendingUp size={16} className="text-green-500/60" />
                  </div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{card.value}</p>
                  <p className="text-[10px] text-gray-500 dark:text-white/40 font-medium mt-1 tracking-wide">{card.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-[#f89f29]" /> Recent Activity</h3>
                <div className="space-y-3">
                  {registrations.slice(0, 5).map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${r.status === 'Approved' ? 'bg-green-500' : r.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{r.name} registered</p>
                          <p className="text-[10px] text-gray-400 dark:text-white/30">{r.date}</p>
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Zap size={18} className="text-[#15c8fb]" /> Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'New Course', icon: <BookOpen size={16} />, tab: 'courses', color: 'from-cyan-500/20 to-blue-500/20 text-[#15c8fb]' },
                    { label: 'New Post', icon: <Newspaper size={16} />, tab: 'posts', color: 'from-pink-500/20 to-rose-500/20 text-pink-600 dark:text-pink-400' },
                    { label: 'New User', icon: <UserPlus size={16} />, tab: 'users', color: 'from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400' },
                    { label: 'Announcement', icon: <Megaphone size={16} />, tab: 'announcements', color: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400' },
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
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Registrations</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">Manage user registrations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-48 pl-10 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 placeholder:text-gray-400 dark:placeholder:text-white/20" />
                </div>
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                  {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${statusFilter === s ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    {['Full Name', 'Email', 'Phone', 'Course', 'Status', 'Actions'].map(h => <th key={h} className={`text-left p-3 text-[10px] font-black text-gray-500 dark:text-white/50 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery || statusFilter !== 'All' ? registrations.filter(r => {
                    const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
                    return matchesSearch && matchesStatus;
                  }) : registrations).map((r, i) => (
                    <motion.tr key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-3"><span className="font-semibold text-gray-900 dark:text-white text-sm">{r.name}</span></td>
                      <td className="p-3 text-gray-500 dark:text-white/60 text-xs">{r.email}</td>
                      <td className="p-3 text-gray-500 dark:text-white/60 text-xs">{r.phone}</td>
                      <td className="p-3 text-gray-500 dark:text-white/60 text-xs">{r.course}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { const updated = registrations.map(x => x.id === r.id ? { ...x, status: 'Approved' } : x); setRegistrations(updated); showToast(`${r.name} approved`); }} disabled={r.status === 'Approved'} className="p-2 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Approve"><CheckCircle size={16} /></button>
                          <button onClick={() => { const updated = registrations.map(x => x.id === r.id ? { ...x, status: 'Rejected' } : x); setRegistrations(updated); showToast(`${r.name} rejected`); }} disabled={r.status === 'Rejected'} className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all" title="Reject"><XCircle size={16} /></button>
                          <button onClick={() => setSelectedItem({ type: 'registration', data: r })} className="p-2 rounded-lg bg-blue-100 dark:bg-[#15c8fb]/10 text-[#15c8fb] hover:bg-blue-200 dark:hover:bg-[#15c8fb]/20 transition-all" title="View Details"><Eye size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {registrations.length === 0 && <div className="p-12 text-center"><UserPlus size={40} className="mx-auto text-gray-300 dark:text-white/10 mb-4" /><p className="text-gray-400 dark:text-white/30 text-sm">No registrations yet</p></div>}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Users</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{users.length} total users</p>
              </div>
              <button onClick={() => { setEditItem({ name: '', email: '', role: 'Student', status: 'Active' }); setShowModal('user'); }} className="flex items-center gap-2 px-6 py-3 bg-[#15c8fb] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add User</button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    {['Name', 'Email', 'Role', 'Status', 'Joined', 'Courses', 'Actions'].map(h => <th key={h} className={`text-left p-3 text-[10px] font-black text-gray-500 dark:text-white/50 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-3"><span className="font-semibold text-gray-900 dark:text-white text-sm">{u.name}</span></td>
                      <td className="p-3 text-gray-500 dark:text-white/60 text-xs">{u.email}</td>
                      <td className="p-3"><StatusBadge status={u.role} /></td>
                      <td className="p-3"><StatusBadge status={u.status} /></td>
                      <td className="p-3 text-gray-500 dark:text-white/60 text-xs">{u.joined}</td>
                      <td className="p-3 text-gray-500 dark:text-white/60 text-xs">{u.courses}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditItem(u); setShowModal('user'); }} className="p-2 rounded-lg bg-blue-100 dark:bg-[#15c8fb]/10 text-[#15c8fb] hover:bg-blue-200 dark:hover:bg-[#15c8fb]/20 transition-all" title="Edit"><Edit3 size={16} /></button>
                          <button onClick={() => { setSelectedItem({ type: 'user', id: u.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Courses</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{courses.length} courses available</p>
              </div>
              <button onClick={() => { setNewCourse({ title: '', category: '', desc: '', price: '', status: 'Active' }); setShowModal('course'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add Course</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-5 hover:border-[#15c8fb]/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-[#15c8fb]/10 text-[#15c8fb]"><BookOpen size={24} /></div>
                    <StatusBadge status={course.status} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#15c8fb] transition-colors">{course.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40 mb-1">{course.category}</p>
                  <p className="text-xs text-gray-400 dark:text-white/30 mb-4 line-clamp-2">{course.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white/40 mb-4">
                    <span>{course.students} students</span>
                    <span>{course.lessons} lessons</span>
                    <span className="font-bold text-[#15c8fb]">{course.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 border border-[#15c8fb]/30 text-[#15c8fb] font-bold text-xs rounded-xl hover:bg-[#15c8fb] hover:text-white transition-all">Apply</button>
                    <button onClick={() => { setEditItem(course); setShowModal('course'); }} className="p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/5 transition-all"><Edit3 size={14} /></button>
                    <button onClick={() => { setSelectedItem({ type: 'course', id: course.id }); setShowModal('delete'); }} className="p-3 rounded-xl border border-gray-200 dark:border-white/10 text-red-500/60 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all"><Trash2 size={14} /></button>
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
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Posts</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{posts.filter(p => p.status === 'Published').length} published, {posts.filter(p => p.status === 'Draft').length} drafts</p>
              </div>
              <button onClick={() => { setEditItem({ title: '', excerpt: '', image: '', status: 'Draft', author: 'Admin' }); setShowModal('post'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#15c8fb] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> New Post</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 overflow-hidden hover:border-[#15c8fb]/30 transition-all group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3"><StatusBadge status={post.status} /></div>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-gray-400 dark:text-white/30 mb-1">{post.date} · {post.author}</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#15c8fb] transition-colors">{post.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-white/40 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditItem(post); setShowModal('post'); }} className="p-2 rounded-lg bg-blue-100 dark:bg-[#15c8fb]/10 text-[#15c8fb] hover:bg-blue-200 dark:hover:bg-[#15c8fb]/20 transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => { setSelectedItem({ type: 'post', id: post.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
                      <button onClick={() => { setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p)); showToast(`${post.title} ${post.status === 'Published' ? 'unpublished' : 'published'}`); }} className="ml-auto p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10 transition-all" title="Toggle Status">{post.status === 'Published' ? <XCircle size={14} /> : <CheckCircle size={14} />}</button>
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
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Testimonials</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{testimonials.length} student testimonials</p>
              </div>
              <button onClick={() => { setEditItem({ name: '', role: '', company: '', text: '', rating: 5 }); setShowModal('testimonial'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add Testimonial</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-5 hover:border-[#f89f29]/30 transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className={j < t.rating ? 'fill-[#f89f29] text-[#f89f29]' : 'text-gray-300 dark:text-white/10'} />)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-white/70 italic mb-4 line-clamp-3">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-white/30">{t.role} · {t.company}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditItem(t); setShowModal('testimonial'); }} className="p-2 rounded-lg bg-blue-100 dark:bg-[#15c8fb]/10 text-[#15c8fb] hover:bg-blue-200 dark:hover:bg-[#15c8fb]/20 transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => { setSelectedItem({ type: 'testimonial', id: t.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
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
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Photos</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{photos.length} photos uploaded</p>
              </div>
              <label className="flex items-center gap-2 px-5 py-2.5 bg-[#15c8fb] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
                <Upload size={16} /> Upload Photos
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => { const files = Array.from(e.target.files); files.forEach(f => { const reader = new FileReader(); reader.onload = (ev) => { const url = ev.target?.result; if (typeof url === 'string') { setPhotos(prev => [...prev, { id: genId(), url, name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, uploaded: new Date().toISOString().split('T')[0] }]); } }; reader.readAsDataURL(f); }); showToast(`${files.length} photo(s) uploaded`); }} />
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {photos.map((photo, i) => (
                <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <a href={photo.url} download className="p-2 rounded-lg bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-all"><Download size={16} /></a>
                    <button onClick={() => { setPhotos(prev => prev.filter(p => p.id !== photo.id)); showToast('Photo deleted'); }} className="p-2 rounded-lg bg-white/20 backdrop-blur text-white hover:bg-red-500/60 transition-all"><Trash2 size={16} /></button>
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
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Gallery</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{galleryAlbums.length} albums</p>
              </div>
              <button onClick={() => { setEditItem({ name: '', cover: '' }); setShowModal('gallery'); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> New Album</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryAlbums.map((album, i) => (
                <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 overflow-hidden hover:border-[#f89f29]/30 transition-all group cursor-pointer">
                  <div className="h-48 overflow-hidden relative">
                    <img src={album.cover} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">{album.name}</h3>
                      <p className="text-white/70 text-xs">{album.count} photos</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <button className="text-xs font-bold text-[#15c8fb] hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center gap-1">View Album <ChevronRightIcon size={14} /></button>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setEditItem(album); setShowModal('gallery'); }} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-white/40 transition-all"><Edit3 size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedItem({ type: 'gallery', id: album.id }); setShowModal('delete'); }} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-white/40 transition-all"><Trash2 size={14} /></button>
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
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Announcements</h2>
              <p className="text-gray-500 dark:text-white/40 text-sm font-medium">Post platform-wide announcements</p>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-5 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Megaphone size={18} className="text-[#f89f29]" /> New Announcement</h3>
              <Input placeholder="Announcement Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement(p => ({ ...p, title: e.target.value }))} />
              <TextArea placeholder="Write your announcement..." rows={4} value={newAnnouncement.body} onChange={e => setNewAnnouncement(p => ({ ...p, body: e.target.value }))} />
              <div className="flex justify-end">
                <button onClick={() => { if (!newAnnouncement.title || !newAnnouncement.body) return; setAnnouncements(prev => [...prev, { ...newAnnouncement, id: genId(), date: new Date().toISOString().split('T')[0] }]); setNewAnnouncement({ title: '', body: '' }); showToast('Announcement published'); }} className="px-6 py-2.5 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider flex items-center gap-2"><Sparkles size={14} /> Publish</button>
              </div>
            </div>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-12 text-center">
                  <Megaphone size={40} className="mx-auto text-gray-300 dark:text-white/10 mb-4" />
                  <h3 className="text-lg font-bold text-gray-500 dark:text-white/40 mb-1">No announcements yet</h3>
                  <p className="text-gray-400 dark:text-white/20 text-sm">Published announcements will appear here</p>
                </div>
              ) : announcements.map(a => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-6 hover:border-[#f89f29]/30 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Megaphone size={16} className="text-[#f89f29]" />
                        <h3 className="font-bold text-gray-900 dark:text-white">{a.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white/60">{a.body}</p>
                      <p className="text-[10px] text-gray-400 dark:text-white/30 mt-2">{a.date}</p>
                    </div>
                    <button onClick={() => { setAnnouncements(prev => prev.filter(x => x.id !== a.id)); showToast('Announcement deleted'); }} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 text-gray-400 dark:text-white/30 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
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
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Hero Slides</h2>
                <p className="text-gray-500 dark:text-white/40 text-sm font-medium">{heroSlides.length} slides · Manage your landing page hero slider</p>
              </div>
              <button onClick={() => { setEditItem({ image: '', title: '', highlight: '', subtitle: '', cta: 'GET STARTED', color: '#3C83F6', active: true }); setShowModal('hero'); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#f89f29] to-[#3C83F6] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider"><Plus size={16} /> Add Slide</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {heroSlides.map((slide, i) => (
                <motion.div key={slide.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 overflow-hidden hover:border-[#15c8fb]/30 transition-all group">
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
                          <span className="text-xs text-gray-400 dark:text-white/30 font-bold">Slide {i + 1}</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: slide.color }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{slide.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f89f29] to-[#3C83F6]">{slide.highlight}</span></h3>
                        <p className="text-sm text-gray-500 dark:text-white/40 mb-3">{slide.subtitle}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/60 font-bold">{slide.cta}</span>
                          <span className="flex items-center gap-1 text-gray-400 dark:text-white/30"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: slide.color }} /> Color: {slide.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                        <button onClick={() => { setEditItem(slide); setShowModal('hero'); }} className="p-2 rounded-lg bg-blue-100 dark:bg-[#15c8fb]/10 text-[#15c8fb] hover:bg-blue-200 dark:hover:bg-[#15c8fb]/20 transition-all"><Edit3 size={14} /></button>
                        <button onClick={() => { setHeroSlides(prev => prev.map(s => s.id === slide.id ? { ...s, active: !s.active } : s)); showToast(`Slide ${slide.active ? 'deactivated' : 'activated'}`); }} className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/20 transition-all">{slide.active ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        <button onClick={() => { setSelectedItem({ type: 'hero', id: slide.id }); setShowModal('delete'); }} className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all"><Trash2 size={14} /></button>
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex transition-colors duration-300">
      <Toast />
      {showModal === 'delete' && selectedItem?.type && (
        <DeleteConfirm onConfirm={() => {
          const { type, id } = selectedItem;
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
              <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => {
                if (editItem?.id) { setCourses(prev => prev.map(c => c.id === editItem.id ? { ...c, ...editItem } : c)); showToast('Course updated'); }
                else { setCourses(prev => [...prev, { id: genId(), ...newCourse, students: 0, lessons: 0 }]); showToast('Course created'); }
                setShowModal(null); setEditItem(null);
              }} className="px-6 py-3 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
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
              <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => {
                if (editItem?.id) { setPosts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...editItem } : p)); showToast('Post updated'); }
                else { setPosts(prev => [...prev, { id: genId(), ...editItem, author: 'Admin', date: new Date().toISOString().split('T')[0] }]); showToast('Post created'); }
                setShowModal(null); setEditItem(null);
              }} className="px-6 py-3 bg-[#15c8fb] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
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
              <label className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setEditItem(p => ({ ...p, rating: n }))} className="transition-all hover:scale-110">
                    <Star size={24} className={n <= (editItem?.rating || 5) ? 'fill-[#f89f29] text-[#f89f29]' : 'text-gray-300 dark:text-white/20'} />
                  </button>
                ))}
              </div>
            </div>
            <TextArea label="Testimonial" rows={3} value={editItem?.text || ''} onChange={e => setEditItem(p => ({ ...p, text: e.target.value }))} placeholder="Write testimonial..." />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => {
                if (editItem?.id) { setTestimonials(prev => prev.map(t => t.id === editItem.id ? { ...t, ...editItem } : t)); showToast('Testimonial updated'); }
                else { setTestimonials(prev => [...prev, { id: genId(), ...editItem, avatar: editItem.avatar || `https://i.pravatar.cc/100?img=${prev.length + 1}` }]); showToast('Testimonial added'); }
                setShowModal(null); setEditItem(null);
              }} className="px-6 py-3 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
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
              <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => {
                if (editItem?.id) { setGalleryAlbums(prev => prev.map(a => a.id === editItem.id ? { ...a, ...editItem } : a)); showToast('Album updated'); }
                else { setGalleryAlbums(prev => [...prev, { id: genId(), ...editItem, count: 0 }]); showToast('Album created'); }
                setShowModal(null); setEditItem(null);
              }} className="px-6 py-3 bg-[#f89f29] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
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
              <Select label="Role" value={editItem?.role || 'Student'} onChange={e => setEditItem(p => ({ ...p, role: e.target.value }))} options={['Student', 'Admin']} />
              <Select label="Status" value={editItem?.status || 'Active'} onChange={e => setEditItem(p => ({ ...p, status: e.target.value }))} options={['Active', 'Inactive']} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => {
                if (editItem?.id) { setUsers(prev => prev.map(u => u.id === editItem.id ? { ...u, ...editItem } : u)); showToast('User updated'); }
                else { setUsers(prev => [...prev, { id: genId(), ...editItem, joined: new Date().toISOString().split('T')[0], courses: 0 }]); showToast('User added'); }
                setShowModal(null); setEditItem(null);
              }} className="px-6 py-3 bg-[#15c8fb] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
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
              <Input label="Accent Color" value={editItem?.color || '#3C83F6'} onChange={e => setEditItem(p => ({ ...p, color: e.target.value }))} placeholder="#3C83F6" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(null)} className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-white/60 font-bold text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => {
                if (editItem?.id) { setHeroSlides(prev => prev.map(s => s.id === editItem.id ? { ...s, ...editItem } : s)); showToast('Hero slide updated'); }
                else { setHeroSlides(prev => [...prev, { id: genId(), ...editItem, active: true }]); showToast('Hero slide added'); }
                setShowModal(null); setEditItem(null);
              }} className="px-6 py-3 bg-gradient-to-r from-[#f89f29] to-[#3C83F6] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all">Save</button>
            </div>
          </div>
        </Modal>
      )}

      {selectedItem?.type === 'registration' && (
        <Modal title="Registration Details" onClose={() => setSelectedItem(null)}>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f89f29] to-[#15c8fb] flex items-center justify-center text-white font-black text-xl">{selectedItem.data.name.charAt(0)}</div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedItem.data.name}</h4>
                <p className="text-sm text-gray-500 dark:text-white/40">{selectedItem.data.email}</p>
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
                <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 dark:text-white/30 text-[10px] uppercase tracking-wider font-bold mb-1">{item.icon} {item.label}</div>
                  <p className="text-gray-900 dark:text-white font-semibold">{item.value}</p>
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

      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 0 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} fixed lg:relative z-40 h-screen bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/5 flex flex-col overflow-hidden transition-all`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f89f29] to-[#15c8fb] flex items-center justify-center"><GraduationCap size={20} className="text-white" /></div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-black text-sm tracking-tight">Admin Panel</h3>
              <p className="text-gray-500 dark:text-white/30 text-[10px] font-medium">Elevate Skill</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-hidden">
          {sidebarItems.map(item => (
            <div key={item.id}>
              <button onClick={() => handleSidebarClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id || (item.children?.some(c => c.id === activeTab)) ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                <span className={activeTab === item.id || (item.children?.some(c => c.id === activeTab)) ? 'text-[#f89f29]' : ''}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && <ChevronDown size={14} className={`transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />}
              </button>
              {item.children && mediaOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="ml-6 mt-1 space-y-1 overflow-hidden">
                  {item.children.map(child => (
                    <button key={child.id} onClick={() => { setActiveTab(child.id); setMediaOpen(true); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === child.id ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                      <span className={activeTab === child.id ? 'text-[#15c8fb]' : ''}>{child.icon}</span>
                      {child.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400/60 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all"><LogOut size={18} /> Logout</button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />
            <span className="text-sm font-medium text-gray-500 dark:text-white/40 capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f89f29] rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f89f29] to-[#15c8fb] flex items-center justify-center text-white font-black text-xs">A</div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-5 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
