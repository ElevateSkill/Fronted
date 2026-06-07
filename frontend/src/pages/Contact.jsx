import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Send, ArrowRight, ShieldCheck, CheckCircle2, Loader2, AlertCircle, MessageSquare } from 'lucide-react';
// The current backend has no /contact/ endpoint — keep form local but
// also offer a deep-link to the user's email client as a fallback channel.
const MAIL_TO = 'elevateskill369@gmail.com';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Open user's mail client as the actual delivery channel.
    // The backend does not yet expose a public /contact/ endpoint, so the
    // email-client handoff is the most reliable transport. The form also
    // shows an in-app success state so the UX is complete.
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    const href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(form.subject || 'Elevate Skill Inquiry')}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.location.href = href;
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 6000);
    }, 400);
  };

  return (
    <div id="contact" className="relative w-full bg-gray-50  py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#EE8433]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#3A3992]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#3A3992]" />
            <span className="text-[#3A3992] font-black uppercase tracking-[0.3em] text-xs">Contact</span>
            <span className="h-[2px] w-12 bg-[#3A3992]" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900  tracking-tight">
            Get In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3A3992] to-[#EE8433]">Touch</span>
          </h2>
          <p className="text-gray-500  text-sm mt-3 max-w-xl mx-auto">
            Have a project, question, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <p className="text-gray-500  text-sm leading-relaxed max-w-sm">
              Whether you need a complex solution or have a simple question, we're here to help.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={20} />, title: 'Email', value: 'elevateskill369@gmail.com', href: `mailto:${MAIL_TO}` },
                { icon: <Phone size={20} />, title: 'Phone', value: '+251981807055', href: 'tel:+251981807055' },
                { icon: <Send size={20} />, title: 'Telegram', value: '@elevateskill', href: 'https://t.me/elevateskill' },
                { icon: <MessageSquare size={20} />, title: 'Support', value: '@Elevateskillsupport', href: 'https://t.me/Elevateskillsupport' }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-gray-100  border border-gray-200  cursor-pointer hover:border-gray-300 :border-white/20 transition-all shadow-lg shadow-black/5 "
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-200  flex items-center justify-center text-[#EE8433] hover:bg-[#EE8433] hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 ">{item.title}</p>
                    <p className="text-sm font-bold text-gray-900 ">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100  border border-gray-200 ">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A3992] to-[#EE8433] flex items-center justify-center text-white text-[10px] font-bold">
                ES
              </div>
              <p className="text-[10px] font-bold text-gray-500 ">
                Available <span className="text-gray-900 ">24/7</span> for your support
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-100  border border-gray-200  rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 "
            >
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 border border-green-200  bg-green-50  text-green-700 "
                  >
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                    <span>Your email client has been opened. If it didn't open automatically, please email us at {MAIL_TO}.</span>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 border border-red-200  bg-[#FEF0EE]  text-red-700 "
                  >
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500  mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 bg-white  border border-gray-200  rounded-xl text-gray-900  text-sm focus:outline-none focus:border-[#EE8433]/50 transition-all placeholder:text-gray-400 :text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500  mb-2 block">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="hello@example.com"
                      className="w-full px-4 py-3.5 bg-white  border border-gray-200  rounded-xl text-gray-900  text-sm focus:outline-none focus:border-[#EE8433]/50 transition-all placeholder:text-gray-400 :text-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500  mb-2 block">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3.5 bg-white  border border-gray-200  rounded-xl text-gray-900  text-sm focus:outline-none focus:border-[#EE8433]/50 transition-all placeholder:text-gray-400 :text-white/20"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500  mb-2 block">Message *</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your project..."
                    className="w-full px-4 py-3.5 bg-white  border border-gray-200  rounded-xl text-gray-900  text-sm focus:outline-none focus:border-[#EE8433]/50 transition-all placeholder:text-gray-400 :text-white/20 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500  uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[#5A2DA8]" /> Encrypted & Secure
                  </div>
                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#3A3992] to-[#EE8433] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl disabled:opacity-70"
                  >
                    {submitting ? (
                      <><Loader2 size={14} className="animate-spin" /> Opening email...</>
                    ) : (
                      <>Send Message <ArrowRight size={14} /></>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
