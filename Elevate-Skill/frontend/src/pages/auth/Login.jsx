import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ArrowRight, Lock, ShieldCheck, Terminal,
  Fingerprint, AlertCircle, TriangleAlert, Eye, EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoJpg from '../../assets/logo.jpg';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2070",
    title: "Airspace",
    subtitle: "Autonomous systems & drone engineering",
    color: "#15c8fb"
  },
  {
    url: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2070",
    title: "Graphics",
    subtitle: "Visual computing & real-time rendering",
    color: "#f89f29"
  },
  {
    url: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2070",
    title: "Web Dev",
    subtitle: "Full-stack systems & modern architectures",
    color: "#15c8fb"
  },
  {
    url: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070",
    title: "IoT",
    subtitle: "Connected devices & embedded intelligence",
    color: "#f89f29"
  }
];

export default function Login() {
  const [current, setCurrent] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login({ username, password });
      if (user?.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const data = err?.response?.data;
      if (data?.detail) {
        setError(data.detail);
      } else if (typeof data === 'object') {
        const key = Object.keys(data)[0];
        const val = data[key];
        setError(Array.isArray(val) ? val[0] : val);
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#020202] text-slate-900 dark:text-white overflow-hidden font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-black">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-[1]" />

        <div className="relative z-10 p-12 xl:p-16 flex flex-col justify-between w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <img src={logoJpg} alt="Elevate Skill" className="w-7 h-7 rounded-lg object-cover" />
            </div>
            <span className="text-xs font-black tracking-wide text-white/80">
              Elevate<span className="text-[#15c8fb]">Skill</span>
            </span>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full"
            >
              <ShieldCheck size={12} className="text-[#15c8fb]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Secured Session</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-none">
                  <span className="text-white">{slides[current].title}</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15c8fb] via-white to-[#f89f29]">Terminal.</span>
                </h2>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={current + "sub"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base text-white/60 font-medium max-w-md leading-relaxed"
              >
                {slides[current].subtitle}. Sign in to continue your engineering journey.
              </motion.p>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-gradient-to-r from-[#15c8fb] to-[#f89f29]' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
              <span className="text-[10px] font-mono text-white/30 ml-2">
                0{current + 1}/0{slides.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
              <Fingerprint size={24} className="text-[#15c8fb]/60" />
            </div>
            <div className="text-[10px] text-white/40 font-mono">
              <p className="font-bold uppercase tracking-widest text-white/50">Encrypted Link</p>
              <p className="text-[#f89f29] text-xs">TLS 1.3 · AES-256</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#15c8fb]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/5 dark:shadow-black/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15c8fb] via-[#f89f29] to-[#15c8fb]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f89f29]/20 to-[#15c8fb]/20 border border-[#15c8fb]/20 flex items-center justify-center">
                <img src={logoJpg} alt="Elevate Skill" className="w-7 h-7 rounded-lg object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                  Welcome Back
                </h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  Sign in to your account
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-5 p-3.5 rounded-xl text-sm font-semibold flex items-start gap-3 border bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
                >
                  <TriangleAlert size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">Username</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15c8fb] transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.10] rounded-xl focus:outline-none focus:border-[#15c8fb]/60 focus:ring-2 focus:ring-[#15c8fb]/15 transition-all dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-[10px] font-bold text-[#15c8fb] hover:text-[#f89f29] transition-colors tracking-wide">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15c8fb] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.10] rounded-xl focus:outline-none focus:border-[#15c8fb]/60 focus:ring-2 focus:ring-[#15c8fb]/15 transition-all dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 dark:border-white/20 bg-transparent text-[#15c8fb] focus:ring-[#15c8fb]/30 focus:ring-2 accent-[#15c8fb]"
                />
                <label htmlFor="remember" className="text-[11px] font-bold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#15c8fb] to-[#0fa3d4] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#15c8fb]/25 hover:shadow-[#15c8fb]/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2.5"
              >
                {submitting ? (
                  <span className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/[0.06] text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#f89f29] hover:text-[#e08e1f] transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
