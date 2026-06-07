import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, XCircle, RefreshCw, CreditCard } from 'lucide-react';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import EmptyState from '../../../components/dashboard/EmptyState';

export default function Payments({ payments, loading, onRefresh, onApprove, onReject, onViewDetail }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = payments.filter(p => {
    const matchSearch = !search || (p.full_name || '').toLowerCase().includes(search.toLowerCase()) || (p.email || '').toLowerCase().includes(search.toLowerCase());
    const s = (p.status || '').toLowerCase();
    const matchFilter = filter === 'All' || s === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Payment Proofs</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">{payments.length} total · {payments.filter(p => (p.status || '').toLowerCase() === 'pending').length} pending</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} disabled={loading} className="p-2.5 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:bg-white/5 transition-all cursor-pointer" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-48 pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider cursor-pointer ${
                  filter === s ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments found" description="No payment submissions match your criteria." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-black/40">
                {['Full Name', 'Email', 'Phone', 'Course', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className={`text-left p-4 text-[10px] font-black text-brand-muted uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const isPending = (p.status || '').toLowerCase() === 'pending';
                return (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-brand-border/50 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4"><span className="font-semibold text-brand-text text-sm">{p.full_name}</span></td>
                  <td className="p-4 text-brand-muted text-xs">{p.email}</td>
                  <td className="p-4 text-brand-muted text-xs">{p.phone}</td>
                  <td className="p-4 text-brand-muted text-xs">{p.course_title}</td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4 text-brand-muted text-xs">{p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onViewDetail(p)} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer" title="View"><Eye size={16} /></button>
                      <button onClick={() => onApprove(p.id)} disabled={!isPending} className="p-2 rounded-lg bg-brand-violet/20 text-brand-violet hover:bg-brand-violet/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer" title="Approve"><CheckCircle size={16} /></button>
                      <button onClick={() => onReject(p.id)} disabled={!isPending} className="p-2 rounded-lg bg-brand-red/20 text-brand-red hover:bg-brand-red/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer" title="Reject"><XCircle size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
