import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Plus, Search, Users as UsersIcon, RefreshCw, Loader2 } from 'lucide-react';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import EmptyState from '../../../components/dashboard/EmptyState';

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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Users</h2>
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
                {['Name', 'Username', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className={`p-4 text-[10px] font-black text-brand-muted uppercase tracking-wider text-left ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-brand-border/50 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-xs">
                        {(u.name || u.email || 'U')[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-brand-text text-sm">{u.name || u.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-brand-muted text-xs">@{u.username || '—'}</td>
                  <td className="p-4 text-brand-muted text-xs">{u.email || '—'}</td>
                  <td className="p-4 text-brand-muted text-xs">{u.phone_number || u.phone || '—'}</td>
                  <td className="p-4"><StatusBadge status={u.role} /></td>
                  <td className="p-4 text-brand-muted text-xs">{u.joined || (u.created_at ? new Date(u.created_at).toLocaleDateString() : '—')}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(u)} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer" title="Edit"><Edit3 size={16} /></button>
                      <button onClick={() => onDelete(u.id)} className="p-2 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-all cursor-pointer" title="Delete"><Trash2 size={16} /></button>
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
