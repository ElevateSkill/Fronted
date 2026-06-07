import { Phone, Mail, BookOpen, Calendar, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';

export default function RegistrationDetailModal({ registration, onClose, onApprove, onReject }) {
  if (!registration) return null;

  return (
    <Modal title="Registration Details" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-xl">
            {(registration.name || 'U')[0]}
          </div>
          <div>
            <h4 className="text-xl font-bold text-brand-text">{registration.name}</h4>
            <p className="text-sm text-brand-muted">{registration.email}</p>
          </div>
          <div className="ml-auto"><StatusBadge status={registration.status} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { icon: <Phone size={16} />, label: 'Phone', value: registration.phone },
            { icon: <Mail size={16} />, label: 'Email', value: registration.email },
            { icon: <BookOpen size={16} />, label: 'Course', value: registration.course },
            { icon: <Calendar size={16} />, label: 'Registered', value: registration.date },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-gray-50 border border-brand-border">
              <div className="flex items-center gap-2 text-brand-muted text-[10px] uppercase tracking-wider font-bold mb-1">{item.icon} {item.label}</div>
              <p className="text-brand-text font-semibold">{item.value}</p>
            </div>
          ))}
          {registration.id_proof && (
            <div className="col-span-2 p-3 rounded-xl bg-gray-50 border border-brand-border">
              <div className="flex items-center gap-2 text-brand-muted text-[10px] uppercase tracking-wider font-bold mb-1"><ImageIcon size={16} /> Identity Proof</div>
              <img src={registration.id_proof} alt="ID Proof" className="w-full max-h-48 object-contain rounded-lg" />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => onApprove(registration.id)} className="flex-1 py-3 bg-brand-violet text-white font-black text-xs rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <CheckCircle size={16} /> Approve
          </button>
          <button onClick={() => onReject(registration.id)} className="flex-1 py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <XCircle size={16} /> Reject
          </button>
        </div>
      </div>
    </Modal>
  );
}
