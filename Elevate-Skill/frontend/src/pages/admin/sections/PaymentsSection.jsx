import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle, Search, Plus, Trash2, X, FileText, Building2, Edit3, Save, Loader } from 'lucide-react';
import { api, getMediaUrl, unwrapResults } from '../../../services/api';
import {
  Badge, Modal, ToastMessage, AnimatedCounter, Field, TextInput,
  useToast, useConfirmDelete, formatDate, apiError
} from '../components/AdminShared';

export default function PaymentsSection() {
  const [payments, setPayments] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [manualPayment, setManualPayment] = useState({ student_name: '', email: '', course_title: '', amount: '', phone: '' });
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  const [bankForm, setBankForm] = useState({ bank_name: '', account_holder_name: '', account_number: '', is_active: true });
  const { toast, showToast, closeToast } = useToast();
  const { confirmDelete, confirmThen, setConfirmDelete } = useConfirmDelete();

  const loadData = async () => {
    try {
      const [payRes, bankRes] = await Promise.all([
        api.get('/admin/payments/'),
        api.get('/bank-accounts/'),
      ]);
      const paymentsData = unwrapResults(payRes.data);
      setPayments(paymentsData);
      setBankAccounts(unwrapResults(bankRes.data));
      window.__adminPendingPayments = paymentsData.filter((p) => p.status === 'pending').length;
    } catch (err) {
      showToast(apiError(err, 'Could not load payments.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const pendingPayments = payments.filter((p) => p.status === 'pending');

  const filteredPayments = useMemo(() => {
    let result = payments;
    if (paymentStatusFilter !== 'all') {
      result = result.filter((p) => p.status === paymentStatusFilter);
    }
    const needle = paymentSearch.trim().toLowerCase();
    if (needle) {
      result = result.filter((p) =>
        [p.full_name, p.student_email, p.email, p.course_title, p.phone]
          .filter(Boolean)
          .some((val) => val.toLowerCase().includes(needle))
      );
    }
    return result;
  }, [payments, paymentStatusFilter, paymentSearch]);

  const updatePayment = async (payment, action) => {
    setSaving(true);
    try {
      await api.put(`/admin/payments/${payment.id}/${action}/`);
      showToast(action === 'approve' ? 'Payment approved and enrollment activated.' : 'Payment rejected and enrollment cancelled.', 'success');
      await loadData();
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetBankForm = () => {
    setBankForm({ bank_name: '', account_holder_name: '', account_number: '', is_active: true });
    setEditingBankId(null);
  };

  const editBank = (account) => {
    setEditingBankId(account.id);
    setBankForm({
      bank_name: account.bank_name || '',
      account_holder_name: account.account_holder_name || '',
      account_number: account.account_number || '',
      is_active: account.is_active !== undefined ? account.is_active : true,
    });
    setShowBankModal(true);
  };

  const saveBank = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...bankForm };
      if (editingBankId) {
        const res = await api.put(`/admin/bank-accounts/${editingBankId}/update/`, payload);
        setBankAccounts((prev) => prev.map((a) => (a.id === editingBankId ? res.data : a)));
      } else {
        const res = await api.post('/admin/bank-accounts/create/', payload);
        setBankAccounts((prev) => [res.data, ...prev]);
      }
      resetBankForm();
      showToast(editingBankId ? 'Bank account updated.' : 'Bank account created.', 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleBankStatus = async (account) => {
    setSaving(true);
    try {
      const res = await api.put(`/admin/bank-accounts/${account.id}/update/`, {
        bank_name: account.bank_name,
        account_holder_name: account.account_holder_name,
        account_number: account.account_number,
        is_active: !account.is_active,
      });
      setBankAccounts((prev) => prev.map((a) => (a.id === account.id ? res.data : a)));
      showToast(account.is_active ? 'Bank account deactivated.' : 'Bank account activated.', 'success');
    } catch (err) {
      showToast(apiError(err, 'Action failed.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteBank = (id) => {
    confirmThen(async () => {
      setSaving(true);
      try {
        await api.delete(`/admin/bank-accounts/${id}/delete/`);
        setBankAccounts((prev) => prev.filter((a) => a.id !== id));
        showToast('Bank account deleted.', 'success');
      } catch (err) {
        showToast(apiError(err, 'Could not delete.'), 'error');
      } finally {
        setSaving(false);
      }
    });
  };

  const statusCounts = {
    all: payments.length,
    pending: pendingPayments.length,
    approved: payments.filter((p) => p.status === 'approved').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
  };
  const total = statusCounts.all || 1;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        <ToastMessage message={toast.message} type={toast.type} onClose={closeToast} />
      </AnimatePresence>
      <AnimatePresence>
        <Modal
          open={confirmDelete.open}
          title="Confirm deletion"
          message="This action cannot be undone. Are you sure?"
          confirmLabel="Delete"
          onConfirm={confirmDelete.action || (() => {})}
          onCancel={() => setConfirmDelete({ open: false, action: null })}
        />
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-surface to-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-black text-amber-400"><AnimatedCounter value={statusCounts.pending} /></p>
            <span className="text-xs text-amber-500/80 font-bold">{Math.round(statusCounts.pending/total*100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{width:`${statusCounts.pending/total*100}%`}} /></div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-surface to-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-black text-emerald-400"><AnimatedCounter value={statusCounts.approved} /></p>
            <span className="text-xs text-emerald-500/80 font-bold">{Math.round(statusCounts.approved/total*100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${statusCounts.approved/total*100}%`}} /></div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Approved</p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-surface to-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-black text-rose-400"><AnimatedCounter value={statusCounts.rejected} /></p>
            <span className="text-xs text-rose-500/80 font-bold">{Math.round(statusCounts.rejected/total*100)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-rose-500 rounded-full" style={{width:`${statusCounts.rejected/total*100}%`}} /></div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Rejected</p>
        </div>
        <div className="rounded-xl border border-[#15c8fb]/20 bg-gradient-to-br from-[#15c8fb]/5 via-surface to-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-black text-[#15c8fb]"><AnimatedCounter value={statusCounts.all} /></p>
            <span className="text-xs text-[#15c8fb]/80 font-bold">100%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#15c8fb] rounded-full" style={{width:'100%'}} /></div>
          <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Total Payments</p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Payment review</h2>
            <span className="hidden sm:inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {pendingPayments.length} pending
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowManualPayment(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-3.5 py-2 text-xs font-black text-white hover:brightness-110 transition-all"
            >
              <Plus size={14} /> Add Manual
            </button>
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-500 transition-all focus-within:border-[#15c8fb]/40 focus-within:ring-2 focus-within:ring-[#15c8fb]/10">
              <Search size={15} className="shrink-0" />
              <input value={paymentSearch} onChange={(e) => setPaymentSearch(e.target.value)} placeholder="Search..." className="w-full min-w-[180px] bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" />
            </label>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-100 dark:border-white/10 pb-3">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setPaymentStatusFilter(status)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                paymentStatusFilter === status
                  ? 'bg-[#15c8fb] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              {status === 'all' ? `All (${statusCounts.all})` : `${status} (${statusCounts[status]})`}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-white/5">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-white/[0.08] text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <th className="px-4 py-3.5 font-bold">Student</th><th className="px-4 py-3.5 font-bold">Course</th>
                <th className="px-4 py-3.5 font-bold">Contact</th><th className="px-4 py-3.5 font-bold">Method</th>
                <th className="px-4 py-3.5 font-bold">Proof</th><th className="px-4 py-3.5 font-bold">Date</th>
                <th className="px-4 py-3.5 font-bold">Status</th><th className="px-4 py-3.5 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                  onClick={() => { setSelectedPayment(payment); setShowPaymentModal(true); }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-xs font-black text-white">
                        {(payment.full_name || payment.student_username || payment.student_email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{payment.full_name || payment.student_email}</p>
                        <p className="text-xs text-gray-500">{payment.student_email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-900 dark:text-white max-w-[180px] truncate">{payment.course_title || '—'}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs"><p>{payment.email || '—'}</p><p>{payment.phone || '—'}</p></td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{payment.payment_method || '—'}</td>
                  <td className="px-4 py-3.5">
                    {payment.proof_file ? (
                      <a href={getMediaUrl(payment.proof_file)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#15c8fb]/10 px-3 py-1.5 font-bold text-[#15c8fb] transition-all hover:bg-[#15c8fb]/20 text-xs">
                        <FileText size={13} /> View
                      </a>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{formatDate(payment.submitted_at)}</td>
                  <td className="px-4 py-3.5"><Badge>{payment.status}</Badge></td>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                      <button disabled={saving || payment.status !== 'pending'} onClick={() => updatePayment(payment, 'approve')}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5" title="Approve">
                        <CheckCircle size={15} /> Approve
                      </button>
                      <button disabled={saving || payment.status !== 'pending'} onClick={() => updatePayment(payment, 'reject')}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-black text-white transition-all hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5" title="Reject">
                        <XCircle size={15} /> Reject
                      </button>
                      <button onClick={() => confirmThen(() => {
                        setPayments((prev) => {
                          const filtered = prev.filter((p) => p.id !== payment.id);
                          window.__adminPendingPayments = filtered.filter((p) => p.status === 'pending').length;
                          return filtered;
                        });
                        showToast('Payment record removed.', 'success');
                      })} className="rounded-lg border border-rose-500/30 px-2 py-2 text-xs font-bold text-rose-500 transition-all hover:bg-rose-500/10">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredPayments.length && (
                <tr><td colSpan="8" className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <CreditCard size={40} className="mb-3 text-gray-300" />
                    <p className="text-sm font-medium">
                      {paymentSearch || paymentStatusFilter !== 'all' ? 'No payments match your filter.' : 'No payment submissions yet.'}
                    </p>
                    {(paymentSearch || paymentStatusFilter !== 'all') && (
                      <button onClick={() => { setPaymentSearch(''); setPaymentStatusFilter('all'); }} className="mt-3 text-xs font-bold text-[#15c8fb] hover:underline">Clear filters</button>
                    )}
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Showing {filteredPayments.length} of {payments.length} payments</span>
          <span className="hidden sm:inline">Click any row for details</span>
        </div>
      </motion.section>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Payment Details</h3>
                  <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-xl font-black text-white">
                        {(selectedPayment.full_name || selectedPayment.student_email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-lg">{selectedPayment.full_name || selectedPayment.student_email}</p>
                      <p className="text-sm text-gray-500">{selectedPayment.student_email || '—'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Email</span><p className="mt-1">{selectedPayment.email || '—'}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Phone</span><p className="mt-1">{selectedPayment.phone || '—'}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Course</span><p className="mt-1">{selectedPayment.course_title || '—'}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Method</span><p className="mt-1">{selectedPayment.payment_method || '—'}</p></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Status</span><div className="mt-1"><Badge>{selectedPayment.status}</Badge></div></div>
                    <div><span className="text-[10px] font-black uppercase tracking-wider text-gray-600 dark:text-gray-400">Submitted</span><p className="mt-1">{formatDate(selectedPayment.submitted_at)}</p></div>
                  </div>
                  {selectedPayment.proof_file && (
                    <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                      <a href={getMediaUrl(selectedPayment.proof_file)} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#15c8fb]/10 px-4 py-2.5 text-sm font-bold text-[#15c8fb] hover:bg-[#15c8fb]/20 transition-all">
                        <FileText size={16} /> View Payment Proof
                      </a>
                    </div>
                  )}
                  {selectedPayment.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                      <button disabled={saving} onClick={() => { updatePayment(selectedPayment, 'approve'); setShowPaymentModal(false); }}
                        className="flex-1 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button disabled={saving} onClick={() => { updatePayment(selectedPayment, 'reject'); setShowPaymentModal(false); }}
                        className="flex-1 rounded-xl bg-rose-600 px-5 py-3.5 text-sm font-black text-white hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manual Payment Modal */}
      <AnimatePresence>
        {showManualPayment && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowManualPayment(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Add Manual Payment</h3>
                  <button onClick={() => setShowManualPayment(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setPayments((prev) => {
                    const newPayment = {
                      id: `manual_${Date.now()}`,
                      full_name: manualPayment.student_name,
                      email: manualPayment.email,
                      course_title: manualPayment.course_title,
                      phone: manualPayment.phone,
                      status: 'approved',
                      payment_method: 'Manual Entry',
                      proof_file: null,
                      submitted_at: new Date().toISOString(),
                      student_email: manualPayment.email,
                      updated_at: new Date().toISOString(),
                    };
                    const updated = [newPayment, ...prev];
                    window.__adminPendingPayments = updated.filter((p) => p.status === 'pending').length;
                    return updated;
                  });
                  setManualPayment({ student_name: '', email: '', course_title: '', amount: '', phone: '' });
                  setShowManualPayment(false);
                  showToast('Manual payment record created.', 'success');
                }} className="space-y-4">
                  <Field label="Student Name"><TextInput required value={manualPayment.student_name} onChange={(e) => setManualPayment({...manualPayment, student_name: e.target.value})} placeholder="Full name" /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email"><TextInput required type="email" value={manualPayment.email} onChange={(e) => setManualPayment({...manualPayment, email: e.target.value})} placeholder="Email" /></Field>
                    <Field label="Phone"><TextInput value={manualPayment.phone} onChange={(e) => setManualPayment({...manualPayment, phone: e.target.value})} placeholder="Phone" /></Field>
                  </div>
                  <Field label="Course"><TextInput required value={manualPayment.course_title} onChange={(e) => setManualPayment({...manualPayment, course_title: e.target.value})} placeholder="Course name" /></Field>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-4 py-3 text-sm font-black text-white hover:brightness-110 transition-all">
                      <Plus size={16} className="inline mr-2" />Create Record
                    </button>
                    <button type="button" onClick={() => setShowManualPayment(false)} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bank Accounts Section */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">Payment Accounts</h2>
            <p className="text-sm text-gray-500">Manage bank accounts for student payments</p>
          </div>
          <button onClick={() => { resetBankForm(); setShowBankModal(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-4 py-2.5 text-xs font-black text-white hover:brightness-110 transition-all">
            <Plus size={14} /> Add Account
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bankAccounts.map((account) => (
            <div key={account.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15c8fb]/10 text-[#15c8fb]"><Building2 size={18} /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{account.bank_name}</h3>
                    <p className="text-[11px] text-gray-500">{account.account_holder_name}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  account.is_active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'
                }`}>{account.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="mb-3">
                <p className="text-[9px] font-black uppercase tracking-wider text-gray-600 mb-1">Account Number</p>
                <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 px-3 py-2 font-mono text-sm font-bold text-gray-900">
                  {account.account_number}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 p-2.5 mb-3">
                <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-400">Transfer to this account and upload receipt as proof of payment.</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => toggleBankStatus(account)} className={`relative h-4 w-8 rounded-full transition-colors ${account.is_active ? 'bg-[#15c8fb]' : 'bg-gray-300 dark:bg-white/20'}`}>
                    <div className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${account.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">Active</span>
                </label>
                <div className="flex items-center gap-1">
                  <button onClick={() => editBank(account)} className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:text-[#15c8fb] hover:bg-[#15c8fb]/10 transition-all" title="Edit"><Edit3 size={13} /></button>
                  <button onClick={() => deleteBank(account.id)} className="rounded-lg p-1.5 text-gray-500 dark:text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all" title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
          {!bankAccounts.length && (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
              <Building2 size={36} className="mb-2 text-gray-300" />
              <p className="text-sm">No payment accounts configured.</p>
              <button onClick={() => { resetBankForm(); setShowBankModal(true); }} className="mt-3 text-xs font-bold text-[#15c8fb] hover:underline">Add one now</button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Bank Account Modal */}
      <AnimatePresence>
        {showBankModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowBankModal(false); resetBankForm(); }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">{editingBankId ? 'Edit Payment Account' : 'Add Payment Account'}</h3>
                  <button onClick={() => { setShowBankModal(false); resetBankForm(); }} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                </div>
                <form onSubmit={(e) => { saveBank(e); setShowBankModal(false); }} className="space-y-4">
                  <Field label="Bank Name"><TextInput required value={bankForm.bank_name} onChange={(e) => setBankForm({...bankForm, bank_name: e.target.value})} placeholder="e.g. Commercial Bank of Ethiopia" /></Field>
                  <Field label="Account Holder"><TextInput required value={bankForm.account_holder_name} onChange={(e) => setBankForm({...bankForm, account_holder_name: e.target.value})} placeholder="Full name" /></Field>
                  <Field label="Account Number"><TextInput required value={bankForm.account_number} onChange={(e) => setBankForm({...bankForm, account_number: e.target.value})} placeholder="Account number" /></Field>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-3 text-sm font-bold text-gray-900 dark:text-white hover:border-[#15c8fb]/30 hover:bg-[#15c8fb]/5">
                    <input type="checkbox" checked={bankForm.is_active} onChange={(e) => setBankForm({...bankForm, is_active: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-[#15c8fb] focus:ring-[#15c8fb]" /> Active
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-4 py-3 text-sm font-black text-white hover:brightness-110 disabled:opacity-60">
                      {saving ? <Loader className="animate-spin inline mr-2" size={16} /> : <Save size={16} className="inline mr-2" />}
                      {editingBankId ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={() => { setShowBankModal(false); resetBankForm(); }} className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
