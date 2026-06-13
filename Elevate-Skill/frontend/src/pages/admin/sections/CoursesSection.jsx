import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Edit3, Plus, Save, Search, Trash2, Upload, Loader } from 'lucide-react';
import { api, getMediaUrl, unwrapResults } from '../../../services/api';
import {
  Field, TextInput, TextArea, Select, Badge, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, objectToFormData, apiError
} from '../components/AdminShared';

const emptyCourse = {
  title: '',
  short_description: '',
  description: '',
  category_id: '',
  price: '',
  instructor: '',
  duration: '',
  lessons: '',
  requirements: '',
  learning_outcomes: '',
  is_active: true,
  is_published: false,
  thumbnail: null,
};

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        api.get('/admin/courses/'),
        api.get('/admin/categories/'),
      ]);
      setCourses(unwrapResults(coursesRes.data));
      setCategories(unwrapResults(categoriesRes.data));
    } catch (err) {
      showToast(apiError(err, 'Could not load courses.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredCourses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return courses;
    return courses.filter((course) =>
      [course.title, course.instructor, course.category?.name, course.short_description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(needle))
    );
  }, [courses, query]);

  const resetCourseForm = () => {
    setCourseForm(emptyCourse);
    setEditingCourseId(null);
  };

  const editCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title || '',
      short_description: course.short_description || '',
      description: course.description || course.short_description || '',
      category_id: course.category?.id || '',
      price: course.price || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      lessons: course.lessons || '',
      requirements: course.requirements || '',
      learning_outcomes: course.learning_outcomes || '',
      is_active: Boolean(course.is_active),
      is_published: Boolean(course.is_published),
      thumbnail: null,
    });
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...courseForm,
        category_id: courseForm.category_id || '',
        lessons: courseForm.lessons ? Number(courseForm.lessons) : '',
        price: courseForm.price || '0',
      };
      const formData = objectToFormData(payload);
      if (editingCourseId) await api.patch(`/admin/courses/${editingCourseId}/`, formData);
      else await api.post('/admin/courses/', formData);
      resetCourseForm();
      showToast(editingCourseId ? 'Course updated.' : 'Course created.', 'success');
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const patchCourse = async (course, payload) => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/courses/${course.id}/`, payload);
      setCourses((items) => items.map((item) => (item.id === course.id ? res.data : item)));
      showToast('Course visibility updated.', 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = (id) => {
    confirmThen(async () => {
      setSaving(true);
      try {
        await api.delete(`/admin/courses/${id}/`);
        setCourses((items) => items.filter((item) => item.id !== id));
        showToast('Course deleted.', 'success');
      } catch (err) {
        showToast(apiError(err, 'Could not delete course.'), 'error');
      } finally {
        setSaving(false);
      }
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>
      <AnimatePresence>
        <Modal
          open={confirmDelete.open}
          title="Confirm deletion"
          message="This action cannot be undone. Are you sure you want to delete this course?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Course management</h2>
            <p className="text-sm text-gray-500">Create, edit, publish, hide, and manage course content.</p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white transition-all duration-200 focus-within:border-[#15c8fb]/40 focus-within:ring-2 focus-within:ring-[#15c8fb]/10">
            <Search size={16} className="shrink-0" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." className="w-full bg-transparent outline-none" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCourses.map((course, i) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
              className="group overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={getMediaUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900'}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-lg bg-gradient-to-r from-[#15c8fb]/90 to-[#f89f29]/90 px-2.5 py-1 text-xs font-black uppercase text-white backdrop-blur">{course.category?.name || 'Uncategorized'}</span>
                  <Badge>{course.is_published && course.is_active ? 'published' : course.is_active ? 'draft' : 'inactive'}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-900 dark:text-white">{course.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{course.short_description || course.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="font-semibold text-gray-900 dark:text-white">{course.price} ETB</span>
                  <span>{course.lessons || 0} lessons</span>
                  <span>{course.instructor || 'No instructor'}</span>
                  <span>{course.duration || 'No duration'}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                  <button onClick={() => editCourse(course)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10 hover:border-[#15c8fb]/50"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => patchCourse(course, { is_published: !course.is_published })} className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">{course.is_published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => patchCourse(course, { is_active: !course.is_active })} className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">{course.is_active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => deleteCourse(course.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </motion.article>
          ))}
          {!filteredCourses.length && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <BookOpen size={48} className="mb-3 text-gray-300" />
              <p className="text-sm">No courses found</p>
            </div>
          )}
        </div>
      </motion.section>

      <motion.form
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={saveCourse}
        className="h-fit rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
          {editingCourseId ? <Edit3 size={18} className="text-[#15c8fb]" /> : <Plus size={18} className="text-[#15c8fb]" />}
          {editingCourseId ? 'Edit course' : 'Add course'}
        </h2>
        <div className="space-y-3.5">
          <Field label="Title"><TextInput required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="Course title" /></Field>
          <Field label="Category">
            <Select value={courseForm.category_id} onChange={(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}>
              <option value="">Uncategorized</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
          </Field>
          <Field label="Short description"><TextArea required value={courseForm.short_description} onChange={(e) => setCourseForm({ ...courseForm, short_description: e.target.value })} rows="2" /></Field>
          <Field label="Full description"><TextArea required value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} rows="4" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (ETB)"><TextInput value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} placeholder="500.00" /></Field>
            <Field label="Lessons"><TextInput value={courseForm.lessons} onChange={(e) => setCourseForm({ ...courseForm, lessons: e.target.value })} placeholder="12" /></Field>
          </div>
          <Field label="Instructor"><TextInput value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} /></Field>
          <Field label="Duration"><TextInput value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} /></Field>
          <Field label="Requirements"><TextArea value={courseForm.requirements} onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })} rows="2" /></Field>
          <Field label="Learning outcomes"><TextArea value={courseForm.learning_outcomes} onChange={(e) => setCourseForm({ ...courseForm, learning_outcomes: e.target.value })} rows="2" /></Field>
          <Field label="Thumbnail">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/30 bg-gray-50 dark:bg-gray-900 px-4 py-4 text-sm text-gray-600 dark:text-gray-300 transition-all hover:border-[#15c8fb]/50 hover:bg-[#15c8fb]/5">
              <Upload size={18} className="text-gray-400" />
              <span>{courseForm.thumbnail?.name || 'Click to upload thumbnail'}</span>
              <input type="file" accept="image/*" onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.files?.[0] || null })} className="hidden" />
            </label>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 px-3.5 py-3 text-sm font-bold text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
              <input type="checkbox" checked={courseForm.is_active} onChange={(e) => setCourseForm({ ...courseForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Active
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 px-3.5 py-3 text-sm font-bold text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
              <input type="checkbox" checked={courseForm.is_published} onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Published
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button disabled={saving} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
              {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save
            </button>
            {editingCourseId && <button type="button" onClick={resetCourseForm} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>}
          </div>
        </div>
      </motion.form>
    </div>
  );
}
