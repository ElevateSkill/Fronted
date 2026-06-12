import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, ArrowRight, Lock, TriangleAlert, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login({ email, password });

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
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[red] via-[yellow] to-[red] text-slate-900 dark:from-[#07090d] dark:via-[#0a0e14] dark:to-[#111827] dark:text-white">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 z-20 flex items-center justify-center h-9 w-9 rounded-xl bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] transition-all shadow-sm" title="Go home">
        <ArrowLeft size={18} />
      </button>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.28, 0.5, 0.28] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-36 -left-36 h-[28rem] w-[28rem] bg-[#15c8fb]/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.22, 0.42, 0.22] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-36 h-[30rem] w-[30rem] bg-[#f89f29]/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          <div className="relative overflow-hidden border border-white/40 bg-white/90 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0c111b]/90 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[red] via-[yellow] to-[red]" />
            {/* <div className="absolute right-4 top-4 flex items-center gap-2 border border-[#15c8fb]/20 bg-[red]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[#0c86b3] dark:text-[#ff9d00]">
              <ShieldCheck size={12} /> Secure access
            </div> */}

            <div className="mb-8 pt-10">
              <div className="mb-4 inline-flex items-center gap-2 border border-[#15c8fb]/15 bg-[#ff9d00]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#0f9bcf] dark:text-[#ff9d00]">
                Elevate Skill
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Welcome back</h1>
              <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Sign in to continue learning, teaching, or managing your account.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
                >
                  <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Email</label>
                <div className="relative group">
                  <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#ff9d00]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="your@domain.com"
                    className="w-full border border-slate-200 bg-white px-11 py-3.5 text-base text-slate-900 outline-none transition focus:border-[#ff9d00] focus:ring-2 focus:ring-[#ff9d00]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-[#ff9d00] transition hover:text-[#ff9d02] dark:text-[red]">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#ff9d00]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full border border-slate-200 bg-white px-11 py-3.5 pr-12 text-base text-slate-900 outline-none transition focus:border-[#ff9d00] focus:ring-2 focus:ring-[#ff9d00]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 border-slate-300 text-[#241552] accent-[#f78a04]"
                  />
                  <span className="text-slate-600 dark:text-slate-300">Keep me signed in</span>
                </label>
                <Link to="/register" className="text-xs font-semibold text-[#f89f29] transition hover:text-[#e07f12]">
                  New account
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-3 bg-gradient-to-r from-[#f89f29] via-[#dc2626] to-[#f89f29] px-4 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(21,200,251,0.28)] transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin border-2 border-white/30 border-t-white" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
              <span>Fast</span>
              <span>•</span>
              <span>Clear</span>
              <span>•</span>
              <span>Secure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}