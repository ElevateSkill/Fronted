import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div id="contact" className="min-h-screen pt-24 pb-12 transition-colors duration-500 dark:bg-charcoal bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- SECTION HEADER --- */}
        <div className="mb-16 text-center lg:text-left">
          {/* <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#17c966] font-mono tracking-[0.3em] text-sm mb-4 uppercase"
          >
            Get In Touch
          </motion.h2> */}
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter dark:text-white text-slate-900 leading-none"
          >
            LET'S START A <br /> 
            <span className="dark:text-white/20 text-slate-300 italic">CONVERSATION</span>
          </motion.h3 >
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT SIDE: INFO CARDS --- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              
              {[
                { icon: <Mail />, title: "Email Us", detail: "support@bromine.com", color: "#15c8fb" },
                { icon: <Phone />, title: "Call Us", detail: "+1 (555) 000-0000", color: "#17c966" },
                { icon: <MapPin />, title: "Headquarters", detail: "123 Tech Avenue, Silicon Valley", color: "#15c8fb" },
                { icon: <Clock />, title: "Availability", detail: "Mon - Fri, 9am - 6pm EST", color: "#17c966" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 backdrop-blur-sm group hover:border-[#15c8fb]/50 transition-all shadow-sm"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-white dark:bg-charcoal shadow-lg text-[${item.color}] group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(item.icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 mb-1">{item.title}</h4>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{item.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- RIGHT SIDE: THE FORM --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white dark:bg-surface border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle Gradient Glow in Corner */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#15c8fb]/5 blur-[80px] -z-10" />

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest uppercase dark:text-white/60 text-slate-500 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-slate-50 dark:bg-charcoal border border-slate-200 dark:border-white/5 rounded-xl px-6 py-4 outline-none focus:border-[#15c8fb] focus:ring-1 focus:ring-[#15c8fb] transition-all dark:text-white text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest uppercase dark:text-white/60 text-slate-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-charcoal border border-slate-200 dark:border-white/5 rounded-xl px-6 py-4 outline-none focus:border-[#15c8fb] focus:ring-1 focus:ring-[#15c8fb] transition-all dark:text-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black tracking-widest uppercase dark:text-white/60 text-slate-500 ml-1">Inquiry Type</label>
                <select className="w-full bg-slate-50 dark:bg-charcoal border border-slate-200 dark:border-white/5 rounded-xl px-6 py-4 outline-none focus:border-[#15c8fb] dark:text-white text-slate-900 appearance-none">
                  <option>General Inquiry</option>
                  <option>Course Support</option>
                  <option>Business Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black tracking-widest uppercase dark:text-white/60 text-slate-500 ml-1">Your Message</label>
                <textarea 
                  rows="5"
                  placeholder="How can we help you today?"
                  className="w-full bg-slate-50 dark:bg-charcoal border border-slate-200 dark:border-white/5 rounded-xl px-6 py-4 outline-none focus:border-[#15c8fb] focus:ring-1 focus:ring-[#15c8fb] transition-all dark:text-white text-slate-900 resize-none"
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#15c8fb] text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-[#15c8fb]/20 hover:brightness-110 transition-all uppercase tracking-[0.2em] text-sm"
              >
                Send Message <Send size={18} />
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>

      {/* --- FOOTER MAP ACCENT (Abstract Style) --- */}
      <div className="mt-24 h-[300px] w-full bg-slate-100 dark:bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 dark:opacity-10 grayscale invert dark:invert-0">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000" 
            alt="Map"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-charcoal via-transparent to-transparent" />
      </div>
    </div>
  );
}