import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  KeyRound, Mail, ArrowRight, 
  Github, Chrome, ShieldCheck, 
  Terminal, Lock, Fingerprint,
  RefreshCcw, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2070",
    title: "Airspace",
    subtitle: "Autonomous systems & drone engineering",
    gradient: "from-blue-600/30 via-transparent to-cyan-600/30",
    color: "#15c8fb"
  },
  {
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070",
    title: "Graphics",
    subtitle: "Visual computing & real-time rendering",
    gradient: "from-purple-600/30 via-transparent to-pink-600/30",
    color: "#f89f29"
  },
  {
    url: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2070",
    title: "Web Dev",
    subtitle: "Full-stack systems & modern architectures",
    gradient: "from-green-600/30 via-transparent to-teal-600/30",
    color: "#17c966"
  },
  {
    url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070",
    title: "IoT",
    subtitle: "Connected devices & embedded intelligence",
    gradient: "from-amber-600/30 via-transparent to-red-600/30",
    color: "#f89f29"
  }
];

export default function Login() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex transition-colors duration-500 dark:bg-[#050505] bg-[#f8fafc] text-slate-900 dark:text-zinc-100 overflow-hidden font-sans">
      
      {/* --- LEFT PANEL: IMAGE SLIDER --- */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden border-r border-slate-200 dark:border-white/5">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={current}
            src={slides[current].url}
            alt={slides[current].title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className={`absolute inset-0 bg-gradient-to-br ${slides[current].gradient} z-[1]`} />
        <div className="absolute inset-0 bg-black/50 z-[2]" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center shadow-2xl">
              <Terminal size={20} className="text-[#15c8fb]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Auth_Protocol_v4.2</span>
          </motion.div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full"
            >
              <ShieldCheck size={12} className="text-[#17c966]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Secured Session</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={current + "title"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-6xl font-black uppercase tracking-tighter leading-none"
              >
                <span className="text-white">{slides[current].title}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">Terminal.</span>
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={current + "sub"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base text-white/70 font-medium max-w-sm"
              >
                {slides[current].subtitle}. Please provide your credentials to resume your engineering progression. All sessions are encrypted via SHA-256.
              </motion.p>
            </AnimatePresence>

            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <Fingerprint size={32} className="text-white opacity-40 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Identity Node</p>
              <p className="text-sm font-mono text-[#15c8fb]">0x82...BF92</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: THE LOGIN INTERFACE --- */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-sm">
          
          <header className="mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Resume Session</h1>
            <p className="text-slate-500 dark:text-zinc-500 font-medium">
              Enter your credentials to enter the lab.
            </p>
          </header>

          {/* OAUTH INTEGRATION */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#15c8fb]/50 transition-all shadow-sm">
              <Chrome size={18} className="text-[#15c8fb]" />
              <span className="text-xs font-black uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#17c966]/50 transition-all shadow-sm">
              <Github size={18} className="dark:text-white" />
              <span className="text-xs font-black uppercase tracking-widest">GitHub</span>
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/5"></div></div>
            <span className="relative px-4 bg-[#f8fafc] dark:bg-[#050505] text-[10px] font-black uppercase tracking-widest text-slate-400">Manual Entry</span>
          </div>

          {/* LOGIN FORM */}
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email Protocol</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#15c8fb]" size={16} />
                <input 
                  type="email" 
                  placeholder="name@astu.edu" 
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#15c8fb]/20 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Access Key</label>
                <Link to="/forgot-password" size={10} className="text-[9px] font-black uppercase tracking-widest text-[#15c8fb] hover:text-[#17c966]">Recover Key?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#17c966]" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#17c966]/20 transition-all" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-200 dark:border-white/10 bg-transparent text-[#15c8fb] focus:ring-[#15c8fb]" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Remember Node</span>
            </div>

            <button className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all shadow-xl hover:bg-[#15c8fb] hover:text-white dark:hover:bg-[#17c966] dark:hover:text-white transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3">
              Enter Terminal <ArrowRight size={16} />
            </button>
          </form>

          {/* ALERTS & REDIRECTS */}
          <div className="mt-10 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
             <AlertCircle size={14} className="text-amber-500 shrink-0" />
             <p className="text-[9px] text-amber-500/80 leading-relaxed font-bold uppercase tracking-tight">
               System Notice: Ensure you are on the official elevate-skill.edu domain before entering keys.
             </p>
          </div>

          <footer className="mt-10 text-center">
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-500">
              New to the system? <Link to="/register" className="text-[#15c8fb] font-black uppercase tracking-widest ml-1 hover:underline">Initialize Profile</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
