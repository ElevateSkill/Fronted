import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Mail, Lock, User, IdCard, Phone,
  ArrowRight, TriangleAlert, Sparkles, Eye, EyeOff,
  CheckCircle, BookOpen, Upload, Loader, Check,
  AlertTriangle, ShieldCheck
} from 'lucide-react';
import logoJpg from '../../assets/logo.jpg';

const steps = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Course & Payment" }
];

function InputField({ name, label, type = 'text', Icon, placeholder, span = false, showToggle = false, form, onChange }) {
  const [localShow, setLocalShow] = useState(false);
  const isShowable = showToggle && type === 'password';
  const inputType = isShowable ? (localShow ? 'text' : 'password') : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={span ? 'md:col-span-2' : ''}
    >
      <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1 block uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15c8fb] transition-all duration-300"
          />
        )}
        <input
          name={name}
          type={inputType}
          value={form[name]}
          onChange={onChange}
          required
          autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : 'off'}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} ${isShowable ? 'pr-11' : 'pr-4'} py-3.5 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:border-[#15c8fb] focus:ring-2 focus:ring-[#15c8fb]/20 transition-all duration-300 text-base placeholder:text-gray-400 dark:placeholder:text-white/30`}
        />
        {isShowable && (
          <button
            type="button"
            onClick={() => setLocalShow(!localShow)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {localShow ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    email: '', full_name: '', username: '', phone_number: '',
    password: '', confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [msg, setMsg] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [proofFile, setProofFile] = useState(null);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  // Pre-fill course if coming from link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');
    if (courseId) setSelectedCourseId(courseId);
  }, []);

  useEffect(() => {
    api.get('/courses/')
      .then(res => setCourses(res.data))
      .catch(() => { });
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

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

    setLoading(true);

    try {
      setStep('Creating your account...');
      const { confirm_password: _, ...payload } = form;
      const regResult = await registerUser(payload);
      const userId = regResult?.user?.id || regResult?.user;

      setStep('Enrolling you in the course...');
      const enrollRes = await api.post('/enrollments/', { course: Number(selectedCourseId) });
      const enrollmentId = enrollRes.data?.id;

      setStep('Uploading payment proof...');
      const formData = new FormData();
      formData.append('enrollment_id', enrollmentId);
      formData.append('proof_file', proofFile);
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('phone', form.phone_number);

      await api.post('/payments/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMsg({ type: 'success', text: 'Registration successful! Welcome aboard 🎉' });

      setTimeout(() => {
        const role = regResult?.user?.role || 'student';
        navigate(role.toLowerCase() === 'admin' ? '/admin' : '/dashboard');
      }, 1800);
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMessage = 'Something went wrong. Please try again.';

      if (errorData?.detail) errorMessage = errorData.detail;
      else if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        const val = errorData[firstKey];
        errorMessage = Array.isArray(val) ? val[0] : val;
      }

      setMsg({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f0f4f8] via-[#e6ebf3] to-[#d1d9e8] dark:from-[#0a0a0a] dark:via-[#020202] dark:to-[#111111] overflow-hidden font-sans relative">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          className="absolute -top-52 -left-52 w-[700px] h-[700px] border border-[#15c8fb]/10 rounded-full" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-64 -right-64 w-[800px] h-[800px] border border-[#f89f29]/10 rounded-full" />
      </div>

      {/* LEFT BRAND PANEL - Enhanced */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070"
          alt="Learning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[length:5px_5px] z-[1]" />

        <div className="relative z-10 p-8 xl:p-12 flex flex-col justify-between h-full w-full">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5">
            <div className="relative w-[17rem] h-[17rem] rounded-[3.5rem] bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
              <img src={logoJpg} alt="Elevate Skill" className="w-[14.5rem] h-[14.5rem] rounded-3xl object-cover" />
            </div>
            <div>
              <span className="text-6xl xl:text-7xl font-black tracking-[-3px] text-white">Elevate<span className="text-[#15c8fb]">Skill</span></span>
              <p className="text-white/60 text-sm font-mono tracking-widest -mt-1">ACADEMY</p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-3xl border border-white/30 rounded-3xl">
              <Sparkles size={20} className="text-[#f89f29]" />
              <span className="text-sm font-bold uppercase tracking-widest text-white">One Form. Full Access.</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black tracking-tighter text-white leading-none">
              Start Your<br />
              <span className="bg-gradient-to-r from-[#15c8fb] via-white to-[#f89f29] bg-clip-text text-transparent">Engineering Journey</span>
            </h1>

            <p className="text-lg text-white/80 max-w-md">
              Create your account, choose a course, and complete enrollment in minutes.
            </p>

            <div className="flex gap-4">
              {['Register', 'Select Course', 'Pay & Enroll'].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-sm font-medium text-white/70 flex items-center gap-2"
                >
                  <div className="w-5 h-px bg-white/40" /> {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <ShieldCheck size={28} className="text-[#15c8fb]" />
            <div className="text-xs font-mono text-white/70">
              SECURE • ENCRYPTED • VERIFIED
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15c8fb] via-[#f89f29] to-[#15c8fb]" />

            {/* Header */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f89f29]/10 to-[#15c8fb]/10 flex items-center justify-center border border-[#15c8fb]/20">
                <img src={logoJpg} alt="Logo" className="w-16 h-16 rounded-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter">Join ElevateSkill</h1>
                <p className="text-gray-500 dark:text-gray-400">One form • Instant enrollment</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex gap-2 mb-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.id}
                  onClick={() => setCurrentStep(s.id)}
                  className={`flex-1 h-1.5 rounded-full cursor-pointer transition-all ${currentStep >= s.id ? 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29]' : 'bg-gray-200 dark:bg-white/10'}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-2xl text-sm flex gap-3 border ${msg.type === 'success'
                    ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400'
                    }`}
                >
                  {msg.type === 'success' ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
                  <span>{msg.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField name="full_name" label="Full Name" Icon={IdCard} placeholder="John Doe" form={form} onChange={onChange} />
                <InputField name="username" label="Username" Icon={User} placeholder="johndoe" form={form} onChange={onChange} />
                <InputField name="phone_number" label="Phone Number" type="tel" Icon={Phone} placeholder="+251 9XX XXX XXX" form={form} onChange={onChange} />
                <InputField name="email" label="Email Address" type="email" Icon={Mail} placeholder="you@example.com" span form={form} onChange={onChange} />
                <InputField name="password" label="Password" type="password" Icon={Lock} placeholder="••••••••" showToggle form={form} onChange={onChange} />
                <InputField name="confirm_password" label="Confirm Password" type="password" Icon={Lock} placeholder="••••••••" showToggle form={form} onChange={onChange} />
              </div>

              {/* Course & Payment Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 border-t border-gray-200 dark:border-white/10 pt-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={18} className="text-[#f89f29]" />
                  <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Course & Payment</p>
                </div>

                <div className="space-y-5">
                  <div className="relative">
                    <BookOpen size={18} className="absolute left-4 top-4 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedCourseId}
                      onChange={e => setSelectedCourseId(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:border-[#f89f29] focus:ring-2 focus:ring-[#f89f29]/20 text-base appearance-none"
                    >
                      <option value="">Select a course...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} {c.price ? `— ${c.price} ETB` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className={`group flex items-center gap-4 p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#f89f29] bg-white dark:bg-white/5 ${proofFile ? 'border-green-400 bg-green-50 dark:bg-green-500/5' : 'border-gray-200 dark:border-white/10'}`}>
                    <Upload size={28} className="text-gray-400 group-hover:text-[#f89f29] transition-colors" />
                    <div className="flex-1">
                      <p className="font-medium">{proofFile ? proofFile.name : "Upload Payment Proof"}</p>
                      <p className="text-xs text-gray-400">JPG, PNG or PDF • Max 5MB</p>
                    </div>
                    {proofFile && <CheckCircle size={24} className="text-green-500" />}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && setProofFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-gradient-to-r from-[#f89f29] via-[#e08e1f] to-[#f89f29] text-white font-semibold text-lg rounded-2xl shadow-xl shadow-[#f89f29]/30 hover:shadow-[#f89f29]/50 flex items-center justify-center gap-3 disabled:opacity-70 transition-all"
              >
                {loading ? (
                  <>
                    <Loader size={22} className="animate-spin" />
                    {step || 'Processing...'}
                  </>
                ) : (
                  <>
                    Create Account & Enroll
                    <ArrowRight size={22} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#15c8fb] hover:text-[#0fa3d4]">Sign in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}