import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, BarChart3, Upload, MessageCircle, Settings, ArrowRight, CheckCircle, CreditCard, AlertTriangle, Megaphone, X } from 'lucide-react';
import { useState } from 'react';

export default function Home({ user, allEnrollments, apiPayments, announcements, onNavigate }) {
  const approvedPayments = apiPayments.filter(p => p.status === 'approved');
  const pendingPayments = apiPayments.filter(p => p.status === 'pending');
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState([]);

  const visibleAnnouncements = (announcements || []).filter(a => a.is_published && !dismissedAnnouncements.includes(a.id));

  return (
    <div className="space-y-5">
      {visibleAnnouncements.length > 0 && (
        <div className="space-y-2">
          {visibleAnnouncements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
              className="rounded-2xl border-2 border-brand-orange/30 bg-gradient-to-r from-brand-orange/[0.06] to-brand-card p-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange" />
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-brand-orange/20 shrink-0">
                  <Megaphone size={16} className="text-brand-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-brand-text mb-0.5">{a.title}</h4>
                  <p className="text-xs text-brand-text/80 font-medium leading-relaxed">{a.body || a.content}</p>
                  {a.created_by && (
                    <p className="text-[10px] text-brand-muted mt-1">
                      {a.date} · by {a.created_by?.full_name || a.created_by?.username || 'Admin'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setDismissedAnnouncements(prev => [...prev, a.id])}
                  className="p-1 rounded-lg hover:bg-white/10 text-brand-muted hover:text-brand-red transition-all cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-brand-card border border-brand-border p-6"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-lg">
            {(user?.full_name || 'U')[0]}
          </div>
          <div>
            <h2 className="text-lg font-black text-brand-text">Welcome back, {user?.full_name || 'Student'}!</h2>
            <p className="text-sm text-brand-muted">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Enrolled Courses', value: allEnrollments.length, icon: <BookOpen size={18} />, color: 'text-brand-primary' },
            { label: 'Active Courses', value: allEnrollments.filter(e => e.status === 'active').length, icon: <Play size={18} />, color: 'text-brand-violet' },
            { label: 'Pending', value: pendingPayments.length, icon: <Clock size={18} />, color: 'text-brand-orange' },
            { label: 'Payments Approved', value: approvedPayments.length, icon: <CheckCircle size={18} />, color: 'text-brand-violet' }
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-black/40 border border-brand-border">
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-xl font-black text-brand-text">{stat.value}</p>
              <p className="text-[11px] text-brand-muted font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-brand-card border border-brand-border p-5"
      >
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <BarChart3 size={14} className="text-brand-primary" /> Quick Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'My Courses', icon: <BookOpen size={16} />, desc: `${allEnrollments.length} enrolled`, tab: 'courses' },
            { label: 'Payment', icon: <Upload size={16} />, desc: approvedPayments.length ? `${approvedPayments.length} approved` : pendingPayments.length ? `${pendingPayments.length} pending` : 'Submit payment', tab: 'payment' },
            { label: 'Support', icon: <MessageCircle size={16} />, desc: 'Get help', tab: 'support' },
            { label: 'Settings', icon: <Settings size={16} />, desc: 'Manage account', tab: 'settings' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate(item.tab)}
              className="p-4 rounded-xl border border-brand-border bg-black/40 hover:bg-white/5 hover:border-brand-primary/30 transition-all text-left group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary inline-flex mb-2">{item.icon}</div>
              <p className="text-xs font-bold text-brand-text">{item.label}</p>
              <p className="text-[10px] text-brand-muted flex items-center gap-1">
                {item.desc} <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-brand-card border border-brand-border p-5"
        >
          <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Clock size={14} className="text-brand-orange" /> Recent Activity
          </h3>
          <div className="space-y-2">
            {allEnrollments.length === 0 ? (
              <p className="text-sm text-brand-muted text-center py-4">No activity yet. Enroll in a course to get started!</p>
            ) : allEnrollments.slice(0, 5).map((e, i) => (
              <div key={e.id || i} className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-brand-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-primary/20 flex items-center justify-center shrink-0">
                  {e.status === 'active' ? <Play size={12} className="text-brand-violet" /> :
                   e.status === 'pending' ? <Clock size={12} className="text-brand-orange" /> :
                   <CheckCircle size={12} className="text-brand-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-text truncate">
                    {e.status === 'active' ? 'Started' : e.status === 'completed' ? 'Completed' : 'Enrolled in'}{' '}
                    <span className="text-brand-primary">{e.course?.title || 'a course'}</span>
                  </p>
                  <p className="text-[10px] text-brand-muted capitalize">{e.status} · {new Date(e.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-brand-card border border-brand-border p-5"
        >
          <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <CreditCard size={14} className="text-brand-violet" /> Payment Status
          </h3>
          <div className="space-y-2">
            {apiPayments.length === 0 ? (
              <p className="text-sm text-brand-muted text-center py-4">No payments yet. Submit proof after enrollment.</p>
            ) : apiPayments.slice(0, 5).map((p, i) => (
              <div key={p.id || i} className="flex items-start gap-3 p-3 rounded-lg bg-black/40 border border-brand-border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  p.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                  p.status === 'rejected' ? 'bg-[#D95C4A]/30 text-[#D95C4A]' : 'bg-[#3A3992]/30 text-[#3A3992]'
                }`}>
                  {p.status === 'approved' ? <CheckCircle size={14} /> :
                   p.status === 'rejected' ? <AlertTriangle size={14} /> : <Clock size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-text truncate">{p.course_title}</p>
                  <p className="text-[10px] text-brand-muted capitalize">
                    {p.status} · {new Date(p.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => onNavigate('payment')} className="text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer">
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
