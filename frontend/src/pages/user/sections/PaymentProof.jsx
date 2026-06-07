import { User, Mail, Phone, Upload, CheckCircle, Eye, FileText, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PaymentProof({
  enrollments,
  apiPayments,
  paymentForm,
  setPaymentForm,
  selectedEnrollment,
  setSelectedEnrollment,
  uploadedFile,
  setUploadedFile,
  submittingPayment,
  paymentSubmitted,
  setPaymentSubmitted,
  onSubmit,
  onViewPayment,
  showToast
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-brand-text tracking-tight">Payment Proof</h2>
        <p className="text-xs text-brand-muted mt-0.5">Submit your payment for admin verification</p>
      </div>

      {apiPayments.length > 0 && (
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
          <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <FileText size={13} className="text-brand-primary" /> Payment History ({apiPayments.length})
          </h3>
          <div className="space-y-2">
            {apiPayments.map(p => (
              <button
                key={p.id}
                onClick={() => onViewPayment(p)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-black/40 border border-brand-border hover:border-brand-primary/30 hover:bg-brand-card transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    p.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                    p.status === 'rejected' ? 'bg-[#D95C4A]/30 text-[#D95C4A]' : 'bg-[#3A3992]/30 text-[#3A3992]'
                  }`}>
                    {p.status === 'approved' ? <CheckCircle size={15} /> :
                     p.status === 'rejected' ? <AlertTriangle size={15} /> : <Clock size={15} />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-brand-text capitalize">{p.status}</p>
                    <p className="text-[10px] text-brand-muted">{p.course_title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-gray-500">{new Date(p.submitted_at).toLocaleDateString()}</span>
                      {p.updated_at !== p.submitted_at && (
                        <>
                          <ArrowRight size={8} className="text-gray-600" />
                          <span className="text-[9px] text-gray-500">Updated {new Date(p.updated_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                    p.status === 'rejected' ? 'bg-[#D95C4A]/30 text-[#D95C4A]' :
                    'bg-[#3A3992]/30 text-[#3A3992]'
                  }`}>
                    {p.status}
                  </span>
                  <Eye size={14} className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        {paymentSubmitted ? (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-900/30 border border-green-700/50 mb-3">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <h4 className="font-bold text-brand-text text-sm mb-1">Payment Submitted</h4>
            <p className="text-xs text-brand-muted">Pending admin approval. You'll be notified once activated.</p>
            <button
              onClick={() => { setPaymentSubmitted(false); setUploadedFile(null); setSelectedEnrollment(''); }}
              className="mt-3 text-xs text-brand-primary font-semibold hover:underline cursor-pointer"
            >
              Submit another
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1.5">
                Select Course Enrollment
              </span>
              <select
                value={selectedEnrollment}
                onChange={e => setSelectedEnrollment(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-orange/50"
              >
                <option value="" className="bg-black">-- Choose enrollment --</option>
                {enrollments.map(e => (
                  <option key={e.id} value={e.id} className="bg-black">{e.course?.title || `Enrollment #${e.id}`}</option>
                ))}
              </select>
              {enrollments.length === 0 && (
                <p className="text-[10px] text-[#3A3992] mt-1">You have no pending enrollments. Enroll in a course first.</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={paymentForm.full_name}
                  onChange={e => setPaymentForm(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Full Name"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-orange/50 placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={paymentForm.email}
                  onChange={e => setPaymentForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-orange/50 placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={paymentForm.phone}
                  onChange={e => setPaymentForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Phone"
                  className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-orange/50 placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <label className="flex-1 flex items-center gap-3 px-4 py-3 border-2 border-dashed border-brand-border rounded-xl cursor-pointer hover:border-brand-orange/50 transition-all bg-black/30 group">
                <Upload size={18} className="text-gray-600 group-hover:text-brand-orange transition-colors" />
                <span className="text-xs text-brand-muted group-hover:text-brand-text">
                  {uploadedFile ? uploadedFile.name : 'Upload proof (PDF, image)'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f) {
                      if (f.size > 5 * 1024 * 1024) {
                        showToast('File too large. Max 5MB', 'error');
                        return;
                      }
                      setUploadedFile(f);
                      showToast('File uploaded');
                    }
                  }}
                />
              </label>
              <button
                onClick={onSubmit}
                disabled={submittingPayment || !selectedEnrollment}
                className="px-6 py-3 bg-brand-orange text-white font-black text-[10px] rounded-xl hover:brightness-110 transition-all uppercase tracking-wider whitespace-nowrap shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submittingPayment ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
