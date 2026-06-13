import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Edit3, Trash2, Save, Loader } from 'lucide-react';
import { api, unwrapResults } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  Field, TextInput, Select, Badge,
  useToast, ToastMessage, accent, apiError
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
  const { toast, showToast, closeToast } = useToast();

  const buildUserList = (dashboard, payments) => {
    const map = new Map();
    (payments || []).forEach((p) => {
      const key = p.email || p.student_username;
      if (key && !map.has(key)) {
        map.set(key, {
          id: `student_${p.id}`,
          username: p.student_username || '',
          email: p.email || '',
          full_name: p.full_name || '',
          role: 'student',
          phone_number: p.phone || '',
          is_active: true,
          created_at: p.submitted_at || '',
        });
      }
    });
    (dashboard?.recent_enrollments || []).forEach((e) => {
      const key = e.student_username;
      if (key && !map.has(key)) {
        map.set(key, {
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
      if (adminKey && !map.has(adminKey)) {
        map.set(adminKey, {
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
      setUsers(Array.from(map.values()));
  };

  const loadData = async () => {
    try {
      const [dashRes, payRes] = await Promise.all([
        api.get('/admin/dashboard/'),
        api.get('/admin/payments/'),
      ]);
      buildUserList(dashRes.data || {}, unwrapResults(payRes.data));
    } catch (err) {
      showToast(apiError(err, 'Could not load users.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const students = users.filter((u) => u.role === 'student');
  const admins = users.filter((u) => u.role === 'admin');
  const filtered = userRoleFilter === 'all' ? users : users.filter((u) => u.role === userRoleFilter);

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
        setUsers((prev) => prev.map((u) =>
          u.id === editingUserId ? { ...u, ...payload } : u
        ));
        showToast('User updated.', 'success');
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
        setUsers((prev) => [{ ...created, id: `user_${created.id || Date.now()}` }, ...prev]);
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
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('User deleted.', 'success');
  };

  const toggleUserStatus = (u) => {
    setUsers((prev) => prev.map((x) =>
      x.id === u.id ? { ...x, is_active: !x.is_active } : x
    ));
    showToast(u.is_active ? 'User deactivated.' : 'User activated.', 'success');
  };

  const changeUserRole = (u, role) => {
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

      <motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">User management</h2>
            <p className="text-sm text-gray-500">Create, edit, and manage users. Role/status changes are local.</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-[#15c8fb]/10 px-3 py-1 text-xs font-bold text-[#15c8fb]">{students.length} students</span>
            <span className="rounded-full bg-[#15c8fb]/10 px-3 py-1 text-xs font-bold text-[#15c8fb]">{admins.length} admins</span>
          </div>
        </div>
        <div className="mb-4 flex gap-2 border-b border-gray-100 pb-3">
          {['student', 'admin', 'all'].map((role) => (
            <button key={role} onClick={() => setUserRoleFilter(role)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                userRoleFilter === role ? 'bg-[#15c8fb] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}>
              {role === 'all' ? `All (${users.length})` : `${role}s (${role === 'student' ? students.length : admins.length})`}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="bg-gray-100 text-xs uppercase tracking-wider text-gray-700">
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 font-bold">Email</th>
                <th className="px-4 py-3.5 font-bold">Phone</th>
                <th className="px-4 py-3.5 font-bold">Role</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-xs font-black text-white">
                        {(u.full_name || u.username)?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{u.full_name || u.username}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{u.phone_number || '—'}</td>
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
                        u.is_active ? 'border-[#15c8fb]/30 text-[#15c8fb] hover:bg-[#15c8fb]/10' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                      }`}>{u.is_active ? 'Deactivate' : 'Activate'}</button>
                      {u.role !== 'admin' && (
                        <button onClick={() => changeUserRole(u, 'admin')} className="rounded-lg border border-[#15c8fb]/30 px-3 py-2 text-xs font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/10">Make admin</button>
                      )}
                      {u.role === 'admin' && (
                        <button onClick={() => changeUserRole(u, 'student')} className="rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-gray-900 transition-all hover:bg-gray-50">Make student</button>
                      )}
                      <button onClick={() => deleteUser(u.id)} className="rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-50"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-sm text-gray-500">No users found.</td></tr>
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
            {editingUserId && <button type="button" onClick={resetUserForm} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white transition-all hover:bg-gray-50">Cancel</button>}
          </div>
        </div>
      </motion.form>
    </div>
  );
}
