import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ArrowRight, Lock, ShieldCheck,
  Fingerprint, TriangleAlert, Eye, EyeOff,
  Github, Chrome, Twitter, CheckCircle2, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoJpg from '../../assets/logo.jpg';

const slides = [
  { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070', title: 'Learn & Build', subtitle: 'Project-based courses in AI, Web, and Embedded Systems', color: '#5A2DA8' },
  { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070', title: 'Mentor Match', subtitle: 'Connect with top engineers from ASTU and beyond', color: '#3A3992' },
  { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070', title: 'Earn & Certify', subtitle: 'Complete projects, earn certificates, level up your career', color: '#5A2DA8' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070', title: 'Join Network', subtitle: "Be part of Ethiopia's elite engineering community", color: '#3A3992' }
];

const socialLogins = [
  { icon: Github, label: 'GitHub', color: '#181717' },
  { icon: Chrome, label: 'Google', color: '#DB4437' },
  { icon: Twitter, label: 'X', color: '#000000' }
];

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (pwd.length >= 12) s++;
  if (s <= 1) return { score: s, label: 'Weak', color: '#EF4444' };
  if (s === 2) return { score: s, label: 'Fair', color: '#3A3992' };
  if (s === 3) return { score: s, label: 'Good', color: '#3B82F6' };
  return { score: s, label: 'Strong', color: '#10B981' };
};

export default function Login() {
  const [current, setCurrent] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const t = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    const r = localStorage.getItem('elevate_remembered_user');
    if (r) { setUsername(r); setRememberMe(true); }
  }, []);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const user = await login({ username, password });
      if (rememberMe) localStorage.setItem('elevate_remembered_user', username);
      else localStorage.removeItem('elevate_remembered_user');
      setSuccess(true);
      const role = user?.role?.toLowerCase();
      localStorage.setItem('elevate_user_role', role || 'student');
      setTimeout(() => {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }, 700);
    } catch (err) {
      const data = err?.response?.data;
      if (data?.detail) setError(data.detail);
      else if (typeof data === 'object' && data !== null) {
        const k = Object.keys(data)[0];
        const v = data[k];
        setError(Array.isArray(v) ? v[0] : v);
      } else setError(err?.message || 'Invalid username or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f0f4f8] via-[#e6ebf3] to-[#d1d9e8]    text-slate-900  overflow-hidden font-sans relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ rotate: 360, scale: [1, 1.05, 1] }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }} className="absolute -top-40 -left-40 w-[600px] h-[600px] border border-[#5A2DA8]/10 rounded-full" />
        <motion.div animate={{ rotate: -360, scale: [1, 1.08, 1] }} transition={{ duration: 140, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-60 -right-60 w-[700px] h-[700px] border border-[#3A3992]/10 rounded-full" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#5A2DA8]/10 rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-[#3A3992]/10 rounded-full blur-[150px]" />
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-[#5A2DA8]/40" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }} animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>

      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-black">
        <motion.div animate={{ opacity: [0.2, 0.5, 0.3, 0.6, 0.2], scale: [1, 1.03, 0.98, 1.02, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 shadow-[inset_0_0_100px_rgba(91,33,182,0.2),inset_0_0_250px_rgba(245,158,11,0.12),inset_0_0_400px_rgba(0,0,0,0.3)] z-[2] pointer-events-none" />
        <AnimatePresence mode="popLayout">
          <motion.img key={current} src={slides[current].url} alt={slides[current].title} initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1.05, x: [0, -8, 0, 8, 0] }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 w-full h-full object-cover blur-md" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[length:10px_10px] z-[1]" />

        <div className="relative z-10 p-6 xl:p-10 flex flex-col justify-between h-full w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 15 }} className="flex items-center gap-4">
            <div className="relative w-[6rem] h-[6rem] rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute w-[120%] h-[120%] bg-gradient-to-r from-[#EE8433]/20 via-transparent to-[#5A2DA8]/20 rounded-full" />
              <img src={logoJpg} alt="Elevate Skill" className="w-[4.5rem] h-[4.5rem] rounded-2xl object-cover shadow-inner relative z-10" />
            </div>
            <div>
              <span className="text-4xl xl:text-5xl font-black tracking-[-2px] text-white drop-shadow-2xl">Elevate<span className="text-[#5A2DA8]">Skill</span></span>
              <p className="text-white/60 text-xs font-mono tracking-[3px] -mt-1">PLATFORM</p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-3xl border border-white/30 rounded-2xl">
              <ShieldCheck size={18} className="text-[#5A2DA8]" />
              <span className="text-xs font-bold uppercase tracking-[2px] text-white/90">Enterprise Grade Security</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
                <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-[-2px] leading-none">
                  <span className="text-white block">{slides[current].title}</span>
                  <span className="bg-gradient-to-r from-[#EE8433] via-white to-[#5A2DA8] bg-clip-text text-transparent block">ELEVATE SKILL</span>
                </h2>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p key={current + 's'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-lg text-white/80 max-w-md leading-tight">{slides[current].subtitle}</motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-3 pt-4">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-700 ${i === current ? 'w-12 bg-gradient-to-r from-[#EE8433] to-[#5A2DA8] shadow-lg shadow-[#EE8433]/50' : 'w-6 bg-white/40 hover:bg-white/70'}`} />
              ))}
              <span className="ml-4 font-mono text-xs text-white/50 tracking-widest">{String(current + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl">
              <Fingerprint size={22} className="text-[#5A2DA8]" />
            </div>
            <div className="text-xs font-mono leading-tight">
              <p className="text-white/80 font-semibold">ELEVATE PLATFORM</p>
              <p className="text-[#3A3992]">TLS 1.3 • AES-256 • Project-Based</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EE8433]/5 via-transparent to-[#5A2DA8]/5 pointer-events-none" />

        <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80  backdrop-blur border border-gray-200  text-gray-700  hover:bg-white :bg-white/20 transition-all text-sm font-bold shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
          Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-3xl border border-[#EE8433]/20 rounded-3xl p-8 md:p-10 shadow-2xl shadow-[#EE8433]/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#EE8433]/5 via-transparent to-[#5A2DA8]/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EE8433] via-[#5A2DA8] to-[#EE8433]" />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#EE8433] to-[#5A2DA8] shadow-xl shadow-[#EE8433]/30 flex items-center justify-center mb-4"
              >
                <span className="text-3xl font-black text-white">ES</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EE8433]/10 border border-[#EE8433]/20 mb-3"
              >
                <span className="text-[10px] font-black tracking-[0.3em] text-[#EE8433] uppercase">ELEVATE</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl font-black tracking-tighter"
              >
                <span className="text-[#EE8433]">Elevate</span>
                <span className="text-[#5A2DA8]">Skill</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-gray-500 mt-2 text-sm"
              >
                Sign in to continue your journey
              </motion.p>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 border border-red-200  bg-[#FEF0EE]  text-red-700 ">
                  <TriangleAlert size={20} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 border border-green-200  bg-green-50  text-green-700 ">
                  <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                  <span>Authenticated! Redirecting to your dashboard...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ">Username / Email</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400  group-focus-within:text-[#5A2DA8] transition-all" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="your@domain.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white .06] border border-gray-200 .12] rounded-2xl focus:border-[#5A2DA8] focus:ring-2 focus:ring-[#5A2DA8]/20 transition-all duration-300 text-base placeholder:text-gray-400 :text-white/30 "
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#5A2DA8] hover:text-[#EE8433] font-medium transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400  group-focus-within:text-[#5A2DA8] transition-all" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white .06] border border-gray-200 .12] rounded-2xl focus:border-[#5A2DA8] focus:ring-2 focus:ring-[#5A2DA8]/20 transition-all duration-300 text-base placeholder:text-gray-400 :text-white/30 "
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400  hover:text-gray-600 :text-white/60">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1 rounded-full bg-gray-200  overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(strength.score / 4) * 100}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: strength.color }}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 accent-[#5A2DA8] rounded" />
                  <span className="text-gray-500 ">Keep me signed in</span>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.985 }}
                type="submit"
                disabled={submitting || success}
                className="w-full py-4 bg-gradient-to-r from-[#3A3992] via-[#D95C4A] to-[#5A2DA8] text-white font-bold text-base rounded-2xl shadow-xl shadow-[#3A3992]/30 hover:shadow-[#3A3992]/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 animate-glow-pulse"
              >
                {submitting ? (
                  <><Loader2 size={20} className="animate-spin" /> Authenticating...</>
                ) : success ? (
                  <><CheckCircle2 size={20} /> Success</>
                ) : (
                  <>Sign In Securely <ArrowRight size={20} /></>
                )}
              </motion.button>
            </form>

            <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-gray-200">
              <a href="https://t.me/elevateskill" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#EE8433]/10 text-[#EE8433] hover:bg-[#EE8433] hover:text-white transition-all border border-[#EE8433]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
              </a>
              <a href="https://instagram.com/elevateskill.1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#EE8433]/10 text-[#EE8433] hover:bg-[#EE8433] hover:text-white transition-all border border-[#EE8433]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                New here?{' '}
                <Link to="/register" className="font-bold text-[#EE8433] hover:text-[#D95C4A] transition-colors">
                  Create an account →
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            <span>🔒 GDPR</span>
            <span>🛡 ISO 27001</span>
            <span>✓ SOC 2</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
