import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CreditCard, BookOpen, Megaphone, FileText, Tags, Loader } from 'lucide-react';
import { api, unwrapResults, exportToCSV } from '../../../services/api';
import { useToast, ToastMessage, accent, apiError } from '../components/AdminShared';

function ExportCard({ icon: Icon, label, description, filename, data }) {
  const [exporting, setExporting] = useState(false);
  const timerRef = useRef(null);

  const handleExport = () => {
    setExporting(true);
    timerRef.current = setTimeout(() => {
      if (data && data.length > 0) {
        exportToCSV(data, filename);
      }
      setExporting(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#15c8fb]/20 bg-[#15c8fb]/10 text-[#15c8fb]">
        <Icon size={22} />
      </div>
      <h3 className="font-black text-gray-900 dark:text-white">{label}</h3>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>
      <div className="mt-4">
        <button
          onClick={handleExport}
          disabled={exporting || !data || data.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-4 py-2 text-xs font-bold text-white hover:brightness-110 transition-all disabled:opacity-40"
        >
          {exporting ? <Loader size={13} className="animate-spin" /> : <FileText size={13} />}
          Export CSV {data ? `(${data.length})` : ''}
        </button>
      </div>
    </div>
  );
}

export default function ExportSection() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ recent_enrollments: [] });
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const { toast, showToast, closeToast } = useToast();

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard/'),
      api.get('/admin/payments/'),
      api.get('/admin/courses/'),
      api.get('/admin/announcements/'),
      api.get('/admin/news/'),
      api.get('/admin/categories/'),
    ])
      .then(([dash, pay, cour, ann, n, cat]) => {
        setMetrics(dash.data || { recent_enrollments: [] });
        setPayments(unwrapResults(pay.data));
        setCourses(unwrapResults(cour.data));
        setAnnouncements(unwrapResults(ann.data));
        setNews(unwrapResults(n.data));
        setCategories(unwrapResults(cat.data));
      })
      .catch((err) => showToast(apiError(err, 'Could not load export data.'), 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>

      <div className={`rounded-xl border p-6 shadow-sm ${accent.panel}`}>
        <h2 className="text-lg font-black text-gray-900 dark:text-white">Export platform data</h2>
        <p className="mt-1 text-sm text-gray-600 max-w-2xl">Download CSV reports of your platform data. These are generated client-side from live API data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ExportCard
          icon={Users}
          label="Students"
          description="Export all student records with names, emails, phone numbers, and enrollment status."
          filename="elevate_students.csv"
          data={(metrics.recent_enrollments || []).map(e => ({
            student: e.student_full_name || e.student_username,
            course: e.course_title,
            status: e.status,
            enrolled_at: e.enrolled_at,
          }))}
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
            submitted_at: p.submitted_at,
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
            is_active: c.is_active ? 'Yes' : 'No',
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
            created_at: a.created_at,
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
            created_at: n.created_at,
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
            courses_count: courses.filter((co) => co.category?.id === c.id).length,
          }))}
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-5 text-sm text-gray-900 dark:text-white shadow-sm">
        <strong>Note:</strong> All exports are generated from live data. This is a <strong>client-side</strong> CSV generation — no backend export API exists.
      </div>
    </motion.div>
  );
}
