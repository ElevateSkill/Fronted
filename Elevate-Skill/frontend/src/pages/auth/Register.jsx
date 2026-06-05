import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Mail, Lock, User, IdCard, Phone,
  ArrowRight, TriangleAlert, Sparkles, Eye, EyeOff, CheckCircle,
  BookOpen, Upload, Loader
} from 'lucide-react';
import logoJpg from '../../assets/logo.jpg';

function InputField({ name, label, type = 'text', Icon, placeholder, span = false, showToggle = false, form, onChange }) {
  const [localShow, setLocalShow] = useState(false);
  const isShowable = showToggle && type === 'password';
  const inputType = isShowable ? (localShow ? 'text' : 'password') : type;

  return (
    <div className={span ? 'md:col-span-2' : ''}>
      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">{label}</label>
      <div className="relative group">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15c8fb] transition-colors" />
        )}
        <input
          name={name}
          type={inputType}
          value={form[name]}
          onChange={onChange}
          required
          autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : 'off'}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} ${isShowable ? 'pr-10' : 'pr-3.5'} py-3 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.10] rounded-xl focus:outline-none focus:border-[#15c8fb]/60 focus:ring-2 focus:ring-[#15c8fb]/15 transition-all dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/30`}
        />
        {isShowable && (
          <button
            type="button"
            onClick={() => setLocalShow(!localShow)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {localShow ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    username: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [msg, setMsg] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get('courseId');
    if (courseId) setSelectedCourseId(courseId);
  }, []);

  useEffect(() => {
    api.get('/courses/')
      .then(res => setCourses(res.data))
      .catch(() => {});
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (!selectedCourseId) {
      setMsg({ type: 'error', text: 'Please select a course.' });
      return;
    }

    if (!proofFile) {
      setMsg({ type: 'error', text: 'Please upload payment proof.' });
      return;
    }

    if (proofFile.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Proof file is too large. Max 5MB.' });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      setStep('Creating account...');
      const { confirm_password: _cf, ...payload } = form;
      const regResult = await registerUser(payload);
      const userId = regResult?.user;

      if (!userId) {
        throw new Error('Registration failed');
      }

      setStep('Enrolling in course...');
      const enrollRes = await api.post('/enrollments/', { course: Number(selectedCourseId) });
      const enrollmentId = enrollRes.data?.id;

      setStep('Submitting payment proof...');
      const formData = new FormData();
      formData.append('enrollment_id', enrollmentId);
      formData.append('proof_file', proofFile);
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('phone', form.phone_number);
      await api.post('/payments/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const role = regResult?.user?.role || 'student';
      navigate(role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMessage = 'Something went wrong. Please try again.';

      if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        const val = errorData[firstKey];
        errorMessage = Array.isArray(val) ? val[0] : val;
        if (firstKey === 'detail') errorMessage = val;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setMsg({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#020202] overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
          alt="Learning"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 rounded-full mb-6">
                <Sparkles size={12} className="text-[#f89f29]" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Register & Enroll</span>
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.05] tracking-tight">
                JOIN + ENROLL<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#15c8fb] to-[#f89f29]">ONE STEP</span>
              </h1>
              <p className="text-base text-white/60 font-medium leading-relaxed max-w-md mt-5">
                Create your account, pick a course, and submit payment — all in one go.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-6">
              {['Register', 'Enroll', 'Pay'].map((tag, i) => (
                <span key={tag} className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                  {tag}{i < 2 ? ' →' : ''}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-[10px] text-white/30 font-mono">
            Elevate Skill · Project-Based Platform
          </motion.p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#15c8fb]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-[#f89f29]/10 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/5 dark:shadow-black/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15c8fb] via-[#f89f29] to-[#15c8fb]" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f89f29]/20 to-[#15c8fb]/20 border border-[#15c8fb]/20 flex items-center justify-center">
                <img src={logoJpg} alt="Elevate Skill" className="w-7 h-7 rounded-lg object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                  Register & Enroll
                </h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                  Account + Course + Payment — one form
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {msg && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`mb-5 p-3.5 rounded-xl text-sm font-semibold flex items-start gap-3 border ${
                    msg.type === 'success'
                      ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                      : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                  }`}
                >
                  {msg.type === 'error' ? (
                    <TriangleAlert size={16} className="shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  )}
                  <span>{msg.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="full_name" label="Full Name" Icon={IdCard} placeholder="Enter your full name" span form={form} onChange={onChange} />
              <InputField name="username" label="Username" Icon={User} placeholder="Choose a username" form={form} onChange={onChange} />
              <InputField name="phone_number" label="Phone Number" type="tel" Icon={Phone} placeholder="+251 911 234 567" form={form} onChange={onChange} />
              <InputField name="email" label="Email Address" type="email" Icon={Mail} placeholder="your@email.com" span form={form} onChange={onChange} />
              <InputField name="password" label="Password" type="password" Icon={Lock} placeholder="Create a password" showToggle form={form} onChange={onChange} />
              <InputField name="confirm_password" label="Confirm Password" type="password" Icon={Lock} placeholder="Repeat your password" showToggle form={form} onChange={onChange} />

              <div className="md:col-span-2 border-t border-gray-200 dark:border-white/[0.06] pt-4 mt-1">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#f89f29]" /> Select Course &amp; Submit Payment
                </p>
              </div>

              <div className="md:col-span-2 relative">
                <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-3 bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.10] rounded-xl focus:outline-none focus:border-[#f89f29]/60 focus:ring-2 focus:ring-[#f89f29]/15 transition-all dark:text-white text-sm appearance-none"
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} {c.price ? `- ${c.price}` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={`flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 dark:border-white/[0.10] rounded-xl cursor-pointer hover:border-[#f89f29]/50 transition-all bg-gray-50 dark:bg-white/[0.06] group ${proofFile ? 'border-green-400 dark:border-green-500/50 bg-green-50 dark:bg-green-500/5' : ''}`}>
                  <Upload size={18} className="text-gray-400 group-hover:text-[#f89f29] transition-colors shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {proofFile ? proofFile.name : 'Upload payment proof (PDF, JPG, PNG)'}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-white/30">Max 5MB</p>
                  </div>
                  {proofFile && <CheckCircle size={16} className="text-green-500 shrink-0" />}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={e => {
                      const f = e.target.files[0];
                      if (f) setProofFile(f);
                    }}
                  />
                </label>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="md:col-span-2 w-full bg-gradient-to-r from-[#f89f29] to-[#e08e1f] text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#f89f29]/25 hover:shadow-[#f89f29]/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2.5 mt-2 py-3.5"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <Loader size={16} className="animate-spin" />
                    {step || 'Processing...'}
                  </span>
                ) : (
                  <>
                    Register & Enroll
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/[0.06] text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#f89f29] hover:text-[#e08e1f] transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
