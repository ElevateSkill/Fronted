import React, { useState, useEffect, useRef } from 'react';
import { login } from '../../services/api'; 
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle 
} from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleAuthSuccess = (resData) => {
    const { access, refresh, user } = resData;
    
    // 1. Critical: Save data so RootRedirect can read it
    localStorage.setItem('access', access);
    if (refresh) localStorage.setItem('refresh', refresh);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    if (isMounted.current) {
      setMsg({ type: 'success', text: 'Identity verified. Accessing system...' });
    }

    // 2. Redirect to Root. RootRedirect in App.jsx handles the role-based logic.
    setTimeout(() => {
      // Use replace: true to prevent the user from clicking "back" into the login page
      navigate('/', { replace: true });
    }, 1000);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/google/`, 
          { access_token: tokenResponse.access_token }
        );
        handleAuthSuccess(res.data);
      } catch (err) {
        setMsg({ type: 'error', text: 'Google Authentication Failed' });
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await login(form);
      handleAuthSuccess(res.data);
    } catch (err) {
      const text = err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || "Access Denied";
      setMsg({ type: 'error', text: text });
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 bg-red-600 rounded-2xl mb-6 shadow-lg shadow-red-600/20">
            <HiOutlineShieldCheck className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">System Access</h2>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-2">Hachalu Protocol Suite</p>
        </div>

        <AnimatePresence mode="wait">
          {msg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border ${
                msg.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {msg.type === 'error' ? <HiOutlineExclamationTriangle size={18} /> : <div className="size-2 bg-green-500 rounded-full animate-ping" />}
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative group">
            <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              name="email" 
              type="email"
              value={form.email} 
              onChange={onChange} 
              required 
              placeholder="System Email" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-red-600/30 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm" 
            />
          </div>

          <div className="relative group">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              name="password" 
              type="password"
              value={form.password} 
              onChange={onChange} 
              required 
              placeholder="Access Key" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-red-600/30 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm" 
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 transition-all active:scale-[0.98]"
          >
            {loading ? 'Validating...' : <>Authorize Entry <HiOutlineArrowRight /></>}
          </button>
        </form>

        <div className="mt-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100 dark:border-white/5"></span></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black"><span className="bg-white dark:bg-[#0c0c0c] px-4 text-gray-400">External Node Entry</span></div>
          </div>

          <button 
            onClick={() => googleLogin()}
            type="button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-4 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-black text-xs uppercase tracking-tighter text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
          New to Protocol? <Link to="/register" className="text-red-600 hover:underline">Register Identity</Link>
        </p>
      </motion.div>
    </div>
  );
}