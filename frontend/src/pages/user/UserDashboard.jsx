import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
 User, Mail, Phone, Lock,
 CheckCircle, Upload, FileText,
 GraduationCap, ShieldCheck, Sparkles, LogOut,
 Bell, Home, BookOpen, MessageCircle, Settings,
  AlertTriangle, Clock, Play,
  Send, Headphones,
 Save, CreditCard, TrendingUp, BarChart3, ArrowRight,
  Eye, X, Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsAPI, paymentsAPI, authAPI, getMediaUrl } from '../../services/api';

const sidebarItems = [
 { id: 'home', label: 'Home', icon: <Home size={18} /> },
 { id: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
 { id: 'payment', label: 'Payment Proof', icon: <Upload size={18} /> },
 { id: 'support', label: 'Support', icon: <MessageCircle size={18} /> },
 { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];



export default function UserDashboard() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'Normal' });
 const [showTicketSuccess, setShowTicketSuccess] = useState(false);

 const [profile, setProfile] = useState(() => ({
 full_name: user?.full_name || 'Student',
 email: user?.email || '',
 phone: user?.phone_number || '',
 bio: 'Passionate about learning.'
 }));
 const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
 const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });

  const [paymentForm, setPaymentForm] = useState({ full_name: '', email: '', phone: '', amount: '', comment: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  // Fetch real data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, payRes, profileRes] = await Promise.allSettled([
          enrollmentsAPI.myEnrollments(),
          paymentsAPI.myPayments(),
          authAPI.getProfile(),
        ]);
        if (enrollRes.status === 'fulfilled' && enrollRes.value?.length) {
          const adapted = enrollRes.value.map(e => ({
            id: e.id, title: e.course?.title || e.title || 'Course',
            progress: e.progress || 0, instructor: e.course?.instructor || 'Instructor',
            lessons: e.course?.lessons || 0, completed: e.completed_lessons || 0,
            nextLesson: e.next_lesson || 'Continue learning',
            image: e.course?.thumbnail || '',
          }));
          setEnrolledCourses(adapted);
        }
        if (payRes.status === 'fulfilled' && payRes.value?.length) {
          setPaymentHistory(payRes.value);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value) {
          const p = profileRes.value;
          setProfile({
            full_name: p.full_name || p.username || 'Student',
            email: p.email || '',
            phone: p.phone_number || '',
            bio: p.bio || 'Passionate about learning.',
          });
        }
      } catch (e) { /* API unavailable — keep local state */ }
    };
    fetchData();
  }, []);

  const handlePaymentSubmit = async () => {
  if (!paymentForm.full_name || !paymentForm.email || !paymentForm.phone || !paymentForm.amount) { showToast('Please fill in all required fields', 'error'); return; }
  if (!uploadedFile) { showToast('Please upload payment proof', 'error'); return; }
  try {
    const formData = new FormData();
    formData.append('full_name', paymentForm.full_name);
    formData.append('email', paymentForm.email);
    formData.append('phone', paymentForm.phone);
    formData.append('amount', paymentForm.amount);
    if (paymentForm.comment) formData.append('comment', paymentForm.comment);
    formData.append('proof_file', uploadedFile);
    await paymentsAPI.submitProof(formData);
    setPaymentSubmitted(true);
    showToast('Payment proof submitted! Pending admin approval.');
  } catch (e) {
    showToast('Submission failed. Please try again.', 'error');
  }
  };

 return (
 <div className="dashboard-layout" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)' }}>
 {toast && (
 <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-lg border border-gray-200 bg-brand-bg #0c0c0c] flex items-center gap-3 text-sm font-bold text-gray-900 ">
 {toast.type === 'success' ? <CheckCircle size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-[#D95C4A]" />}
 {toast.message}
 </motion.div>
 )}

 <aside className="dashboard-sidebar" style={{ background: 'linear-gradient(180deg, #1E1B4B 0%, #0F0A3A 100%)' }}>
 <div className="px-4 pt-4 pb-3 shrink-0">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3A3992] to-[#5A2DA8] flex items-center justify-center">
 <GraduationCap size={16} className="text-white" />
 </div>
 <div>
 <h3 className="text-gray-900 font-black text-xs tracking-tight">Student Portal</h3>
 <p className="text-gray-500 text-[9px] font-medium">Elevate Skill</p>
 </div>
 </div>
 </div>
 <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
 {sidebarItems.map(item => (
 <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-gray-100 text-gray-900 ' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 '}`}>
 <span className={activeTab === item.id ? 'text-[#3A3992]' : ''}>{item.icon}</span>
 {item.label}
 </button>
 ))}
 </nav>
 <div className="px-3 pb-4 pt-2 shrink-0">
 <button onClick={() => { logout(); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#D95C4A] hover:bg-[#FEF0EE] transition-all"><LogOut size={18} /> Logout</button>
 </div>
 </aside>

  <div className="dashboard-main bg-gray-50">
  <header className="dashboard-header bg-brand-bg/80 backdrop-blur-xl border-b border-gray-200 px-6 py-3 flex items-center justify-between">
  <div className="flex items-center gap-3">
  <span className="text-xs font-bold text-gray-500 capitalize tracking-wide">{activeTab}</span>
  </div>
  <div className="flex items-center gap-3">
  <button className="relative p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all">
 <Bell size={16} />
 <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#3A3992] rounded-full" />
 </button>
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A3992] to-[#5A2DA8] flex items-center justify-center text-white font-black text-[10px]">U</div>
 </div>
 </header>

 <main className="dashboard-content p-4 lg:p-6">
 <div className="max-w-[1400px] mx-auto">
 {activeTab === 'home' && (
 <div className="space-y-5">
 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <div className="flex items-center gap-3 mb-4">
 <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3A3992] to-[#5A2DA8] flex items-center justify-center text-white font-black text-base">D</div>
 <div>
 <h2 className="text-base font-black text-gray-900 ">Welcome back, {user?.full_name || 'Student'}!</h2>
 <p className="text-xs text-gray-500 ">dawit@example.com</p>
 </div>
 </div>
 <div className="grid grid-cols-3 gap-3">
 {[
 { label: 'Enrolled Courses', value: enrolledCourses.length, icon: <BookOpen size={16} />, color: 'text-[#5A2DA8]' },
 { label: 'Lessons Completed', value: enrolledCourses.reduce((a, c) => a + c.completed, 0), icon: <CheckCircle size={16} />, color: 'text-green-500' },
 { label: 'Overall Progress', value: `${Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / Math.max(enrolledCourses.length, 1))}%`, icon: <TrendingUp size={16} />, color: 'text-[#3A3992]' }
 ].map((stat, i) => (
 <div key={i} className="p-3 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
 <div className={`${stat.color} mb-1`}>{stat.icon}</div>
 <p className="text-lg font-black text-gray-900 ">{stat.value}</p>
 <p className="text-[10px] text-gray-500 font-medium">{stat.label}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
 <BarChart3 size={14} className="text-[#5A2DA8]" /> Quick Overview
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {[
 { label: 'My Courses', icon: <BookOpen size={16} />, desc: `${enrolledCourses.length} enrolled`, tab: 'courses', color: 'from-[#5A2DA8]/20 to-[#EE8433]/20 text-[#5A2DA8]' },
 { label: 'Payment', icon: <Upload size={16} />, desc: paymentSubmitted ? 'Approved' : 'Pending', tab: 'payment', color: 'from-[#3A3992]/20 to-[#3A3992]/20 text-[#3A3992]' },
 { label: 'Support', icon: <MessageCircle size={16} />, desc: 'Get help', tab: 'support', color: 'from-green-500/20 to-emerald-500/20 text-green-600 ' },
 { label: 'Settings', icon: <Settings size={16} />, desc: 'Manage account', tab: 'settings', color: 'from-[#5A2DA8]/20 to-pink-500/20 text-[#5A2DA8] ' },
 ].map((item, i) => (
 <button key={i} onClick={() => setActiveTab(item.tab)} className="p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all text-left group shadow-sm">
 <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${item.color} mb-2`}>{item.icon}</div>
 <p className="text-xs font-bold text-gray-900 ">{item.label}</p>
 <p className="text-[10px] text-gray-500 flex items-center gap-1">{item.desc} <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" /></p>
 </button>
 ))}
 </div>
 </div>

 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
 <Clock size={14} className="text-[#3A3992]" /> Recent Activity
 </h3>
 <div className="space-y-2">
 {[
 { action: 'Started lesson "API Integration"', course: 'Full-Stack Web Development', time: '2 hours ago' },
 { action: 'Completed 3 lessons', course: 'UI/UX Design Mastery', time: 'Yesterday' },
 { action: 'Submitted payment proof', course: '', time: '2 days ago' },
 ].map((act, i) => (
 <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-200 ">
 <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3A3992]/20 to-[#5A2DA8]/20 flex items-center justify-center shrink-0">
 <Clock size={12} className="text-[#5A2DA8]" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-semibold text-gray-900 truncate">{act.action}</p>
 <p className="text-[10px] text-gray-500 ">{act.course && `${act.course} · `}{act.time}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {activeTab === 'courses' && (
 <div className="space-y-5">
 <div>
 <h2 className="text-xl font-black text-gray-900 tracking-tight">My Courses</h2>
 <p className="text-xs text-gray-500 mt-0.5">Continue learning where you left off</p>
 </div>
 {enrolledCourses.length === 0 ? (
 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-10 text-center shadow-sm">
 <BookOpen size={36} className="mx-auto text-gray-300 mb-2" />
 <h3 className="text-base font-bold text-gray-500 mb-1">No courses yet</h3>
 <p className="text-xs text-gray-400 ">Enrolled courses will appear here after registration.</p>
 </div>
 ) : enrolledCourses.map((course, i) => (
 <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-gray-200 bg-gray-100 overflow-hidden hover:border-gray-300 transition-all shadow-sm group">
 <div className="flex flex-col md:flex-row">
 <div className="md:w-44 h-28 md:h-auto overflow-hidden shrink-0">
 <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 </div>
 <div className="flex-1 p-4 flex flex-col justify-between">
 <div>
 <h3 className="text-sm font-bold text-gray-900 mb-0.5">{course.title}</h3>
 <p className="text-xs text-gray-500 mb-2">by {course.instructor}</p>
 <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
 <span>{course.completed}/{course.lessons} lessons</span>
 <span className="text-[#5A2DA8] font-bold">{course.progress}% complete</span>
 </div>
 <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
 <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-gradient-to-r from-[#3A3992] to-[#5A2DA8] rounded-full" />
 </div>
 <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
 <Play size={11} className="text-[#3A3992]" /> Next: {course.nextLesson}
 </div>
 </div>
 <button className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2DA8] text-white font-bold text-[10px] rounded-lg hover:brightness-110 transition-all w-fit shadow-sm">
 <Play size={12} /> Continue
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 )}

  {activeTab === 'payment' && (
  <div className="space-y-5">
  <div>
  <h2 className="text-xl font-black text-gray-900 tracking-tight">Payment Proof</h2>
  <p className="text-xs text-gray-500 mt-0.5">Submit your payment for admin verification</p>
  </div>
  <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
  {paymentSubmitted ? (
  <div className="text-center py-6">
  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 border border-green-200 mb-3">
  <CheckCircle size={24} className="text-green-600 " />
  </div>
  <h4 className="font-bold text-gray-900 text-sm mb-1">Payment Submitted</h4>
  <p className="text-xs text-gray-500 ">Pending admin approval. You'll be notified once activated.</p>
  <button onClick={() => setPaymentSubmitted(false)} className="mt-3 text-xs text-[#5A2DA8] font-semibold hover:underline">Submit another</button>
  </div>
  ) : (
  <div className="space-y-3">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
  <div className="relative">
  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input value={paymentForm.full_name} onChange={e => setPaymentForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Full Name" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
  </div>
  <div className="relative">
  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input value={paymentForm.email} onChange={e => setPaymentForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
  </div>
  <div className="relative">
  <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
  <input value={paymentForm.phone} onChange={e => setPaymentForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
  </div>
  </div>
  <div className="relative">
  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Amount Paid (ETB)</span>
  <div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 ">Birr</span>
  <input value={paymentForm.amount} onChange={e => setPaymentForm(p => ({ ...p, amount: e.target.value }))} type="number" placeholder="0.00" className="w-full pl-12 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
  </div>
  </div>
  <div className="relative">
  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Comment <span className="text-gray-500 font-normal normal-case tracking-normal">(optional)</span></span>
  <textarea value={paymentForm.comment} onChange={e => setPaymentForm(p => ({ ...p, comment: e.target.value }))} rows={2} placeholder="Any additional notes..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400 resize-none" />
  </div>
  <div className="flex items-center gap-2 pt-1">
  <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#3A3992]/50 transition-all bg-gray-50 group">
  <Upload size={16} className="text-gray-300 group-hover:text-[#3A3992] transition-colors" />
  <span className="text-xs text-gray-400 group-hover:text-gray-600 ">{uploadedFile ? uploadedFile.name : 'Upload proof (PDF, image)'}</span>
  <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => { const f = e.target.files[0]; if (f) { if (f.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB', 'error'); return; } setUploadedFile(f); showToast('File uploaded'); } }} />
  </label>
  <button onClick={handlePaymentSubmit} className="px-5 py-2 bg-[#3A3992] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all uppercase tracking-wider whitespace-nowrap shadow-sm">
  Submit
  </button>
  </div>
  </div>
  )}
  </div>

  {/* Payment History */}
  {paymentHistory.length > 0 && (
  <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
  <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
  <FileText size={13} className="text-[#5A2DA8]" /> Payment History ({paymentHistory.length})
  </h3>
  <div className="space-y-2">
  {paymentHistory.map(p => (
  <button
  key={p.id}
  onClick={() => setViewingPayment(p)}
  className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#5A2DA8]/30 hover:bg-gray-100 transition-all text-left cursor-pointer group"
  >
  <div className="flex items-center gap-3">
  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${(p.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-600' : (p.status || '').toLowerCase() === 'rejected' ? 'bg-[#FDE0DC] text-[#D95C4A]' : 'bg-amber-100 text-amber-600'}`}>
  {(p.status || '').toLowerCase() === 'approved' ? <CheckCircle size={15} /> : (p.status || '').toLowerCase() === 'rejected' ? <AlertTriangle size={15} /> : <Clock size={15} />}
  </div>
  <div className="text-left">
  <p className="text-xs font-semibold text-gray-900 capitalize">{p.status || 'Pending'}</p>
  <p className="text-[10px] text-gray-500">{p.course_title || 'Course Payment'}</p>
  <p className="text-[9px] text-gray-400 mt-0.5">{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : ''}</p>
  </div>
  </div>
  <div className="flex items-center gap-2">
  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${(p.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-600' : (p.status || '').toLowerCase() === 'rejected' ? 'bg-[#FDE0DC] text-[#D95C4A]' : 'bg-amber-100 text-amber-600'}`}>
  {p.status || 'Pending'}
  </span>
  <Eye size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
  </button>
  ))}
  </div>
  </div>
  )}
  </div>
  )}

 {activeTab === 'support' && (
 <div className="space-y-5">
 <div>
 <h2 className="text-xl font-black text-gray-900 tracking-tight">Support</h2>
 <p className="text-xs text-gray-500 mt-0.5">Get help from our support team</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 {[
 { icon: <Headphones size={18} />, label: 'Live Chat', desc: 'Chat with our team', color: 'from-green-500/20 to-emerald-500/20 text-green-600 ' },
 { icon: <Mail size={18} />, label: 'Email Us', desc: 'support@elevate.com', color: 'from-[#EE8433]/20 to-[#EE8433]/20 text-[#EE8433] ' },
 { icon: <Clock size={18} />, label: 'Response Time', desc: 'Within 24 hours', color: 'from-[#3A3992]/20 to-[#3A3992]/20 text-[#3A3992] ' },
 ].map((item, i) => (
 <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`p-4 rounded-xl bg-gradient-to-br ${item.color} border border-gray-200 text-center shadow-sm`}>
 <div className="flex justify-center mb-2">{item.icon}</div>
 <h4 className="font-bold text-gray-900 text-xs">{item.label}</h4>
 <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
 </motion.div>
 ))}
 </div>

 {showTicketSuccess ? (
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-green-200 bg-brand-bg #0c0c0c] p-6 text-center shadow-sm">
 <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
 <h3 className="text-sm font-bold text-gray-900 mb-1">Ticket Submitted</h3>
 <p className="text-xs text-gray-500 mb-3">We'll get back to you within 24 hours.</p>
 <button onClick={() => { setShowTicketSuccess(false); setTicketForm({ subject: '', message: '', priority: 'Normal' }); }} className="px-5 py-2 bg-[#5A2DA8] text-white font-bold text-[10px] rounded-lg hover:brightness-110 transition-all shadow-sm">Submit Another</button>
 </motion.div>
 ) : (
 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider"><Send size={13} className="text-[#5A2DA8]" /> Submit a Ticket</h3>
 <div className="space-y-3">
 <input value={ticketForm.subject} onChange={e => setTicketForm(p => ({ ...p, subject: e.target.value }))} placeholder="What's the issue?" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#5A2DA8]/50 placeholder:text-gray-400" />
 <div className="flex gap-1.5">
 {['Low', 'Normal', 'High'].map(p => (
 <button key={p} onClick={() => setTicketForm(t => ({ ...t, priority: p }))} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${ticketForm.priority === p ? 'bg-[#5A2DA8] text-white border-[#5A2DA8]' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-[#5A2DA8]/30'}`}>{p}</button>
 ))}
 </div>
 <textarea value={ticketForm.message} onChange={e => setTicketForm(p => ({ ...p, message: e.target.value }))} rows={2} placeholder="Describe your issue in detail..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#5A2DA8]/50 placeholder:text-gray-400 resize-none" />
 <button onClick={() => { if (!ticketForm.subject || !ticketForm.message) { showToast('Please fill in all fields', 'error'); return; } setShowTicketSuccess(true); showToast('Ticket submitted!'); }} className="px-5 py-2 bg-[#5A2DA8] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"><Send size={12} /> Submit Ticket</button>
 </div>
 </div>
 )}


 </div>
 )}

 {activeTab === 'settings' && (
 <div className="space-y-5">
 <div>
 <h2 className="text-xl font-black text-gray-900 tracking-tight">Settings</h2>
 <p className="text-xs text-gray-500 mt-0.5">Manage your account preferences</p>
 </div>

 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider"><User size={13} className="text-[#5A2DA8]" /> Profile</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div>
 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Full Name</label>
 <input value={profile.full_name} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#5A2DA8]/50" />
 </div>
 <div>
 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
 <input value={profile.email} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#5A2DA8]/50" />
 </div>
 <div>
 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Phone</label>
 <input value={profile.phone} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#5A2DA8]/50" />
 </div>
 <div>
 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Bio</label>
 <textarea rows={1} value={profile.bio} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#5A2DA8]/50 resize-none" />
 </div>
 </div>
  <button onClick={async () => { try { await authAPI.updateProfile({ full_name: profile.full_name, email: profile.email, phone_number: profile.phone, bio: profile.bio }); showToast('Profile updated!'); } catch (e) { showToast('Update failed', 'error'); } }} className="mt-3 px-5 py-2 bg-[#5A2DA8] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"><Save size={12} /> Save Changes</button>
 </div>

 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider"><Lock size={13} className="text-[#3A3992]" /> Password</h3>
 <div className="space-y-3">
 <input value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} type="password" placeholder="Current Password" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <input value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} type="password" placeholder="New Password" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
 <input value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} type="password" placeholder="Confirm Password" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs focus:outline-none focus:border-[#3A3992]/50 placeholder:text-gray-400" />
 </div>
  <button onClick={async () => { if (passwordForm.newPass !== passwordForm.confirm) { showToast('Passwords do not match', 'error'); return; } if (passwordForm.newPass.length < 6) { showToast('Password too short', 'error'); return; } try { await authAPI.changePassword({ old_password: passwordForm.current, new_password: passwordForm.newPass }); showToast('Password updated!'); setPasswordForm({ current: '', newPass: '', confirm: '' }); } catch (e) { showToast('Password update failed', 'error'); } }} className="px-5 py-2 bg-[#3A3992] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all shadow-sm">Update Password</button>
 </div>
 </div>

 <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
 <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider"><Bell size={13} className="text-[#5A2DA8]" /> Notifications</h3>
 <div className="space-y-2">
 {[
 { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
 { key: 'sms', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
 { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
 ].map(n => (
 <label key={n.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:border-[#5A2DA8]/30 transition-all">
 <div>
 <p className="text-xs font-semibold text-gray-900 ">{n.label}</p>
 <p className="text-[10px] text-gray-500 ">{n.desc}</p>
 </div>
 <div onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))} className={`relative w-9 h-[18px] rounded-full transition-all cursor-pointer ${notifications[n.key] ? 'bg-[#5A2DA8]' : 'bg-gray-300 '}`}>
 <div className={`absolute top-0.5 w-[13px] h-[13px] rounded-full bg-brand-bg shadow transition-all ${notifications[n.key] ? 'left-[18px]' : 'left-0.5'}`} />
 </div>
 </label>
 ))}
 </div>
 </div>

  <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 shadow-sm">
  <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5 uppercase tracking-wider"><CreditCard size={13} className="text-green-600 " /> Payment History</h3>
  {paymentHistory.length === 0 ? (
  <div className="text-center py-6">
  <CreditCard size={28} className="mx-auto text-gray-300 mb-2" />
  <p className="text-xs text-gray-500 ">No payment history yet</p>
  </div>
  ) : (
  <div className="space-y-2">
  {paymentHistory.map(p => (
  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
  <div>
  <p className="text-xs font-semibold text-gray-900 capitalize">{p.status || 'Pending'}</p>
  <p className="text-[10px] text-gray-500">{p.course_title || 'Course Payment'}</p>
  </div>
  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${(p.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-600' : (p.status || '').toLowerCase() === 'rejected' ? 'bg-[#FDE0DC] text-[#D95C4A]' : 'bg-amber-100 text-amber-600'}`}>
  {p.status || 'Pending'}
  </span>
  </div>
  ))}
  </div>
  )}
  </div>
 </div>
 )}
  </div>
  </main>
  </div>

  {/* Payment Detail Modal */}
  {viewingPayment && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewingPayment(null)}>
  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl border border-gray-200 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
  <div className="flex items-center justify-between p-5 border-b border-gray-200">
  <h3 className="text-base font-black text-gray-900">Payment Details</h3>
  <button onClick={() => setViewingPayment(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-all"><X size={18} /></button>
  </div>
  <div className="p-5 space-y-4">
  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#EE8433] to-[#5A2DA8] flex items-center justify-center text-white font-black text-lg">
  {(viewingPayment.full_name || 'U')[0]}
  </div>
  <div className="flex-1">
  <h4 className="font-bold text-gray-900">{viewingPayment.full_name}</h4>
  <p className="text-xs text-gray-500">{viewingPayment.email}</p>
  </div>
  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
  (viewingPayment.status || '').toLowerCase() === 'approved' ? 'bg-green-100 text-green-700' :
  (viewingPayment.status || '').toLowerCase() === 'rejected' ? 'bg-[#FDE0DC] text-[#D95C4A]' :
  'bg-amber-100 text-amber-700'
  }`}>{viewingPayment.status || 'Pending'}</span>
  </div>
  <div className="grid grid-cols-2 gap-3 text-sm">
  {[
  { label: 'Phone', value: viewingPayment.phone },
  { label: 'Email', value: viewingPayment.email },
  { label: 'Course', value: viewingPayment.course_title },
  { label: 'Date', value: viewingPayment.submitted_at ? new Date(viewingPayment.submitted_at).toLocaleDateString() : '-' },
  ].map((item, i) => (
  <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
  <p className="text-gray-900 font-semibold text-xs">{item.value}</p>
  </div>
  ))}
  </div>
  {viewingPayment.proof_file && (
  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Eye size={12} /> Payment Proof</p>
  {getMediaUrl(viewingPayment.proof_file).match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
  <div className="relative group cursor-pointer" onClick={() => setLightboxImage(getMediaUrl(viewingPayment.proof_file))}>
  <img src={getMediaUrl(viewingPayment.proof_file)} alt="Payment Proof" className="w-full max-h-48 object-contain rounded-lg group-hover:brightness-75 transition-all" />
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
  <span className="px-3 py-1.5 bg-black/60 text-white text-[10px] font-bold rounded-lg">Click to enlarge</span>
  </div>
  </div>
  ) : (
  <div className="flex items-center gap-2">
  <a href={getMediaUrl(viewingPayment.proof_file)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#EE8433]/10 text-[#EE8433] font-bold text-xs rounded-xl hover:bg-[#EE8433]/20 transition-all">
  <FileText size={16} /> View File
  </a>
  <a href={getMediaUrl(viewingPayment.proof_file)} download className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"><Download size={16} /></a>
  </div>
  )}
  </div>
  )}
  </div>
  </motion.div>
  </motion.div>
  )}

  {/* Lightbox */}
  {lightboxImage && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightboxImage(null)}>
  <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"><X size={24} /></button>
  <a href={lightboxImage} download className="absolute top-4 right-16 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"><Download size={20} /></a>
  <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} src={lightboxImage} alt="Full size" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
  </motion.div>
  )}
  </div>
  );
}
