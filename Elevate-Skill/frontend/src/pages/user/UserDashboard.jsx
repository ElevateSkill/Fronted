import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock,
  CheckCircle, Upload, FileText,
  GraduationCap, ShieldCheck, Sparkles, LogOut,
  Menu, X, Bell, Home, BookOpen, MessageCircle, Settings,
  Sun, Moon, AlertTriangle, Clock, Play,
  ChevronDown, Send, Headphones, HelpCircle,
  Save, CreditCard, TrendingUp, BarChart3, ArrowRight
} from 'lucide-react';

const genId = () => Date.now() + Math.random();

const sidebarItems = [
  { id: 'home', label: 'Home', icon: <Home size={18} /> },
  { id: 'courses', label: 'My Courses', icon: <BookOpen size={18} /> },
  { id: 'payment', label: 'Payment Proof', icon: <Upload size={18} /> },
  { id: 'support', label: 'Support', icon: <MessageCircle size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const enrolledCourses = [
  { id: genId(), title: 'Full-Stack Web Development', progress: 65, instructor: 'Lidetu Tesfaye', lessons: 48, completed: 31, nextLesson: 'API Integration with Node.js', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
  { id: genId(), title: 'UI/UX Design Mastery', progress: 30, instructor: 'Meron Tadesse', lessons: 36, completed: 11, nextLesson: 'Color Theory & Typography', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400' },
];

const faqData = [
  { q: 'How do I reset my password?', a: 'Go to Settings and click "Change Password". Follow the instructions sent to your email.' },
  { q: 'How do I access my courses?', a: 'Your enrolled courses appear under "My Courses" in the sidebar. Click any course to continue learning.' },
  { q: 'How do I get my certificate?', a: 'Certificates are awarded upon completing all lessons and the final project in your course.' },
  { q: 'How do I contact support?', a: 'Use the Support tab to submit a ticket. Our team typically responds within 24 hours.' },
];

export default function UserDashboard() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('user-theme') !== 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('user-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'Normal' });
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);

  const [profile] = useState({
    full_name: 'Dawit Mekonnen', email: 'dawit@example.com', phone: '+251 911 234 567', bio: 'Full-stack developer passionate about learning.'
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });

  const [paymentForm, setPaymentForm] = useState({ full_name: '', email: '', phone: '', amount: '', comment: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const handlePaymentSubmit = () => {
    if (!paymentForm.full_name || !paymentForm.email || !paymentForm.phone || !paymentForm.amount) { showToast('Please fill in all required fields', 'error'); return; }
    if (!uploadedFile) { showToast('Please upload payment proof', 'error'); return; }
    setPaymentSubmitted(true);
    showToast('Payment proof submitted! Pending admin approval.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex">
      {toast && (
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0c0c] flex items-center gap-3 text-sm font-bold text-gray-900 dark:text-white">
          {toast.type === 'success' ? <CheckCircle size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-red-500" />}
          {toast.message}
        </motion.div>
      )}

      <motion.aside
        initial={{ width: sidebarOpen ? 240 : 0 }}
        animate={{ width: sidebarOpen ? 240 : 0 }}
        className={`${sidebarOpen ? 'w-[240px]' : 'w-0'} fixed lg:relative z-40 h-screen bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-white/10 flex flex-col overflow-hidden transition-all shrink-0`}
      >
        <div className="px-4 pt-4 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f89f29] to-[#15c8fb] flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-black text-xs tracking-tight">Student Portal</h3>
              <p className="text-gray-500 dark:text-white/30 text-[9px] font-medium">Elevate Skill</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-hidden">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === item.id ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}>
              <span className={activeTab === item.id ? 'text-[#f89f29]' : ''}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-4 pt-2 shrink-0">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400/60 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all"><LogOut size={18} /> Logout</button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#050505]">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="h-5 w-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs font-medium text-gray-500 dark:text-white/40 capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="relative p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#f89f29] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f89f29] to-[#15c8fb] flex items-center justify-center text-white font-black text-[10px]">U</div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-5 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#f89f29] to-[#15c8fb] flex items-center justify-center text-white font-black text-base">D</div>
                  <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-white">Welcome back, Dawit!</h2>
                    <p className="text-xs text-gray-500 dark:text-white/40">dawit@example.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Enrolled Courses', value: enrolledCourses.length, icon: <BookOpen size={16} />, color: 'text-[#15c8fb]' },
                    { label: 'Lessons Completed', value: enrolledCourses.reduce((a, c) => a + c.completed, 0), icon: <CheckCircle size={16} />, color: 'text-green-500' },
                    { label: 'Overall Progress', value: `${Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / Math.max(enrolledCourses.length, 1))}%`, icon: <TrendingUp size={16} />, color: 'text-[#f89f29]' }
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shadow-sm">
                      <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                      <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-[10px] text-gray-500 dark:text-white/40 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <BarChart3 size={14} className="text-[#15c8fb]" /> Quick Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'My Courses', icon: <BookOpen size={16} />, desc: `${enrolledCourses.length} enrolled`, tab: 'courses', color: 'from-[#15c8fb]/20 to-blue-500/20 text-[#15c8fb]' },
                    { label: 'Payment', icon: <Upload size={16} />, desc: paymentSubmitted ? 'Approved' : 'Pending', tab: 'payment', color: 'from-[#f89f29]/20 to-amber-500/20 text-[#f89f29]' },
                    { label: 'Support', icon: <MessageCircle size={16} />, desc: 'Get help', tab: 'support', color: 'from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400' },
                    { label: 'Settings', icon: <Settings size={16} />, desc: 'Manage account', tab: 'settings', color: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400' },
                  ].map((item, i) => (
                    <button key={i} onClick={() => setActiveTab(item.tab)} className="p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-left group shadow-sm">
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${item.color} mb-2`}>{item.icon}</div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-500 dark:text-white/40 flex items-center gap-1">{item.desc} <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" /></p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock size={14} className="text-[#f89f29]" /> Recent Activity
                </h3>
                <div className="space-y-2">
                  {[
                    { action: 'Started lesson "API Integration"', course: 'Full-Stack Web Development', time: '2 hours ago' },
                    { action: 'Completed 3 lessons', course: 'UI/UX Design Mastery', time: 'Yesterday' },
                    { action: 'Submitted payment proof', course: '', time: '2 days ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f89f29]/20 to-[#15c8fb]/20 flex items-center justify-center shrink-0">
                        <Clock size={12} className="text-[#15c8fb]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{act.action}</p>
                        <p className="text-[10px] text-gray-500 dark:text-white/40">{act.course && `${act.course} · `}{act.time}</p>
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
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">My Courses</h2>
                <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Continue learning where you left off</p>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-10 text-center shadow-sm">
                  <BookOpen size={36} className="mx-auto text-gray-300 dark:text-white/10 mb-2" />
                  <h3 className="text-base font-bold text-gray-500 dark:text-white/60 mb-1">No courses yet</h3>
                  <p className="text-xs text-gray-400 dark:text-white/30">Enrolled courses will appear here after registration.</p>
                </div>
              ) : enrolledCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 overflow-hidden hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm group">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-44 h-28 md:h-auto overflow-hidden shrink-0">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{course.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-white/40 mb-2">by {course.instructor}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40 mb-2">
                          <span>{course.completed}/{course.lessons} lessons</span>
                          <span className="text-[#15c8fb] font-bold">{course.progress}% complete</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-gradient-to-r from-[#f89f29] to-[#15c8fb] rounded-full" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/40 mb-2">
                          <Play size={11} className="text-[#f89f29]" /> Next: {course.nextLesson}
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-[#15c8fb] text-white font-bold text-[10px] rounded-lg hover:brightness-110 transition-all w-fit shadow-sm">
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
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Payment Proof</h2>
                <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Submit your payment for admin verification</p>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                {paymentSubmitted ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 mb-3">
                      <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Payment Submitted</h4>
                    <p className="text-xs text-gray-500 dark:text-white/40">Pending admin approval. You'll be notified once activated.</p>
                    <button onClick={() => setPaymentSubmitted(false)} className="mt-3 text-xs text-[#15c8fb] font-semibold hover:underline">Submit another</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="relative">
                        <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={paymentForm.full_name} onChange={e => setPaymentForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Full Name" className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                      </div>
                      <div className="relative">
                        <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={paymentForm.email} onChange={e => setPaymentForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                      </div>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={paymentForm.phone} onChange={e => setPaymentForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div className="relative">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider block mb-1">Amount Paid (ETB)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 dark:text-white/30">Birr</span>
                        <input value={paymentForm.amount} onChange={e => setPaymentForm(p => ({ ...p, amount: e.target.value }))} type="number" placeholder="0.00" className="w-full pl-12 pr-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                      </div>
                    </div>
                    <div className="relative">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider block mb-1">Comment <span className="text-gray-500 dark:text-white/20 font-normal normal-case tracking-normal">(optional)</span></span>
                      <textarea value={paymentForm.comment} onChange={e => setPaymentForm(p => ({ ...p, comment: e.target.value }))} rows={2} placeholder="Any additional notes..." className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400 resize-none" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="flex-1 flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg cursor-pointer hover:border-[#f89f29]/50 transition-all bg-gray-50 dark:bg-white/5 group">
                        <Upload size={16} className="text-gray-300 dark:text-white/20 group-hover:text-[#f89f29] transition-colors" />
                        <span className="text-xs text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/60">{uploadedFile ? uploadedFile.name : 'Upload proof (PDF, image)'}</span>
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={e => { const f = e.target.files[0]; if (f) { if (f.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB', 'error'); return; } setUploadedFile(f); showToast('File uploaded'); } }} />
                      </label>
                      <button onClick={handlePaymentSubmit} className="px-5 py-2 bg-[#f89f29] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all uppercase tracking-wider whitespace-nowrap shadow-sm">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Support</h2>
                <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Get help from our support team</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { icon: <Headphones size={18} />, label: 'Live Chat', desc: 'Chat with our team', color: 'from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400' },
                  { icon: <Mail size={18} />, label: 'Email Us', desc: 'support@elevate.com', color: 'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400' },
                  { icon: <Clock size={18} />, label: 'Response Time', desc: 'Within 24 hours', color: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400' },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`p-4 rounded-xl bg-gradient-to-br ${item.color} border border-gray-200 dark:border-white/10 text-center shadow-sm`}>
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs">{item.label}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-white/40 mt-0.5">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {showTicketSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-green-200 dark:border-green-500/20 bg-white dark:bg-[#0c0c0c] p-6 text-center shadow-sm">
                  <CheckCircle size={32} className="mx-auto text-green-600 dark:text-green-400 mb-3" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Ticket Submitted</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40 mb-3">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setShowTicketSuccess(false); setTicketForm({ subject: '', message: '', priority: 'Normal' }); }} className="px-5 py-2 bg-[#15c8fb] text-white font-bold text-[10px] rounded-lg hover:brightness-110 transition-all shadow-sm">Submit Another</button>
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider"><Send size={13} className="text-[#15c8fb]" /> Submit a Ticket</h3>
                  <div className="space-y-3">
                    <input value={ticketForm.subject} onChange={e => setTicketForm(p => ({ ...p, subject: e.target.value }))} placeholder="What's the issue?" className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#15c8fb]/50 placeholder:text-gray-400" />
                    <div className="flex gap-1.5">
                      {['Low', 'Normal', 'High'].map(p => (
                        <button key={p} onClick={() => setTicketForm(t => ({ ...t, priority: p }))} className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${ticketForm.priority === p ? 'bg-[#15c8fb] text-white border-[#15c8fb]' : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border-gray-200 dark:border-white/10 hover:border-[#15c8fb]/30'}`}>{p}</button>
                      ))}
                    </div>
                    <textarea value={ticketForm.message} onChange={e => setTicketForm(p => ({ ...p, message: e.target.value }))} rows={2} placeholder="Describe your issue in detail..." className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#15c8fb]/50 placeholder:text-gray-400 resize-none" />
                    <button onClick={() => { if (!ticketForm.subject || !ticketForm.message) { showToast('Please fill in all fields', 'error'); return; } setShowTicketSuccess(true); showToast('Ticket submitted!'); }} className="px-5 py-2 bg-[#15c8fb] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"><Send size={12} /> Submit Ticket</button>
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider"><HelpCircle size={13} className="text-[#f89f29]" /> FAQ</h3>
                <div className="space-y-1.5">
                  {faqData.map((faq, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                      <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                        <ChevronDown size={12} className={`text-gray-400 transition-transform shrink-0 ${faqOpen === i ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {faqOpen === i && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <p className="px-3 pb-3 text-xs text-gray-500 dark:text-white/40">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Settings</h2>
                <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Manage your account preferences</p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider"><User size={13} className="text-[#15c8fb]" /> Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1 block">Full Name</label>
                    <input value={profile.full_name} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#15c8fb]/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1 block">Email</label>
                    <input value={profile.email} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#15c8fb]/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1 block">Phone</label>
                    <input value={profile.phone} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#15c8fb]/50" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-1 block">Bio</label>
                    <textarea rows={1} value={profile.bio} className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#15c8fb]/50 resize-none" />
                  </div>
                </div>
                <button onClick={() => showToast('Profile updated!')} className="mt-3 px-5 py-2 bg-[#15c8fb] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"><Save size={12} /> Save Changes</button>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider"><Lock size={13} className="text-[#f89f29]" /> Password</h3>
                <div className="space-y-3">
                  <input value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} type="password" placeholder="Current Password" className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} type="password" placeholder="New Password" className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                    <input value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} type="password" placeholder="Confirm Password" className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#f89f29]/50 placeholder:text-gray-400" />
                  </div>
                  <button onClick={() => { if (passwordForm.newPass !== passwordForm.confirm) { showToast('Passwords do not match', 'error'); return; } if (passwordForm.newPass.length < 6) { showToast('Password too short', 'error'); return; } showToast('Password updated!'); setPasswordForm({ current: '', newPass: '', confirm: '' }); }} className="px-5 py-2 bg-[#f89f29] text-white font-black text-[10px] rounded-lg hover:brightness-110 transition-all shadow-sm">Update Password</button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider"><Bell size={13} className="text-[#15c8fb]" /> Notifications</h3>
                <div className="space-y-2">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
                    { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
                  ].map(n => (
                    <label key={n.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#15c8fb]/30 transition-all">
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{n.label}</p>
                        <p className="text-[10px] text-gray-500 dark:text-white/40">{n.desc}</p>
                      </div>
                      <div onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))} className={`relative w-9 h-[18px] rounded-full transition-all cursor-pointer ${notifications[n.key] ? 'bg-[#15c8fb]' : 'bg-gray-300 dark:bg-white/20'}`}>
                        <div className={`absolute top-0.5 w-[13px] h-[13px] rounded-full bg-white shadow transition-all ${notifications[n.key] ? 'left-[18px]' : 'left-0.5'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/5 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5 uppercase tracking-wider"><CreditCard size={13} className="text-green-600 dark:text-green-400" /> Payment History</h3>
                <div className="text-center py-6">
                  <CreditCard size={28} className="mx-auto text-gray-300 dark:text-white/10 mb-2" />
                  <p className="text-xs text-gray-500 dark:text-white/40">No payment history yet</p>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
