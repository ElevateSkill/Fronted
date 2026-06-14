import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tags, Loader, Plus } from 'lucide-react';
import { api, unwrapResults } from '../../../services/api';
import {
  Field, TextInput, Modal, ToastMessage,
  useToast, useConfirmDelete, accent, apiError, StaggerContainer
} from '../components/AdminShared';

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const [catRes, courseRes] = await Promise.all([
        api.get('/admin/categories/'),
        api.get('/admin/courses/'),
      ]);
      setCategories(unwrapResults(catRes.data));
      setCourses(unwrapResults(courseRes.data));
    } catch (err) {
      showToast(apiError(err, 'Could not load categories.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) await api.patch(`/admin/categories/${editingCategory.id}/`, { name: categoryName });
      else await api.post('/admin/categories/', { name: categoryName });
      setCategoryName('');
      setEditingCategory(null);
      showToast(editingCategory ? 'Category updated.' : 'Category created.', 'success');
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = (id) => {
    confirmThen(async () => {
      setSaving(true);
      try {
        await api.delete(`/admin/categories/${id}/`);
        showToast('Category deleted.', 'success');
        await loadData();
      } catch (err) {
        showToast(apiError(err, 'Could not delete category.'), 'error');
      } finally {
        setSaving(false);
      }
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>
      <AnimatePresence>
        <Modal
          open={confirmDelete.open}
          title="Confirm deletion"
          message="This action cannot be undone. Are you sure you want to delete this category?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={saveCategory}
        className="h-fit rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-lg shadow-[#15c8fb]/20">
            <Plus size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {editingCategory ? 'Edit category' : 'Create category'}
            </h2>
            <p className="text-xs text-gray-500">{editingCategory ? 'Update the category name' : 'Add a new category for courses'}</p>
          </div>
        </div>
        <Field label="Category name">
          <TextInput required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Web Development" />
        </Field>
        <div className="mt-5 flex gap-2">
          <button disabled={saving} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
            {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : null}
            {editingCategory ? 'Update' : 'Create'} category
          </button>
          {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setCategoryName(''); }} className="rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95">Cancel</button>}
        </div>
      </motion.form>

      <motion.section
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">Categories used by courses</h2>
          <span className="rounded-full bg-gradient-to-r from-[#15c8fb]/20 to-[#f89f29]/20 px-3 py-1 text-xs font-bold text-[#15c8fb]">{categories.length} total</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <StaggerContainer className="contents" delay={0.05}>
            {categories.map((cat) => {
              const count = courses.filter((course) => course.category?.id === cat.id).length;
              return (
                <motion.article
                  key={cat.id}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 p-4 transition-all hover:shadow-md hover:border-[#15c8fb]/30"
                >
                  <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-[#15c8fb]/5 to-[#f89f29]/5 transition-all duration-500 group-hover:scale-[3]" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-gray-900 dark:text-white group-hover:text-[#15c8fb] transition-colors">{cat.name}</h3>
                      <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">/{cat.slug} &middot; {count} course{count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); }} className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10 active:scale-95">Edit</button>
                      <button onClick={() => deleteCategory(cat.id)} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-500/10 active:scale-95">Delete</button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </StaggerContainer>
          {!categories.length && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <Tags size={40} className="mb-2 text-gray-300" />
              <p className="text-sm">No categories created yet</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
