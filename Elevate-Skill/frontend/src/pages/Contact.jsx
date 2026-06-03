import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Contact() {
  return (
    <div id="contact" className="relative w-full bg-gray-50 dark:bg-[#050505] py-16 md:py-24 px-6 transition-colors duration-500 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#3C83F6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f89f29]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-[2px] w-12 bg-[#f89f29]" />
            <span className="text-[#f89f29] font-black uppercase tracking-[0.3em] text-xs">Contact</span>
            <span className="h-[2px] w-12 bg-[#f89f29]" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Get In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f89f29] to-[#3C83F6]">Touch</span>
          </h2>
          <p className="text-gray-500 dark:text-white/40 text-sm mt-3 max-w-xl mx-auto">
            Have a project, question, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed max-w-sm">
              Whether you need a complex solution or have a simple question, we're here to help.
            </p>

            <div className="space-y-5">
              {[
                { icon: <Mail size={20} />, title: 'Email', value: 'hello@elevate-skill.com' },
                { icon: <Phone size={20} />, title: 'Phone', value: '+251 911 234 567' },
                { icon: <MapPin size={20} />, title: 'Location', value: 'Adama, Ethiopia' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-lg shadow-black/5 dark:shadow-white/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[#3C83F6] group-hover:bg-[#3C83F6] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40">{item.title}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/40?u=${i}`} className="w-8 h-8 rounded-full border-2 border-gray-100 dark:border-[#050505]" alt="" />
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-white/40">
                Trusted by <span className="text-gray-900 dark:text-white">500+</span> companies worldwide
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 dark:shadow-white/5"
            >
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2 block">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3C83F6]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2 block">Email</label>
                    <input type="email" placeholder="hello@example.com" className="w-full px-4 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3C83F6]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2 block">Subject</label>
                  <input type="text" placeholder="How can we help?" className="w-full px-4 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3C83F6]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20" />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/40 mb-2 block">Message</label>
                  <textarea rows={4} placeholder="Tell us more about your project..." className="w-full px-4 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#3C83F6]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20 resize-none" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-[#17c966]" /> Encrypted & Secure
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#f89f29] to-[#3C83F6] text-white font-black text-xs rounded-xl hover:brightness-110 transition-all uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl"
                  >
                    Send Message <ArrowRight size={14} />
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
