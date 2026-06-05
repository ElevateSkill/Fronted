import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ArrowRight, Lock, ShieldCheck,
  Fingerprint, TriangleAlert, Eye, EyeOff,
  Github, Twitter, Chrome
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoJpg from '../../assets/logo.jpg';

const slides = [
  {
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070",
    title: "Learn & Build",
    subtitle: "Project-based courses in AI, Web, and Embedded Systems",
    color: "#15c8fb"
  },
  {
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070",
    title: "Mentor Match",
    subtitle: "Connect with top engineers from ASTU and beyond",
    color: "#f89f29"
  },
  {
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070",
    title: "Earn & Certify",
    subtitle: "Complete projects, earn certificates, level up your career",
    color: "#15c8fb"
  },
  {
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
    title: "Join Network",
    subtitle: "Be part of Ethiopia's elite engineering community",
    color: "#f89f29"
  }
];

const socialLogins = [
  { icon: Github, label: "GitHub", color: "#181717" },
  { icon: Chrome, label: "Google", color: "#DB4437" },
  { icon: Twitter, label: "X", color: "#000000" },
];

export default function Login() {
  const [current, setCurrent] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-slide with pause on hover
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login({ username, password });

      // Success animation trigger (can be extended)
      if (user?.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const data = err?.response?.data;
      if (data?.detail) {
        setError(data.detail);
      } else if (typeof data === 'object' && data !== null) {
        const key = Object.keys(data)[0];
        const val = data[key];
        setError(Array.isArray(val) ? val[0] : val);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f0f4f8] via-[#e6ebf3] to-[#d1d9e8] dark:from-[#0a0a0a] dark:via-[#020202] dark:to-[#111111] text-slate-900 dark:text-white overflow-hidden font-sans relative">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] border border-[#15c8fb]/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.08, 1] }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-60 -right-60 w-[700px] h-[700px] border border-[#f89f29]/10 rounded-full"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#15c8fb]/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-[#f89f29]/10 rounded-full blur-[150px]"
        />
      </div>

      {/* LEFT PANEL - Enhanced Carousel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-black">
        {/* Animated deep shadow glow on background */}
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
            scale: [1, 1.03, 0.98, 1.02, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 shadow-[inset_0_0_100px_rgba(21,200,251,0.2),inset_0_0_250px_rgba(248,159,41,0.12),inset_0_0_400px_rgba(0,0,0,0.3)] z-[2] pointer-events-none"
        />
        <AnimatePresence mode="popLayout">
          <motion.img
            key={current}
            src={slides[current].url}
            alt={slides[current].title}
            initial={{ opacity: 0, scale: 1.15, filter: "brightness(0.4) saturate(0.6)" }}
            animate={{
              opacity: 1,
              scale: 1.05,
              filter: "brightness(0.85) saturate(1.1)",
              x: [0, -8, 0, 8, 0]
            }}
            exit={{ opacity: 0, scale: 0.85, filter: "brightness(0.3) saturate(0.5)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Animated deep shadow overlay for depth */}
        <motion.div
          animate={{
            opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90 z-[1]"
        />
        <motion.div
          animate={{
            opacity: [0.4, 0.6, 0.3, 0.5, 0.4],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-[1]"
        />
        <motion.div
          animate={{
            boxShadow: [
              "inset 0 0 100px rgba(0,0,0,0.6), inset 0 0 300px rgba(0,0,0,0.3)",
              "inset 0 0 150px rgba(0,0,0,0.8), inset 0 0 400px rgba(0,0,0,0.4)",
              "inset 0 0 80px rgba(0,0,0,0.5), inset 0 0 250px rgba(0,0,0,0.3)",
              "inset 0 0 100px rgba(0,0,0,0.6), inset 0 0 300px rgba(0,0,0,0.3)",
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-[1] pointer-events-none"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[length:10px_10px] z-[1]" />

        <div className="relative z-10 p-6 xl:p-10 flex flex-col justify-between h-full w-full">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="flex items-center gap-4"
          >
            <div className="relative w-[17rem] h-[17rem] rounded-[3.5rem] bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#15c8fb]/30 to-[#f89f29]/20 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[120%] h-[120%] bg-gradient-to-r from-[#15c8fb]/20 via-transparent to-[#f89f29]/20 rounded-full"
              />
              <motion.img
                src={logoJpg}
                alt="Elevate Skill"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-[14.5rem] h-[14.5rem] rounded-3xl object-cover shadow-inner relative z-10"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <span className="text-6xl xl:text-7xl font-black tracking-[-3px] text-white drop-shadow-2xl">
                Elevate<span className="text-[#15c8fb]">Skill</span>
              </span>
              <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4], letterSpacing: ["3px", "5px", "3px"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-white/60 text-sm font-mono tracking-[3px] -mt-1"
              >
                PLATFORM
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Dynamic Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-3xl border border-white/30 rounded-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ShieldCheck size={18} className="text-[#15c8fb]" />
              </motion.div>
              <span className="text-xs font-bold uppercase tracking-[2px] text-white/90">Enterprise Grade Security</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-4xl xl:text-5xl font-black uppercase tracking-[-2px] leading-none">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white"
                  >
                    {slides[current].title}
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-[#15c8fb] via-white to-[#f89f29] bg-clip-text text-transparent"
                  >
                    ELEVATE SKILL
                  </motion.span>
                </h2>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={current + "sub"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-lg text-white/80 max-w-md leading-tight"
              >
                {slides[current].subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="flex items-center gap-3 pt-4">
              {slides.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-1.5 rounded-full transition-all duration-700 ${i === current
                    ? 'w-12 bg-gradient-to-r from-[#15c8fb] to-[#f89f29] shadow-lg shadow-[#15c8fb]/50'
                    : 'w-6 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-4 font-mono text-xs text-white/50 tracking-widest"
              >
                {String(current + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
              </motion.span>
            </div>
          </div>

          {/* Footer Security Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Fingerprint size={22} className="text-[#15c8fb]" />
              </motion.div>
            </motion.div>
            <div className="text-xs font-mono leading-tight">
              <p className="text-white/80 font-semibold">ELEVATE PLATFORM</p>
              <p className="text-[#f89f29]">TLS 1.3 • AES-256 • Project-Based</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Enhanced Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-br from-[#15c8fb]/5 via-transparent to-[#f89f29]/5 bg-[length:200%_200%] pointer-events-none"
        />
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-white dark:hover:bg-white/20 transition-all text-sm font-bold shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/10 dark:shadow-black/60 relative overflow-hidden">
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15c8fb] via-[#f89f29] to-[#15c8fb]" />

            {/* Header */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f89f29]/10 to-[#15c8fb]/10 border border-[#15c8fb]/20 flex items-center justify-center flex-shrink-0">
                <img src={logoJpg} alt="Elevate Skill" className="w-16 h-16 rounded-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">Welcome back</h1>
                <p className="text-gray-500 dark:text-white/60 mt-1">Sign in to continue your journey</p>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                >
                  <TriangleAlert size={20} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-white/70">Username / Email</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 group-focus-within:text-[#15c8fb] transition-all" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="your@domain.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.12] rounded-2xl focus:border-[#15c8fb] focus:ring-2 focus:ring-[#15c8fb]/20 transition-all duration-300 text-base placeholder:text-gray-400 dark:placeholder:text-white/30 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-white/70">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#15c8fb] hover:text-[#0fa3d4] font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 group-focus-within:text-[#15c8fb] transition-all" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.12] rounded-2xl focus:border-[#15c8fb] focus:ring-2 focus:ring-[#15c8fb]/20 transition-all duration-300 text-base placeholder:text-gray-400 dark:placeholder:text-white/30 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#15c8fb] rounded"
                  />
                  <span className="text-gray-500 dark:text-white/70">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-[#15c8fb] via-[#0fa3d4] to-[#15c8fb] text-white font-semibold text-base rounded-2xl shadow-xl shadow-[#15c8fb]/30 hover:shadow-[#15c8fb]/50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In Securely
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-8 relative flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/20 to-transparent" />
              <span className="px-6 text-xs uppercase tracking-widest text-gray-400 dark:text-white/50 font-mono">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/20 to-transparent" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-3">
              {socialLogins.map((social, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => alert(`Login with ${social.label} (demo)`)}
                  className="h-12 border border-gray-200 dark:border-white/15 rounded-2xl flex items-center justify-center gap-2 hover:border-gray-300 dark:hover:border-white/30 transition-colors bg-white dark:bg-white/[0.03]"
                >
                  <social.icon size={20} style={{ color: social.color }} />
                </motion.button>
              ))}
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-white/60">
                New here?{' '}
                <Link to="/register" className="font-semibold text-[#f89f29] hover:text-orange-500 transition-colors">
                  Create an account →
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 flex justify-center gap-8 text-[10px] text-gray-400 dark:text-white/40 font-mono">
            <div>GDPR</div>
            <div>ISO 27001</div>
            <div>SOC 2</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}