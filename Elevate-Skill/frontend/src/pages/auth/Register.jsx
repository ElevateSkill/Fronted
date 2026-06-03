import React, { useState } from 'react';
import { register } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, IdCard,
  UserPlus, ArrowRight, TriangleAlert, Sparkles, BookOpen
} from 'lucide-react';
import logoSvg from '../../assets/logo-elevate.svg';

export default function Register() {
  const [form, setForm] = useState({ 
    email: '', 
    full_name: '', 
    username: '', 
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirm_password) {
      setMsg({ type: 'error', text: 'Access keys do not match.' });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const { confirm_password: _cf, ...payload } = form;
      await register(payload);
      
      setMsg({ type: 'success', text: 'Identity created. Synced with Protocol.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMessage = "Registration failed. Check parameters.";
      
      if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        errorMessage = `${firstKey.replace('_', ' ')}: ${errorData[firstKey][0]}`;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      setMsg({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#050505] transition-colors duration-500 overflow-hidden font-sans">
      
      {/* LEFT: Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070" 
          alt="Learning" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#15c8fb]/40 via-black/60 to-[#f89f29]/30 z-[1]" />
        <div className="absolute inset-0 bg-black/50 z-[2]" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <img src={logoSvg} alt="Elevate Skill" className="h-9 brightness-0 invert" />
          </motion.div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-lg">
                <Sparkles size={12} className="text-[#f89f29]" />
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">New Registration</span>
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.05] tracking-tight drop-shadow-lg">
                JOIN THE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15c8fb] to-[#f89f29] drop-shadow-none">ELEVATE</span> PLATFORM
              </h1>
              <p className="text-base text-white/90 font-medium leading-relaxed max-w-md mt-5 drop-shadow">
                Project-based learning platform designed for the modern engineer. Build real systems, not just tutorials.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-8">
              {['Learn', 'Build', 'Deploy'].map((tag, i) => (
                <span key={tag} className="text-sm font-black uppercase tracking-[0.2em] text-white/70 drop-shadow">{tag}{i < 2 ? ' —' : ''}</span>
              ))}
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-[10px] text-white/30 font-mono tracking-wide">
            Elevate Skill · Project-Based Platform
          </motion.p>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8fafc] dark:from-[#050505] to-transparent pointer-events-none lg:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8fafc] dark:from-[#050505] to-transparent pointer-events-none lg:hidden" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#f8fafc] dark:from-[#050505] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8fafc] dark:from-[#050505] to-transparent pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-[#15c8fb]/5 relative"
        >
          {/* Logo */}
          <div className="flex justify-center mb-7">
            <img src={logoSvg} alt="Elevate Skill" className="h-8 dark:brightness-0 dark:invert" />
          </div>

          <div className="text-center mb-7">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-2">Join the learning platform</p>
          </div>

          <AnimatePresence mode="wait">
            {msg && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`mb-5 p-3.5 rounded-xl text-xs font-bold flex items-center gap-3 border ${
                  msg.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                }`}
              >
                {msg.type === 'error' ? <TriangleAlert size={16} /> : <div className="size-2 bg-green-500 rounded-full animate-ping" />}
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Full Name</span>
              <div className="relative">
                <IdCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="full_name" 
                  value={form.full_name} 
                  onChange={onChange} 
                  required 
                  placeholder="Enter your full name" 
                  className="w-full pl-10 pr-3.5 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 focus:border-[#15c8fb]/50 rounded-xl outline-none transition-all dark:text-white text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-white/20" 
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Username</span>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="username" 
                  value={form.username} 
                  onChange={onChange} 
                  required 
                  placeholder="Choose a username" 
                  className="w-full pl-10 pr-3.5 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 focus:border-[#15c8fb]/50 rounded-xl outline-none transition-all dark:text-white text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-white/20" 
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Email</span>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={onChange} 
                  required 
                  placeholder="your@email.com" 
                  className="w-full pl-10 pr-3.5 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 focus:border-[#15c8fb]/50 rounded-xl outline-none transition-all dark:text-white text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-white/20" 
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="password" 
                  type="password"
                  value={form.password} 
                  onChange={onChange} 
                  required 
                  placeholder="Create a password" 
                  className="w-full pl-10 pr-3.5 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 focus:border-[#15c8fb]/50 rounded-xl outline-none transition-all dark:text-white text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-white/20" 
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1.5 block">Confirm Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="confirm_password" 
                  type="password"
                  value={form.confirm_password} 
                  onChange={onChange} 
                  required 
                  placeholder="Repeat your password" 
                  className="w-full pl-10 pr-3.5 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 focus:border-[#15c8fb]/50 rounded-xl outline-none transition-all dark:text-white text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-white/20" 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="md:col-span-2 w-full bg-gradient-to-r from-[#15c8fb] to-[#f89f29] hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 text-white py-3.5 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 shadow-2xl shadow-[#15c8fb]/20 hover:scale-[1.02] active:scale-[0.97] transition-all mt-2"
            >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Already have an account? <Link to="/login" className="text-[#15c8fb] hover:text-[#0fa3d4] ml-1 transition-colors">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
