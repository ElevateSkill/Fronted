import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Users, BookOpen, GraduationCap, UserPlus, Clock, CheckCircle, XCircle, Sparkles } from 'lucide-react';
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
      <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 p-6 text-center">
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Could not load dashboard data. The backend may be unavailable.</p>
      </div>
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
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-lg shadow-[#15c8fb]/20">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#15c8fb]">Platform health</p>
              <h2 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">Live admin overview</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">Real-time metrics from the backend. Student data, course stats, enrollment activity, and payment summaries — all served live from the API.</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/payments')} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black ${accent.button}`}>
            <CreditCard size={16} /> Review {pendingPayments} pending
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StaggerContainer className="contents" delay={0.07}>
          <StatCard label="Pending Payments" value={metrics.payments?.pending || 0} icon={Clock} tone="orange" />
          <StatCard label="Approved Payments" value={metrics.payments?.approved || 0} icon={CheckCircle} tone="green" />
          <StatCard label="Rejected Payments" value={metrics.payments?.rejected || 0} icon={XCircle} tone="rose" />
        </StaggerContainer>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-black text-gray-900 dark:text-white">Recent enrollments</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200/50 dark:border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/[0.08] text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <th className="px-4 py-3.5 font-bold">Student</th>
                <th className="px-4 py-3.5 font-bold">Course</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {metrics.recent_enrollments?.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                  <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">{item.student_full_name || item.student_username}</td>
                  <td className="px-4 py-3.5 text-gray-700 dark:text-gray-300">{item.course_title}</td>
                  <td className="px-4 py-3.5"><Badge>{item.status}</Badge></td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">{formatDate(item.enrolled_at)}</td>
                </tr>
              ))}
              {!metrics.recent_enrollments?.length && (
                <tr><td colSpan="4" className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No enrollments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
