import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('elevateskill_contact_messages') || '[]');
      existing.push({ ...form, timestamp: new Date().toISOString() });
      localStorage.setItem('elevateskill_contact_messages', JSON.stringify(existing));
      setSent(true);
      setSending(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    }, 800);
  };
  return (
    <div id="contact" className="relative w-full bg-black py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#15c8fb]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f89f29]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Get In TOUCH{' '}
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto">
            Have a project, question, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Whether you need a complex solution or have a simple question, we're here to help.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={20} />, title: 'Email', value: 'elevateskill369@gmail.com' },
                { icon: <Phone size={20} />, title: 'Phone', value: '+251 981 80 70 55' },
                { icon: <MapPin size={20} />, title: 'Location', value: 'Adama, Oromia, Ethiopia' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-5 p-4 bg-white/5 border border-white/10 group cursor-pointer hover:border-white/20 transition-all shadow-lg shadow-white/5"
                >
                  <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-[#d3b104] group-hover:bg-[#e6aa05] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.title}</p>
                    <p className="text-sm font-bold text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
{/* 
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/40?u=${i}`} className="w-8 h-8 border-2 border-white/5" alt="" />
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400">
                Trusted by <span className="text-white">500+</span> companies worldwide
              </p>
            </div> */}
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl shadow-white/5"
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required type="text" placeholder="John Doe" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-white/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="hello@example.com" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-white/20" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} type="text" placeholder="How can we help?" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-white/20" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Tell us more about your project..." className="w-full px-4 py-3.5 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#15c8fb]/50 transition-all placeholder:text-white/20 resize-none" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {sent ? (
                      <span className="flex items-center gap-1.5 text-green-400"><CheckCircle size={12} /> Message saved</span>
                    ) : (
                      <><ShieldCheck size={12} /> Encrypted & Secure</>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={sending}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#f89f29] to-[#fb7d15] text-white font-black text-xs hover:brightness-110 transition-all uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'} <ArrowRight size={14} />
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
