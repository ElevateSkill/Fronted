import { Phone, Mail, BookOpen, Calendar, Eye, FileText, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { getMediaUrl } from '../../services/api';

export default function PaymentDetailModal({ payment, onClose, onApprove, onReject, onShowImage }) {
  if (!payment) return null;

  const isPending = (payment.status || '').toLowerCase() === 'pending';
  const isImage = getMediaUrl(payment.proof_file).match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

  const timeline = [
    {
      label: 'Submitted',
      date: payment.submitted_at,
      done: true,
      desc: 'Student uploaded payment proof'
    },
    {
      label: 'Under Review',
      done: !isPending,
      active: isPending,
      desc: isPending ? 'Awaiting admin decision' : 'Admin has reviewed'
    },
    {
      label: payment.status === 'Approved' ? 'Approved — Access Granted' : payment.status === 'Rejected' ? 'Rejected' : 'Pending',
      date: !isPending ? payment.updated_at : null,
      done: !isPending,
      icon: payment.status === 'Approved' ? '✅' : payment.status === 'Rejected' ? '❌' : '⏳',
      desc: payment.status === 'Approved' ? 'Enrollment has been activated' :
            payment.status === 'Rejected' ? 'Payment was declined' :
            'Waiting for decision'
    }
  ];

  return (
    <Modal title="Payment Details" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-xl">
            {(payment.full_name || 'U')[0]}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-brand-text">{payment.full_name}</h4>
            <p className="text-sm text-brand-muted">{payment.email}</p>
          </div>
          <StatusBadge status={payment.status} />
        </div>

        {/* Tracking Timeline */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-brand-border">
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-3 flex items-center gap-1">
            <Clock size={12} /> Tracking Timeline
          </p>
          <div className="relative">
            {timeline.map((step, i) => (
              <div key={i} className="flex items-start gap-3 pb-5 last:pb-0 relative">
                {i < timeline.length - 1 && (
                  <div className={`absolute left-[11px] top-5 w-0.5 h-full -z-0 ${step.done ? 'bg-brand-violet' : 'bg-gray-200'}`} />
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 z-10 ${
                  step.done ? 'bg-brand-violet/20 ring-2 ring-brand-violet' :
                  step.active ? 'bg-brand-orange/20 ring-2 ring-amber-400 animate-pulse' :
                  'bg-brand-card'
                }`}>
                  {step.icon || (step.done ? '✓' : step.active ? '●' : '○')}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className={`text-xs font-bold ${step.done ? 'text-brand-violet' : step.active ? 'text-brand-orange' : 'text-brand-muted'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-brand-muted">{step.desc}</p>
                  {step.date && (
                    <p className="text-[9px] text-gray-400 mt-0.5">{new Date(step.date).toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { icon: <Phone size={16} />, label: 'Phone', value: payment.phone },
            { icon: <Mail size={16} />, label: 'Email', value: payment.email },
            { icon: <BookOpen size={16} />, label: 'Course', value: payment.course_title },
            { icon: <Calendar size={16} />, label: 'Submitted', value: payment.submitted_at ? new Date(payment.submitted_at).toLocaleDateString() : '-' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50 border border-brand-border">
              <div className="flex items-center gap-2 text-brand-muted text-[10px] uppercase tracking-wider font-bold mb-1">{item.icon} {item.label}</div>
              <p className="text-brand-text font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {payment.proof_file && (
          <div className="p-4 rounded-xl bg-gray-50 border border-brand-border">
            <div className="flex items-center gap-2 text-brand-muted text-[10px] uppercase tracking-wider font-bold mb-2">
              <Eye size={16} /> Payment Proof
            </div>
            {isImage ? (
              <div className="relative group cursor-pointer" onClick={() => onShowImage(getMediaUrl(payment.proof_file))}>
                <img src={getMediaUrl(payment.proof_file)} alt="Payment Proof" className="w-full max-h-64 object-contain rounded-lg group-hover:brightness-75 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1.5 bg-black/60 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm">Click to enlarge</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href={getMediaUrl(payment.proof_file)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-primary/10 text-brand-primary font-bold text-xs rounded-xl hover:bg-brand-primary/20 transition-all">
                  <FileText size={16} /> View File
                </a>
                <a href={getMediaUrl(payment.proof_file)} download className="p-3 rounded-xl bg-brand-card text-brand-muted hover:bg-brand-card transition-all">
                  <Download size={16} />
                </a>
              </div>
            )}
          </div>
        )}

        {isPending && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onApprove(payment.id)}
              className="flex-1 py-3 bg-brand-violet text-white font-black text-xs rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={16} /> Approve
            </button>
            <button
              onClick={() => onReject(payment.id)}
              className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
