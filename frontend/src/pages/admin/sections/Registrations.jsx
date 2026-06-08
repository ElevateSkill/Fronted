import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, CheckCircle, CreditCard, UserPlus, GraduationCap } from 'lucide-react';
import StatusBadge from '../../../components/dashboard/StatusBadge';
import EmptyState from '../../../components/dashboard/EmptyState';

const statusStyle = (s) => {
  const map = { Pending: 'text-amber-700 bg-amber-100', Active: 'text-green-700 bg-green-100', Completed: 'text-[#5A2DA8] bg-[#5A2DA8]/10', Cancelled: 'text-red-700 bg-red-100' };
  return map[s] || 'text-gray-500 bg-gray-100';
};

export default function Registrations({ registrations, onApprove, onView, onViewPayment, payments = [] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = registrations.filter(r => {
    const matchSearch = !search || (r.name || '').toLowerCase().includes(search.toLowerCase()) || (r.email || '').toLowerCase().includes(search.toLowerCase()) || (r.course || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const findPayment = (r) => payments.find(p =>
    p.course_title === r.course &&
    (p.full_name?.toLowerCase().includes(r.name?.toLowerCase().split(' ')[0] || '') ||
     r.name?.toLowerCase().includes((p.full_name || '').toLowerCase().split(' ')[0] || ''))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-brand-text tracking-tight">Enrollments</h2>
          <p className="text-sm text-brand-muted font-medium mt-1">Enrollment is activated by approving the payment</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by name, email or course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-48 pl-10 pr-4 py-2.5 bg-brand-card border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-1 p-1 bg-brand-card border border-brand-border rounded-xl">
            {['All', 'Pending', 'Active', 'Completed', 'Cancelled'].map(s => (
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
        <EmptyState icon={GraduationCap} title="No enrollments found" description="No enrollments match your search criteria." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-black/40">
                {['Student', 'Course', 'Enrolled', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`text-left p-4 text-[10px] font-black text-brand-muted uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const payment = findPayment(r);
                return (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-brand-border/50 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-violet to-brand-primary flex items-center justify-center text-white font-black text-xs">{(r.name || 'S')[0]}</div>
                      <div>
                        <span className="font-semibold text-brand-text text-sm">{r.name}</span>
                        {r.email && <p className="text-[10px] text-brand-muted">{r.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-brand-muted text-xs font-medium">{r.course || '—'}</td>
                  <td className="p-4 text-brand-muted text-xs">{r.date || '—'}</td>
                  <td className="p-4">
                    {payment ? (
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
                      }`}>{payment.status || '—'}</span>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">No payment</span>
                    )}
                  </td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {payment && payment.status === 'pending' && (
                        <>
                          <button onClick={() => onViewPayment(payment)} className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all cursor-pointer" title="Review Payment"><CreditCard size={16} /></button>
                          <button onClick={() => onApprove(payment.id)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all cursor-pointer" title="Approve Payment & Activate Enrollment"><CheckCircle size={16} /></button>
                        </>
                      )}
                      <button onClick={() => onView(r)} className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all cursor-pointer" title="View Details"><Eye size={16} /></button>
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
