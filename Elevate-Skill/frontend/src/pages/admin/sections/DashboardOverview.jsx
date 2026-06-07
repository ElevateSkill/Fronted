import { motion } from 'framer-motion';
import { Clock, Zap, BookOpen, Newspaper, UserPlus, Megaphone } from 'lucide-react';
import StatsCards from '../../../components/dashboard/StatsCards';
import StatusBadge from '../../../components/dashboard/StatusBadge';

export default function DashboardOverview({ stats, registrations, onNavigate }) {
  const statCards = [
    { label: 'Total Registrations', value: stats.total, icon: <UserPlus size={22} />, tab: 'registrations' },
    { label: 'Pending Review', value: stats.pending, icon: <Clock size={22} />, tab: 'registrations' },
    { label: 'Approved', value: stats.approved, icon: <Zap size={22} />, tab: 'registrations' },
    { label: 'Active Users', value: stats.activeUsers, icon: <UserPlus size={22} />, tab: 'users' },
    { label: 'Courses', value: stats.totalCourses, icon: <BookOpen size={22} />, tab: 'courses' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: <Clock size={22} />, tab: 'payments' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-brand-text tracking-tight">Dashboard</h2>
        <p className="text-sm text-brand-muted font-medium mt-1">Overview of your platform activity</p>
      </div>

      <StatsCards cards={statCards} onCardClick={(card) => onNavigate(card.tab)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-brand-card border border-brand-border p-5"
        >
          <h3 className="text-base font-bold text-brand-text mb-4 flex items-center gap-2">
            <Clock size={18} className="text-brand-orange" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {registrations.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    r.status === 'Approved' ? 'bg-brand-violet' :
                    r.status === 'Rejected' ? 'bg-brand-red' : 'bg-brand-orange'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{r.name} registered</p>
                    <p className="text-[10px] text-brand-muted">{r.date}</p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {registrations.length === 0 && (
              <p className="text-sm text-brand-muted text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-brand-card border border-brand-border p-5"
        >
          <h3 className="text-base font-bold text-brand-text mb-4 flex items-center gap-2">
            <Zap size={18} className="text-brand-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Course', icon: <BookOpen size={16} />, tab: 'courses', color: 'text-brand-primary' },
              { label: 'New Post', icon: <Newspaper size={16} />, tab: 'posts', color: 'text-pink-500' },
              { label: 'New User', icon: <UserPlus size={16} />, tab: 'users', color: 'text-[#7A3FB5]' },
              { label: 'Announcement', icon: <Megaphone size={16} />, tab: 'announcements', color: 'text-brand-orange' },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.tab)}
                className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-brand-border font-bold text-xs hover:bg-white/5 hover:border-brand-primary/30 transition-all cursor-pointer"
              >
                <span className={a.color}>{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
