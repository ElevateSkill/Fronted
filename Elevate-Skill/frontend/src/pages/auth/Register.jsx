import React, { useState } from 'react';
import { register } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineEnvelope, // Fixed: Using proper envelope for email
  HiOutlineLockClosed, 
  HiOutlineUser, 
  HiOutlineIdentification,
  HiOutlineUserPlus, // Fixed: More semantic icon for registration
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle 
} from 'react-icons/hi2';

export default function Register() {
  const [form, setForm] = useState({ 
    email: '', 
    full_name: '', 
    username: '', 
    password: '',
    confirm_password: '' // Added confirmation field
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend Validation: Password Match
    if (form.password !== form.confirm_password) {
      setMsg({ type: 'error', text: 'Access keys do not match.' });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      // We send everything except confirm_password to the backend
      const { confirm_password, ...payload } = form;
      await register(payload);
      
      setMsg({ type: 'success', text: 'Identity created. Synced with Protocol.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMessage = "Registration failed. Check parameters.";
      
      if (typeof errorData === 'object') {
        // Handle Django's nested error objects (e.g., { email: ["Already exists"] })
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
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 bg-black dark:bg-white/5 rounded-2xl mb-6 border border-red-600/30">
            <HiOutlineUserPlus className="text-3xl text-red-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Initialize Identity</h2>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mt-2">New Protocol Node Setup</p>
        </div>

        <AnimatePresence mode="wait">
          {msg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 border ${
                msg.type === 'success' 
                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
              }`}
            >
              {msg.type === 'error' ? <HiOutlineExclamationTriangle className="text-lg" /> : <div className="size-2 bg-green-500 rounded-full animate-ping" />}
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group md:col-span-2">
            <HiOutlineIdentification className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              name="full_name" 
              value={form.full_name} 
              onChange={onChange} 
              required 
              placeholder="Full Name" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-red-600/30 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm" 
            />
          </div>

          <div className="relative group">
            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              name="username" 
              value={form.username} 
              onChange={onChange} 
              required 
              placeholder="Username" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-red-600/30 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm" 
            />
          </div>

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

          {/* Password */}
          <div className="relative group">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              name="password" 
              type="password"
              value={form.password} 
              onChange={onChange} 
              required 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-red-600/30 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm" 
            />
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              name="confirm_password" 
              type="password"
              value={form.confirm_password} 
              onChange={onChange} 
              required 
              placeholder="Confirm Password" 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-red-600/30 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm" 
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="md:col-span-2 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? 'Processing Node...' : (
              <>Create Account <HiOutlineArrowRight className="text-lg" /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Node already registered? <Link to="/login" className="text-red-600 hover:underline ml-2">Secure Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}