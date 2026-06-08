import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Plus, Search, Users as UsersIcon, RefreshCw, Loader2, Shield, GraduationCap, Mail, Phone, Calendar, ChevronRight } from 'lucide-react';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import EmptyState from '../../../components/dashboard/EmptyState';

const RoleIcon = ({ role }) => {
  if (role?.toLowerCase() === 'admin') return <Shield size={14} className="text-brand-primary" />;
  return <GraduationCap size={14} className="text-brand-orange" />;
};

export default function Users({ users, loading, onEdit, onDelete, onAdd, onRefresh }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = useMemo(() => {
    return (users || []).filter(u => {
      const matchesSearch = !search
        || (u.name || '').toLowerCase().includes(search.toLowerCase())
        || (u.email || '').toLowerCase().includes(search.toLowerCase())
        || (u.username || '').toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const admins = (users || []).filter(u => u.role?.toLowerCase() === 'admin');
  const students = (users || []).filter(u => u.role?.toLowerCase() !== 'admin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-brand-text tracking-tight">Users</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">
            {users?.length || 0} total users
            {loading && <span className="ml-2 inline-flex items-center gap-1 text-brand-primary"><Loader2 size={12} className="animate-spin" /> Loading...</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={onRefresh} disabled={loading} className="p-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:bg-white/5 transition-all cursor-pointer" title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          )}
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider cursor-pointer">
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-brand-text">{users?.length || 0}</p>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Users</p>
          </div>
        </div>
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 text-brand-primary">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-brand-text">{admins.length}</p>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Admins</p>
          </div>
        </div>
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-100 text-brand-orange">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-brand-text">{students.length}</p>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Students</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by name, email or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
          {['All', 'Student', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider cursor-pointer ${
                roleFilter === r ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={users?.length === 0 ? "No users in the system yet" : "No users match your search"}
          description={users?.length === 0
            ? "Users will appear here once the backend exposes an admin user list endpoint. You can still create new users via 'Add User'."
            : "Try a different search term or clear the filters."}
          action={onAdd ? (
            <button onClick={onAdd} className="px-4 py-2 bg-brand-primary text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer">Add User</button>
          ) : null}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-black/40">
                {['User', 'Contact', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className={`p-4 text-[10px] font-black text-brand-muted uppercase tracking-wider text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-brand-border/50 hover:bg-brand-primary/[0.03] transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-sm shadow-lg">
                          {(u.name || u.email || 'U')[0]?.toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-text text-sm">{u.name || u.full_name || '—'}</span>
                          <RoleIcon role={u.role} />
                        </div>
                        <span className="text-[11px] text-brand-muted">@{u.username || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-brand-muted text-xs">
                        <Mail size={11} />
                        {u.email || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-brand-muted text-xs">
                        <Phone size={11} />
                        {u.phone_number || u.phone || '—'}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: u.role?.toLowerCase() === 'admin' ? 'rgba(90,45,168,0.1)' : 'rgba(238,132,51,0.1)',
                        color: u.role?.toLowerCase() === 'admin' ? '#5A2DA8' : '#EE8433',
                      }}
                    >
                      <RoleIcon role={u.role} />
                      {u.role || 'Student'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-brand-muted text-xs">
                      <Calendar size={11} />
                      {u.joined || (u.created_at ? new Date(u.created_at).toLocaleDateString() : '—')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEdit(u)} className="p-2 rounded-lg text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary transition-all cursor-pointer" title="Edit"><Edit3 size={15} /></button>
                      <button onClick={() => onDelete(u.id)} className="p-2 rounded-lg text-brand-muted hover:bg-brand-red/10 hover:text-brand-red transition-all cursor-pointer" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
