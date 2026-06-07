import { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Mail, Clock, Send, CheckCircle, HelpCircle, ChevronDown } from 'lucide-react';

const faqData = [
  { q: 'How do I reset my password?', a: 'Go to Settings and click "Change Password". Follow the instructions sent to your email.' },
  { q: 'How do I access my courses?', a: 'Your enrolled courses appear under "My Courses" in the sidebar. Click any course to continue learning.' },
  { q: 'How do I get my certificate?', a: 'Certificates are awarded upon completing all lessons and the final project in your course.' },
  { q: 'How do I contact support?', a: 'Use the Support tab to submit a ticket. Our team typically responds within 24 hours.' },
];

export default function Support({ showToast }) {
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'Normal' });
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-brand-text tracking-tight">Support</h2>
        <p className="text-xs text-brand-muted mt-0.5">Get help from our support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: <Headphones size={18} />, label: 'Live Chat', desc: 'Chat with our team', color: 'from-green-500/20 to-emerald-500/20 text-green-400' },
          { icon: <Mail size={18} />, label: 'Email Us', desc: 'support@elevate.com', color: 'from-brand-primary/20 to-[#EE8433]/20 text-brand-primary' },
          { icon: <Clock size={18} />, label: 'Response Time', desc: 'Within 24 hours', color: 'from-[#3A3992]/20 to-[#3A3992]/20 text-[#3A3992]' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`p-5 rounded-xl bg-gradient-to-br ${item.color} border border-brand-border text-center`}
          >
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h4 className="font-bold text-brand-text text-xs">{item.label}</h4>
            <p className="text-[10px] text-brand-muted mt-0.5">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {showTicketSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-green-700/50 bg-brand-card p-6 text-center"
        >
          <CheckCircle size={32} className="mx-auto text-green-400 mb-3" />
          <h3 className="text-sm font-bold text-brand-text mb-1">Ticket Submitted</h3>
          <p className="text-xs text-brand-muted mb-3">We'll get back to you within 24 hours.</p>
          <button
            onClick={() => { setShowTicketSuccess(false); setTicketForm({ subject: '', message: '', priority: 'Normal' }); }}
            className="px-5 py-2 bg-brand-primary text-white font-bold text-[10px] rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            Submit Another
          </button>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
          <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Send size={13} className="text-brand-primary" /> Submit a Ticket
          </h3>
          <div className="space-y-3">
            <input
              value={ticketForm.subject}
              onChange={e => setTicketForm(p => ({ ...p, subject: e.target.value }))}
              placeholder="What's the issue?"
              className="w-full px-4 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600"
            />
            <div className="flex gap-1.5">
              {['Low', 'Normal', 'High'].map(p => (
                <button
                  key={p}
                  onClick={() => setTicketForm(t => ({ ...t, priority: p }))}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    ticketForm.priority === p
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-black/50 text-brand-muted border-brand-border hover:border-brand-primary/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <textarea
              value={ticketForm.message}
              onChange={e => setTicketForm(p => ({ ...p, message: e.target.value }))}
              rows={3}
              placeholder="Describe your issue in detail..."
              className="w-full px-4 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50 placeholder:text-gray-600 resize-none"
            />
            <button
              onClick={() => {
                if (!ticketForm.subject || !ticketForm.message) {
                  showToast('Please fill in all fields', 'error');
                  return;
                }
                setShowTicketSuccess(true);
                showToast('Ticket submitted!');
              }}
              className="px-5 py-2.5 bg-brand-primary text-white font-black text-[10px] rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={12} /> Submit Ticket
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <HelpCircle size={13} className="text-brand-orange" /> FAQ
        </h3>
        <div className="space-y-1.5">
          {faqData.map((faq, i) => (
            <div key={i} className="rounded-xl border border-brand-border overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full flex items-center justify-between p-3.5 text-left bg-black/40 hover:bg-white/5 transition-all cursor-pointer"
              >
                <span className="text-xs font-semibold text-brand-text">{faq.q}</span>
                <ChevronDown size={12} className={`text-brand-muted transition-transform shrink-0 ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === i && (
                <div className="px-3.5 pb-3.5">
                  <p className="text-xs text-brand-muted">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
