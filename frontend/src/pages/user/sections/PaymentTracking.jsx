import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertTriangle, ArrowRight, FileText, Eye } from 'lucide-react';

export default function PaymentTracking({ apiPayments, onNavigate, onViewPayment }) {
  const total = apiPayments.length;
  const approved = apiPayments.filter(p => p.status === 'approved').length;
  const pending = apiPayments.filter(p => p.status === 'pending').length;
  const rejected = apiPayments.filter(p => p.status === 'rejected').length;

  const stats = [
    { label: 'Total Payments', value: total, icon: <CreditCard size={20} />, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { label: 'Approved', value: approved, icon: <CheckCircle size={20} />, color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
    { label: 'Pending', value: pending, icon: <Clock size={20} />, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
    { label: 'Rejected', value: rejected, icon: <AlertTriangle size={20} />, color: 'text-brand-red', bg: 'bg-brand-red/10' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-brand-violet" />;
      case 'rejected': return <AlertTriangle size={16} className="text-brand-red" />;
      default: return <Clock size={16} className="text-brand-orange" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-brand-violet/20 text-brand-violet';
      case 'rejected': return 'bg-brand-red/20 text-brand-red';
      default: return 'bg-brand-orange/20 text-brand-orange';
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-brand-text tracking-tight">Payment Tracking</h2>
        <p className="text-xs text-brand-muted mt-0.5">Monitor your payment status in real-time</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-brand-border bg-brand-card p-4"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-black text-brand-text">{stat.value}</p>
            <p className="text-[11px] text-brand-muted font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {apiPayments.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-card p-12 text-center">
          <CreditCard size={40} className="mx-auto text-brand-muted mb-3" />
          <h3 className="text-base font-bold text-brand-text mb-1">No Payments Yet</h3>
          <p className="text-sm text-brand-muted mb-4">Submit your payment proof after enrolling in a course.</p>
          <button
            onClick={() => onNavigate('payment')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl hover:brightness-110 transition-all"
          >
            <FileText size={14} /> Submit Payment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {apiPayments.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-brand-border bg-brand-card p-5 hover:border-brand-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    p.status === 'approved' ? 'bg-brand-violet/20' :
                    p.status === 'rejected' ? 'bg-brand-red/20' : 'bg-brand-orange/20'
                  }`}>
                    {getStatusIcon(p.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-brand-text truncate">{p.course_title || 'Course Payment'}</h4>
                      <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">{p.full_name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-brand-muted">{new Date(p.submitted_at).toLocaleDateString()}</span>
                      {p.amount && <span className="text-[10px] font-bold text-brand-primary">{p.amount} ETB</span>}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {[
                        { label: 'Submitted', done: true },
                        { label: 'Under Review', done: p.status !== 'pending', active: p.status === 'pending' },
                        { label: p.status === 'approved' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Completed', done: p.status !== 'pending' },
                      ].map((step, si) => (
                        <div key={si} className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${
                            step.done ? 'bg-brand-violet' : step.active ? 'bg-brand-orange animate-pulse' : 'bg-brand-border'
                          }`} />
                          <span className={`text-[8px] font-bold uppercase tracking-wider ${
                            step.done ? 'text-brand-violet' : step.active ? 'text-brand-orange' : 'text-brand-muted'
                          }`}>
                            {step.label}
                          </span>
                          {si < 2 && <span className="w-3 h-px bg-brand-border" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onViewPayment(p)}
                  className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all shrink-0 cursor-pointer"
                >
                  <Eye size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
