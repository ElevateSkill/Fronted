import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Users, BookOpen, GraduationCap, UserPlus, Clock, CheckCircle, XCircle, Sparkles, TrendingUp, ArrowRight, Calendar } from 'lucide-react';
import { api } from '../../../services/api';
import { StatCard, Badge, Skeleton, formatDate, emptyMetrics, accent, StaggerContainer } from '../components/AdminShared';

export default function OverviewSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(emptyMetrics);

  useEffect(() => {
    api.get('/admin/dashboard/')
      .then((res) => setMetrics(res.data || emptyMetrics))
      .catch(() => setMetrics(prev => ({ ...prev, error: true })))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm">
              <Skeleton className="mb-4 h-11 w-11" />
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const pendingPayments = metrics.payments?.pending || 0;
  window.__adminPendingPayments = pendingPayments;

  if (metrics.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 p-8 text-center"
      >
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-500/10 mb-4">
          <XCircle size={28} className="text-rose-500" />
        </div>
        <p className="text-lg font-black text-rose-700 dark:text-rose-300 mb-1">Connection Error</p>
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Could not load dashboard data. The backend may be unavailable.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border border-[#15c8fb]/20 bg-white dark:bg-[#0d1117] p-6 shadow-lg"
      >
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#15c8fb]/10 to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#f89f29]/10 to-transparent blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 admin-grid-bg opacity-20" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-lg shadow-[#15c8fb]/20">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard Overview</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                Real-time metrics from the backend — students, courses, enrollments, and payment summaries all served live from the API.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/payments')}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black shadow-lg ${accent.button}`}
          >
            <CreditCard size={16} />
            Review Payments
            {pendingPayments > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-black text-white">
                {pendingPayments}
              </span>
            )}
          </button>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerContainer className="contents" delay={0.05}>
          <StatCard label="Students" value={metrics.total_students} icon={Users} />
          <StatCard label="Courses" value={metrics.total_courses} icon={BookOpen} tone="orange" />
          <StatCard label="Active Courses" value={metrics.active_courses} icon={GraduationCap} />
          <StatCard label="Enrollments" value={metrics.total_enrollments} icon={UserPlus} tone="green" />
        </StaggerContainer>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StaggerContainer className="contents" delay={0.07}>
          <StatCard label="Pending Payments" value={metrics.payments?.pending || 0} icon={Clock} tone="orange" />
          <StatCard label="Approved Payments" value={metrics.payments?.approved || 0} icon={CheckCircle} tone="green" />
          <StatCard label="Rejected Payments" value={metrics.payments?.rejected || 0} icon={XCircle} tone="rose" />
        </StaggerContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#15c8fb]" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Recent Enrollments</h2>
            </div>
            <button
              onClick={() => navigate('/admin/courses')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#15c8fb] hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/10">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.05] text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3.5 font-bold">Student</th>
                  <th className="px-4 py-3.5 font-bold">Course</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                {(metrics.recent_enrollments || []).slice(0, 6).map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-[10px] font-black text-white shrink-0">
                          {(item.student_full_name || item.student_username || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.student_full_name || item.student_username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">{item.course_title}</td>
                    <td className="px-4 py-3.5"><Badge>{item.status}</Badge></td>
                    <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(item.enrolled_at)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {!metrics.recent_enrollments?.length && (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center text-sm text-gray-400">
                      <GraduationCap size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                      No enrollments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-[#f89f29]" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Quick Summary</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Total Students', value: metrics.total_students, icon: Users, color: 'text-[#15c8fb]', bg: 'bg-[#15c8fb]/10' },
              { label: 'Total Courses', value: metrics.total_courses, icon: BookOpen, color: 'text-[#f89f29]', bg: 'bg-[#f89f29]/10' },
              { label: 'Active Courses', value: metrics.active_courses, icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Enrollments', value: metrics.total_enrollments, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'Pending Payments', value: pendingPayments, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-gray-900/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                    <Icon size={15} className={color} />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
                </div>
                <span className="text-lg font-black text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
