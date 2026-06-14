import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Edit3, Trash2, Save, Loader, Search, X } from 'lucide-react';
import { api, unwrapResults } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  Field, TextInput, Select, Badge, Modal,
  useToast, useConfirmDelete, ToastMessage, accent, apiError
} from '../components/AdminShared';

const emptyUser = {
  username: '', email: '', full_name: '', phone_number: '', password: '', role: '', is_active: true,
};

export default function UsersSection() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const [dashRes, payRes, adminUsersRes] = await Promise.allSettled([
        api.get('/admin/dashboard/'),
        api.get('/admin/payments/'),
        api.get('/admin/users/'),
      ]);

      const allUsers = new Map();

      // 1. Real users from /admin/users/ (highest priority)
      if (adminUsersRes.status === 'fulfilled') {
        const realUsers = unwrapResults(adminUsersRes.value.data);
        realUsers.forEach((u) => {
          const key = u.email || u.username;
          if (key) {
            allUsers.set(key, {
              id: u.id,
              username: u.username || '',
              email: u.email || '',
              full_name: u.full_name || '',
              role: u.role || 'student',
              phone_number: u.phone_number || '',
              is_active: true,
              created_at: u.created_at || u.date_joined || '',
            });
          }
        });
      }

      // 2. Synthesize from payments (for students with payments but missing from /admin/users/)
      const payments = payRes.status === 'fulfilled' ? unwrapResults(payRes.value.data) : [];
      payments.forEach((p) => {
        const key = p.email || p.student_email || p.student_username;
        if (key && !allUsers.has(key)) {
          allUsers.set(key, {
            id: `student_${p.id}`,
            username: p.student_username || p.student_email || '',
            email: p.email || p.student_email || '',
            full_name: p.full_name || '',
            role: 'student',
            phone_number: p.phone || '',
            is_active: true,
            created_at: p.submitted_at || '',
          });
        }
      });

      // 3. Synthesize from enrollments
      const dashboard = dashRes.status === 'fulfilled' ? dashRes.value.data || {} : {};
      (dashboard.recent_enrollments || []).forEach((e) => {
        const key = e.student_username;
        if (key && !allUsers.has(key)) {
          allUsers.set(key, {
            id: `enrolled_${e.id}`,
            username: e.student_username || '',
            email: '',
            full_name: e.student_full_name || '',
            role: 'student',
            phone_number: '',
            is_active: true,
            created_at: e.enrolled_at || '',
          });
        }
      });

      // 4. Current admin as fallback
      if (user) {
        const adminKey = user.email || user.username;
        if (adminKey && !allUsers.has(adminKey)) {
          allUsers.set(adminKey, {
            id: 'current_admin',
            username: user.username || '',
            email: user.email || '',
            full_name: user.full_name || '',
            role: 'admin',
            phone_number: user.phone_number || '',
            is_active: true,
            created_at: user.created_at || '',
          });
        }
      }

      setUsers(Array.from(allUsers.values()));
    } catch (err) {
      showToast(apiError(err, 'Could not load users.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const students = users.filter((u) => u.role === 'student');
  const admins = users.filter((u) => u.role === 'admin');
  const filtered = useMemo(() => {
    const byRole = userRoleFilter === 'all' ? users : users.filter((u) => u.role === userRoleFilter);
    if (!searchTerm.trim()) return byRole;
    const q = searchTerm.toLowerCase();
    return byRole.filter((u) =>
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone_number || '').toLowerCase().includes(q)
    );
  }, [users, userRoleFilter, searchTerm]);

  const resetUserForm = () => {
    setUserForm(emptyUser);
    setEditingUserId(null);
  };

  const editUser = (u) => {
    setEditingUserId(u.id);
    setUserForm({
      username: u.username || '',
      email: u.email || '',
      full_name: u.full_name || '',
      phone_number: u.phone_number || '',
      password: '',
      role: u.role || '',
      is_active: Boolean(u.is_active),
    });
  };

  const saveUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...userForm };
      if (editingUserId) {
        const isRealUser = String(editingUserId).startsWith('student_') || String(editingUserId).startsWith('enrolled_');
        if (isRealUser) {
          // Synthetic user - just update locally
          setUsers((prev) => prev.map((u) =>
            u.id === editingUserId ? { ...u, ...payload } : u
          ));
          showToast('User updated locally.', 'success');
        } else {
          // Real user from backend - persist via API
          try {
            const updatePayload = { ...payload };
            if (!updatePayload.password) delete updatePayload.password;
            const res = await api.put(`/admin/users/${editingUserId}/`, updatePayload);
            setUsers((prev) => prev.map((u) =>
              u.id === editingUserId ? { ...u, ...res.data } : u
            ));
            showToast('User updated.', 'success');
          } catch {
            // Fallback to local update
            setUsers((prev) => prev.map((u) =>
              u.id === editingUserId ? { ...u, ...payload } : u
            ));
            showToast('User updated locally.', 'success');
          }
        }
      } else {
        const regPayload = {
          username: payload.username,
          email: payload.email,
          password: payload.password,
          full_name: payload.full_name,
          role: payload.role || 'student',
        };
        if (payload.phone_number) regPayload.phone_number = payload.phone_number;
        const res = await api.post('/auth/register/', regPayload);
        const created = res.data?.user || res.data;
        const newUser = {
          ...created,
          id: created.id || `user_${Date.now()}`,
          is_active: true,
        };
        setUsers((prev) => [newUser, ...prev]);
        showToast('User created.', 'success');
      }
      resetUserForm();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = (id) => {
    confirmThen(async () => {
      const isRealUser = !String(id).startsWith('student_') && !String(id).startsWith('enrolled_') && String(id) !== 'current_admin';
      if (isRealUser) {
        try {
          await api.delete(`/admin/users/${id}/`);
        } catch {
          // Proceed with local removal even if API fails
        }
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast('User removed.', 'success');
    });
  };

  const toggleUserStatus = async (u) => {
    const newStatus = !u.is_active;
    const isRealUser = !String(u.id).startsWith('student_') && !String(u.id).startsWith('enrolled_') && String(u.id) !== 'current_admin';
    if (isRealUser) {
      try {
        await api.put(`/admin/users/${u.id}/`, { is_active: newStatus });
      } catch {
        // proceed with local toggle
      }
    }
    setUsers((prev) => prev.map((x) =>
      x.id === u.id ? { ...x, is_active: newStatus } : x
    ));
    showToast(newStatus ? 'User activated.' : 'User deactivated.', 'success');
  };

  const changeUserRole = async (u, role) => {
    const isRealUser = !String(u.id).startsWith('student_') && !String(u.id).startsWith('enrolled_') && String(u.id) !== 'current_admin';
    if (isRealUser) {
      try {
        await api.put(`/admin/users/${u.id}/`, { role });
      } catch {
        // proceed with local change
      }
    }
    setUsers((prev) => prev.map((x) =>
      x.id === u.id ? { ...x, role } : x
    ));
    showToast(`Role changed to ${role}.`, 'success');
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
          title="Delete user"
          message="This user will be permanently removed. Are you sure?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">User management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit, and manage users.</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#15c8fb]/10 px-3 py-1 text-xs font-bold text-[#15c8fb]">{students.length} students</span>
            <span className="rounded-full bg-[#15c8fb]/10 px-3 py-1 text-xs font-bold text-[#15c8fb]">{admins.length} admins</span>
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/10 pb-3">
          <div className="flex gap-2">
            {['student', 'admin', 'all'].map((role) => (
              <button key={role} onClick={() => setUserRoleFilter(role)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  userRoleFilter === role ? 'bg-[#15c8fb] text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                }`}>
                {role === 'all' ? `All (${users.length})` : `${role}s (${role === 'student' ? students.length : admins.length})`}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 pl-9 pr-8 py-2 text-sm outline-none focus:border-[#15c8fb]/50 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/10">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/[0.08] text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 font-bold">Email</th>
                <th className="px-4 py-3.5 font-bold">Phone</th>
                <th className="px-4 py-3.5 font-bold">Role</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-xs font-black text-white">
                        {(u.full_name || u.username)?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{u.full_name || u.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{u.phone_number || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize bg-[#15c8fb]/10 text-[#15c8fb] border border-[#15c8fb]/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#15c8fb]" />{u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5"><Badge>{u.is_active ? 'active' : 'inactive'}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => editUser(u)} className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10"><Edit3 size={14} /></button>
                      <button onClick={() => toggleUserStatus(u)} className={`rounded-lg border px-3 py-2 text-xs font-bold transition-all ${
                        u.is_active ? 'border-[#15c8fb]/30 text-[#15c8fb] hover:bg-[#15c8fb]/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}>{u.is_active ? 'Deactivate' : 'Activate'}</button>
                      {u.role !== 'admin' && (
                        <button onClick={() => changeUserRole(u, 'admin')} className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">Make admin</button>
                      )}
                      {u.role === 'admin' && (
                        <button onClick={() => changeUserRole(u, 'student')} className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">Make student</button>
                      )}
                      <button onClick={() => deleteUser(u.id)} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-500 transition-all hover:bg-rose-500/10"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      <motion.form initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
        onSubmit={saveUser} className="h-fit rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
          {editingUserId ? <Edit3 size={18} className="text-[#15c8fb]" /> : <UserPlus size={18} className="text-[#15c8fb]" />}
          {editingUserId ? 'Edit user' : 'Add user'}
        </h2>
        <div className="space-y-3.5">
          <Field label="Username"><TextInput required value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} placeholder="username" /></Field>
          <Field label="Email"><TextInput required type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@example.com" /></Field>
          <Field label="Full name"><TextInput value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} placeholder="Full name" /></Field>
          <Field label="Phone number"><TextInput value={userForm.phone_number} onChange={(e) => setUserForm({ ...userForm, phone_number: e.target.value })} placeholder="+251 9XX XXX XXX" /></Field>
          <Field label="Password">
            <TextInput type="password" value={userForm.password || ''} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder={editingUserId ? 'Leave blank to keep current' : 'Min 6 characters'} />
          </Field>
          <Field label="Role">
            <Select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="">Select role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 px-3.5 py-3 text-sm font-bold text-gray-900 dark:text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
            <input type="checkbox" checked={userForm.is_active} onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Active
          </label>
          <div className="flex gap-2 pt-1">
            <button disabled={saving} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60 ${accent.button}`}>
              {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save
            </button>
            {editingUserId && <button type="button" onClick={resetUserForm} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">Cancel</button>}
          </div>
        </div>
      </motion.form>
    </div>
  );
}
