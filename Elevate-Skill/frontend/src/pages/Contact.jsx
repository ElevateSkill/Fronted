import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const primaryColor = "#1C7EC6";

  return (
    <div id="contact" className="min-h-screen bg-[#05070a] text-white selection:bg-[#1C7EC6] selection:text-white overflow-hidden">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#1C7EC6]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1C7EC6]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* --- HERO HEADER --- */}
        {/* <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-[2px] w-12 bg-[#1C7EC6]" />
            <span className="text-[#1C7EC6] font-black uppercase tracking-[0.4em] text-xs">Reach Out</span>
          </motion.div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* --- LEFT: BIG INFO SECTION --- */}
          <div className="lg:col-span-5 space-y-12">
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-md">
              Have a complex project or a simple question? We're here to bridge the gap between your vision and reality.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail />, title: "Inquiries", value: "hello@bromine.com" },
                { icon: <Phone />, title: "Assistance", value: "+1 (888) 234 5678" },
                { icon: <MapPin />, title: "Location", value: "777 Digital Way, San Francisco" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-8 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#1C7EC6] group-hover:bg-[#1C7EC6] group-hover:text-white transition-all duration-500 shadow-2xl">
                    {React.cloneElement(item.icon, { size: 28 })}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.title}</h4>
                    <p className="text-xl font-bold tracking-tight">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Trust Badge */}
            <div className="pt-12 border-t border-white/5 flex items-center gap-6">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-[#05070a]" alt="user" />
                  ))}
               </div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                 Joined by <span className="text-white">500+ Companies</span> worldwide
               </p>
            </div>
          </div>

          {/* --- RIGHT: PREMIUM FORM --- */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative group">
                    <input type="text" className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#1C7EC6] transition-colors peer text-lg font-bold" placeholder=" " />
                    <label className="absolute left-0 top-4 text-slate-500 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#1C7EC6] peer-placeholder-shown:top-4">FULL NAME</label>
                  </div>
                  <div className="relative group">
                    <input type="email" className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#1C7EC6] transition-colors peer text-lg font-bold" placeholder=" " />
                    <label className="absolute left-0 top-4 text-slate-500 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#1C7EC6] peer-placeholder-shown:top-4">EMAIL ADDRESS</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Service Required</span>
                  <div className="flex flex-wrap gap-3">
                    {['Development', 'Design', 'Strategy', 'Other'].map(tag => (
                      <button key={tag} type="button" className="px-6 py-2 rounded-full border border-white/10 text-xs font-bold hover:bg-[#1C7EC6] hover:border-[#1C7EC6] transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative group">
                  <textarea rows="4" className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-[#1C7EC6] transition-colors peer text-lg font-bold resize-none" placeholder=" "></textarea>
                  <label className="absolute left-0 top-4 text-slate-500 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#1C7EC6] peer-placeholder-shown:top-4">MESSAGE</label>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
                  <div className="flex items-center gap-3 text-slate-500">
                    <ShieldCheck size={20} className="text-[#1C7EC6]" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Encrypted & Secure</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto px-12 py-6 bg-[#1C7EC6] text-white font-black rounded-2xl shadow-2xl shadow-[#1C7EC6]/30 flex items-center justify-center gap-4 group"
                  >
                    SEND MESSAGE <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      {/* --- FOOTER DECOR --- */}
      <div className="w-full h-[400px] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070a] to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000" 
          className="w-full h-full object-cover opacity-20 grayscale" 
          alt="tech background"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex items-center gap-4 text-white/10 font-black text-9xl select-none tracking-tighter">
                BROMINE <Globe size={100} className="animate-spin-slow" /> 2026
            </div>
        </div>
      </div>
    </div>
  );
}