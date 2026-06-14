import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Edit3, Trash2, Save, Loader, Search, X, Shield, Users, Mail, Phone, CheckCircle, XCircle, Filter, ArrowUpDown } from 'lucide-react';
import { api, unwrapResults } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  Field, TextInput, Select, Badge, Modal,
  useToast, useConfirmDelete, ToastMessage, accent, apiError
} from '../components/AdminShared';

const emptyUser = {
  username: '', email: '', full_name: '', phone_number: '', password: '', role: '', is_active: true,
};

const roleColors = {
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  student: 'bg-[#15c8fb]/10 text-[#15c8fb] border-[#15c8fb]/20',
};

function UserAvatar({ name, username, size = 'md' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  const gradients = [
    'from-[#15c8fb] to-[#f89f29]',
    'from-[#f89f29] to-[#f07000]',
    'from-emerald-500 to-teal-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-rose-500 to-orange-500',
  ];
  const seed = (name || username || '').length;
  const gradient = gradients[seed % gradients.length];
  const initial = (name || username || '?').charAt(0).toUpperCase();

  return (
    <div className={`flex ${sizes[size]} items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white font-black shadow-lg shrink-0`}>
      {initial}
    </div>
  );
}

function StatBadge({ label, count, icon: Icon, color }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${color} px-3 py-1.5 text-xs font-bold backdrop-blur-sm`}>
      <Icon size={12} />
      {count} {label}
    </div>
  );
}

export default function UsersSection() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('full_name');
  const [sortDir, setSortDir] = useState('asc');
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
    let result = byRole;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = byRole.filter((u) =>
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone_number || '').toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const aVal = (a[sortField] || '').toLowerCase();
      const bVal = (b[sortField] || '').toLowerCase();
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [users, userRoleFilter, searchTerm, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

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
          setUsers((prev) => prev.map((u) =>
            u.id === editingUserId ? { ...u, ...payload } : u
          ));
          showToast('User updated locally.', 'success');
        } else {
          try {
            const updatePayload = { ...payload };
            if (!updatePayload.password) delete updatePayload.password;
            const res = await api.put(`/admin/users/${editingUserId}/`, updatePayload);
            setUsers((prev) => prev.map((u) =>
              u.id === editingUserId ? { ...u, ...res.data } : u
            ));
            showToast('User updated.', 'success');
          } catch {
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
        } catch {}
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
      } catch {}
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
      } catch {}
    }
    setUsers((prev) => prev.map((x) =>
      x.id === u.id ? { ...x, role } : x
    ));
    showToast(`Role changed to ${role}.`, 'success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin" size={32} />
          <p className="text-sm text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
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

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Users size={20} className="text-[#15c8fb]" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">User Management</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create, edit, and manage platform users.</p>
          </div>
          <div className="flex gap-2">
            <StatBadge label="students" count={students.length} icon={Users} color="bg-[#15c8fb]/10 text-[#15c8fb] border-[#15c8fb]/20" />
            <StatBadge label="admins" count={admins.length} icon={Shield} color="bg-purple-500/10 text-purple-400 border-purple-500/20" />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/10 pb-3">
          <div className="flex gap-1.5">
            {[
              { role: 'student', label: 'Students', count: students.length },
              { role: 'admin', label: 'Admins', count: admins.length },
              { role: 'all', label: 'All', count: users.length },
            ].map(({ role, label, count }) => (
              <button
                key={role}
                onClick={() => setUserRoleFilter(role)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  userRoleFilter === role
                    ? 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white shadow-sm shadow-[#15c8fb]/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 pl-9 pr-8 py-2.5 text-sm outline-none focus:border-[#15c8fb]/50 focus:ring-2 focus:ring-[#15c8fb]/10 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/10">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.05] text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {[
                  { key: 'full_name', label: 'User' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone_number', label: 'Phone' },
                  { key: 'role', label: 'Role' },
                  { key: 'is_active', label: 'Status' },
                  { key: null, label: 'Actions' },
                ].map(({ key, label }) => (
                  <th
                    key={label}
                    className={`px-4 py-3.5 font-bold ${key ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors select-none' : ''}`}
                    onClick={() => key && toggleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      {key && sortField === key && (
                        <ArrowUpDown size={11} className={`transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="transition-all hover:bg-gray-50 dark:hover:bg-white/[0.03] group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={u.full_name} username={u.username} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{u.full_name || u.username || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate max-w-[180px]">{u.email || '—'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                      <Phone size={12} className="shrink-0" />
                      {u.phone_number || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold capitalize border ${roleColors[u.role] || roleColors.student}`}>
                      {u.role === 'admin' ? <Shield size={11} /> : <Users size={11} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border ${
                      u.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {u.is_active ? <CheckCircle size={11} /> : <XCircle size={11} />}
                      {u.is_active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editUser(u)}
                        className="rounded-lg border border-[#15c8fb]/30 px-2.5 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10 hover:border-[#15c8fb]/50"
                        title="Edit user"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u)}
                        className={`rounded-lg border px-2.5 py-2 text-xs font-bold transition-all ${
                          u.is_active
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                        title={u.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {u.is_active ? <XCircle size={13} /> : <CheckCircle size={13} />}
                      </button>
                      <button
                        onClick={() => changeUserRole(u, u.role === 'admin' ? 'student' : 'admin')}
                        className="rounded-lg border border-purple-500/30 px-2.5 py-2 text-xs font-bold text-purple-400 transition-all hover:bg-purple-500/10"
                        title={`Make ${u.role === 'admin' ? 'student' : 'admin'}`}
                      >
                        <Shield size={13} />
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="rounded-lg border border-rose-500/30 px-2.5 py-2 text-xs font-bold text-rose-500 transition-all hover:bg-rose-500/10"
                        title="Delete user"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="6" className="px-4 py-16 text-center">
                    <Users size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No users match your search.' : 'No users found.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{filtered.length} of {users.length} users</span>
          {filtered.length > 0 && (
            <span className="text-[10px] uppercase tracking-wider">
              Click column headers to sort
            </span>
          )}
        </div>
      </motion.section>

      <motion.form
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={saveUser}
        className="h-fit rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-sm">
            {editingUserId ? <Edit3 size={18} className="text-white" /> : <UserPlus size={18} className="text-white" />}
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {editingUserId ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {editingUserId ? 'Update user details below.' : 'Fill in the details to create a new user.'}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username">
              <TextInput required value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} placeholder="username" />
            </Field>
            <Field label="Role">
              <Select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </Select>
            </Field>
          </div>
          <Field label="Email">
            <TextInput required type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@example.com" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name">
              <TextInput value={userForm.full_name} onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })} placeholder="Full name" />
            </Field>
            <Field label="Phone number">
              <TextInput value={userForm.phone_number} onChange={(e) => setUserForm({ ...userForm, phone_number: e.target.value })} placeholder="+251 9XX XXX XXX" />
            </Field>
          </div>
          <Field label="Password">
            <TextInput type="password" value={userForm.password || ''} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder={editingUserId ? 'Leave blank to keep current' : 'Min 6 characters'} />
          </Field>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white transition-all hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
            <input type="checkbox" checked={userForm.is_active} onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" />
            <span className="flex items-center gap-1.5">
              {userForm.is_active ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-rose-400" />}
              Active
            </span>
          </label>
          <div className="flex gap-3 pt-2">
            <button disabled={saving} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black disabled:opacity-60 shadow-lg ${accent.button}`}>
              {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
              {editingUserId ? 'Update User' : 'Create User'}
            </button>
            {editingUserId && (
              <button type="button" onClick={resetUserForm} className="rounded-xl border border-gray-200 dark:border-white/10 px-6 py-3.5 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                Cancel
              </button>
            )}
          </div>
        </div>
      </motion.form>
    </div>
  );
}
