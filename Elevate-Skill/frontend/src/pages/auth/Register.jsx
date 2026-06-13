import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api, unwrapResults } from '../../services/api';
import {
  ArrowLeft, Mail, Lock, User, IdCard, Phone,
  ArrowRight, TriangleAlert, Eye, EyeOff,
  CheckCircle, BookOpen, Upload, Loader, Check,
  AlertTriangle, ShieldCheck, Building2, RefreshCw
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Profile', note: 'Who you are' },
  { id: 2, label: 'Security', note: 'Set your password' },
  { id: 3, label: 'Enroll', note: 'Choose course' },
  { id: 4, label: 'Payment', note: 'Choose payment method' }
];

function InputField({ name, label, type = 'text', Icon, placeholder, span = false, showToggle = false, form, onChange }) {
  const [localShow, setLocalShow] = useState(false);
  const isShowable = showToggle && type === 'password';
  const inputType = isShowable ? (localShow ? 'text' : 'password') : type;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={span ? 'md:col-span-2' : ''}>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[red]" />
        )}
        <input
          name={name}
          type={inputType}
          value={form[name]}
          onChange={onChange}
          required
          autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : 'off'}
          placeholder={placeholder}
           className={`w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 text-base text-white outline-none transition focus:border-[red] focus:ring-2 focus:ring-[red]/20 placeholder:text-gray-500 ${Icon ? 'pl-11' : 'pl-4'} ${isShowable ? 'pr-11' : 'pr-4'}`}
        />
        {isShowable && (
          <button
            type="button"
            onClick={() => setLocalShow(!localShow)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
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
  const [stepMessage, setStepMessage] = useState('');
  const [msg, setMsg] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(true);
  const [selectedBankId, setSelectedBankId] = useState('');
  const [userAccountNumber, setUserAccountNumber] = useState('');

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('courseId');
    if (courseId) setSelectedCourseId(courseId);
  }, []);

  useEffect(() => {
    api.get('/courses/')
      .then((res) => setCourses(unwrapResults(res.data)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setBankAccountsLoading(true);
    api.get('/bank-accounts/')
      .then((res) => setBankAccounts(unwrapResults(res.data)))
      .catch((err) => {
        console.error('Failed to fetch payment accounts:', err);
        setBankAccounts([]);
      })
      .finally(() => setBankAccountsLoading(false));
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => String(course.id) === String(selectedCourseId)),
    [courses, selectedCourseId]
  );

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateStep = (targetStep) => {
    if (targetStep === 1) {
      const requiredFields = ['full_name', 'username', 'email', 'phone_number'];
      const missing = requiredFields.find((field) => !String(form[field] || '').trim());
      if (missing) {
        setMsg({ type: 'error', text: 'Fill in your profile details before continuing.' });
        return false;
      }
    }

    if (targetStep === 2) {
      if (!form.password || !form.confirm_password) {
        setMsg({ type: 'error', text: 'Create and confirm your password to continue.' });
        return false;
      }
      if (form.password !== form.confirm_password) {
        setMsg({ type: 'error', text: 'Passwords do not match.' });
        return false;
      }
    }

    if (targetStep === 3) {
      if (!selectedCourseId) {
        setMsg({ type: 'error', text: 'Please select a course.' });
        return false;
      }
    }

    if (targetStep === 4) {
      if (!bankAccountsLoading && !bankAccounts.length) {
        setMsg({ type: 'error', text: 'No payment accounts available. Contact admin or try again later.' });
        return false;
      }
      if (!selectedBankId) {
        setMsg({ type: 'error', text: 'Please select a payment account.' });
        return false;
      }
      if (!proofFile) {
        setMsg({ type: 'error', text: 'Please upload payment proof.' });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    setMsg(null);
    if (!validateStep(currentStep)) return;
    setCurrentStep((value) => Math.min(4, value + 1));
  };

  const handleBack = () => {
    setMsg(null);
    setCurrentStep((value) => Math.max(1, value - 1));
  };

  const selectedBank = useMemo(
    () => bankAccounts.find((b) => String(b.id) === String(selectedBankId)),
    [bankAccounts, selectedBankId]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    setLoading(true);

    try {
      setStepMessage('Creating your account...');
      const { confirm_password: _, ...payload } = form;
      const regResult = await registerUser(payload);

      const role = regResult?.user?.role || 'student';
      const isAdmin = role.toLowerCase() === 'admin';

      setMsg({ type: 'success', text: 'Account created! Redirecting...' });

      if (isAdmin) {
        setTimeout(() => navigate('/admin'), 800);
        return;
      }

      try {
        setStepMessage('Enrolling you in the course...');
        const enrollRes = await api.post('/enrollments/', { course: Number(selectedCourseId) });
        const enrollmentId = enrollRes.data?.id;

        setStepMessage('Uploading payment proof...');
        const formData = new FormData();
        formData.append('enrollment_id', enrollmentId);
        formData.append('proof_file', proofFile);
        formData.append('full_name', form.full_name);
        formData.append('email', form.email);
        formData.append('phone', form.phone_number);
        formData.append('payment_method', selectedBankId);
        formData.append('user_account_number', userAccountNumber.trim());

        await api.post('/payments/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } catch (enrollErr) {
        // Registration succeeded; enrollment/payment failure is secondary
        console.error('Enrollment/payment error:', enrollErr);
      }

      setTimeout(() => navigate('/dashboard?registered=true'), 800);
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
      setStepMessage('');
    }
  };

  const canSubmit = currentStep === 4;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#07090d] via-[#0a0e14] to-[#111827] text-white">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 z-20 flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] transition-all shadow-sm" title="Go home">
        <ArrowLeft size={18} />
      </button>
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 140, repeat: Infinity, ease: 'linear' }} className="absolute -top-52 -left-52 h-[44rem] w-[44rem] border border-[red]/10" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-64 -right-64 h-[48rem] w-[48rem] border border-[#f89f29]/10" />
        <motion.div animate={{ opacity: [0.2, 0.35, 0.2], y: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/4 top-24 h-48 w-48 bg-[red]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-full">
          <div className="relative overflow-hidden border border-white/10 bg-[#0c111b]/90 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:p-8 md:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[red] via-[#f89f29] to-[red]" />
            <div className="mb-8 flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between">
              <div>
                {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#15c8fb]/15 bg-[#15c8fb]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#0f9bcf] dark:text-[#7edfff]">
                  <Sparkles size={14} /> 3-step registration
                </div> */}
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Join ElevateSkill</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                  Create your account, secure it, then finish enrollment in one clear flow.
                </p>
              </div>

              <div className="border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <ShieldCheck size={16} className="text-[red]" /> Secure, guided signup
                </div>
                <p className="mt-1 text-xs text-slate-400">Save time by completing the form step by step.</p>
              </div>
            </div>

            <div className="mb-8 grid gap-3 md:grid-cols-4">
              {steps.map((step) => {
                const active = currentStep === step.id;
                const completed = currentStep > step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    className={`border p-4 text-left transition ${active
                      ? 'border-[red]/35 bg-[red]/10 shadow-[0_10px_30px_rgba(21,200,251,0.12)]'
                      : completed
                        ? 'border-[#f89f29]/25 bg-[#f89f29]/10'
                        : 'border-white/10 bg-white/[0.03]'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                        {step.label}
                      </span>
                      {completed ? <Check size={16} className="text-[#f89f29]" /> : <span className="text-xs font-bold text-slate-400">0{step.id}</span>}
                    </div>
                    <p className="mt-2 text-sm font-medium text-white">{step.note}</p>
                  </button>
                );
              })}
            </div>

            <div className="mb-6 h-2 bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[red] via-[#f89f29] to-[red] transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            <AnimatePresence mode="wait">
              {msg && (
                <motion.div
                  key={msg.text}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                   className={`mb-6 flex gap-3 border p-4 text-sm ${msg.type === 'success'
                    ? 'border-green-500/30 bg-green-500/10 text-green-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}
                >
                  {msg.type === 'success' ? <CheckCircle size={20} className="mt-0.5 shrink-0" /> : <AlertTriangle size={20} className="mt-0.5 shrink-0" />}
                  <span>{msg.text}</span>
                  </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={onSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField name="full_name" label="Full Name" Icon={IdCard} placeholder="Abebe Kebede" form={form} onChange={onChange} />
                    <InputField name="username" label="Username" Icon={User} placeholder="abebekebede" form={form} onChange={onChange} />
                    <InputField name="phone_number" label="Phone Number" type="tel" Icon={Phone} placeholder="+251 9XX XXX XXX" form={form} onChange={onChange} />
                    <InputField name="email" label="Email Address" type="email" Icon={Mail} placeholder="abebe@example.com" span form={form} onChange={onChange} />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField name="password" label="Password" type="password" Icon={Lock} placeholder="••••••••" showToggle form={form} onChange={onChange} />
                    <InputField name="confirm_password" label="Confirm Password" type="password" Icon={Lock} placeholder="••••••••" showToggle form={form} onChange={onChange} />

                    <div className="md:col-span-2 border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
                      <p className="font-semibold text-white">Password tips</p>
                      <p className="mt-1">Use a password you can remember and keep it private. You will use it to sign in later.</p>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Course</label>
                        <div className="relative">
                          <BookOpen size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full appearance-none border border-white/10 bg-white/[0.04] py-4 pl-11 pr-4 text-base text-white outline-none transition focus:border-[#f89f29] focus:ring-2 focus:ring-[#f89f29]/20"
                          >
                            <option value="">Select a course...</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title} {course.price ? `— ${course.price} ETB` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Name</p>
                        <p className="mt-2 font-semibold text-white">{form.full_name || 'Not set'}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Course</p>
                        <p className="mt-2 font-semibold text-white">{selectedCourse?.title || 'Not selected'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step-4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5">
                    <div>
                      <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Select Payment Account</label>
                      <p className="mb-4 text-sm text-slate-400">Choose the bank account you will transfer to.</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {bankAccountsLoading ? (
                          <div className="col-span-full flex items-center justify-center py-8">
                            <Loader size={24} className="animate-spin text-[#f89f29]" />
                            <span className="ml-3 text-sm text-slate-400">Loading payment accounts...</span>
                          </div>
                        ) : bankAccounts.length ? (
                          bankAccounts.map((account) => {
                            const isSelected = String(account.id) === String(selectedBankId);
                            return (
                              <button
                                type="button"
                                key={account.id}
                                onClick={() => { setSelectedBankId(account.id); setUserAccountNumber(''); }}
                                className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
                                  isSelected
                                    ? 'border-[#f89f29] bg-[#f89f29]/10 shadow-[0_0_20px_rgba(248,159,41,0.15)]'
                                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#f89f29]">
                                    <Check size={12} className="text-white" />
                                  </span>
                                )}
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f89f29]/10 text-[#f89f29]">
                                    <Building2 size={18} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-sm">{account.bank_name}</p>
                                    <p className="text-[11px] text-slate-400">{account.account_holder_name}</p>
                                  </div>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-sm font-bold text-white">
                                  {account.account_number}
                                </div>
                                <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5">
                                  <p className="text-[10px] text-amber-400/80">
                                    Transfer to this account and upload receipt as proof.
                                  </p>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-500">
                            <Building2 size={36} className="mb-2 text-slate-600" />
                            <p className="text-sm">No payment accounts are configured yet.</p>
                            <p className="mt-1 text-xs text-slate-500">Contact the admin or check back later.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setBankAccountsLoading(true);
                                api.get('/bank-accounts/')
                                  .then((res) => setBankAccounts(unwrapResults(res.data)))
                                  .catch((err) => { console.error(err); setBankAccounts([]); })
                                  .finally(() => setBankAccountsLoading(false));
                              }}
                              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-white/20 hover:bg-white/[0.08] transition-all"
                            >
                              <RefreshCw size={14} /> Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedBankId && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-[#f89f29]/20 bg-[#f89f29]/5 p-4"
                      >
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Your Account Number</label>
                        <p className="mb-2 text-xs text-slate-400">
                          Enter your own <span className="font-semibold text-[#f89f29]">{selectedBank?.bank_name}</span> account number for reference.
                        </p>
                        <input
                          value={userAccountNumber}
                          onChange={(e) => setUserAccountNumber(e.target.value)}
                          placeholder="e.g. 1000 123456 789"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 px-4 text-base text-white outline-none transition focus:border-[#f89f29] focus:ring-2 focus:ring-[#f89f29]/20 placeholder:text-gray-500"
                        />
                      </motion.div>
                    )}

                    <label className={`group flex cursor-pointer items-center gap-4 border-2 border-dashed p-5 transition hover:border-[#f89f29] ${proofFile ? 'border-green-400 bg-green-500/5' : 'border-white/10 bg-white/[0.03]'}`}>
                      <Upload size={28} className="text-slate-400 transition-colors group-hover:text-[#f89f29]" />
                      <div className="flex-1">
                        <p className="font-medium text-white">{proofFile ? proofFile.name : 'Upload payment proof'}</p>
                        <p className="text-xs text-slate-500">JPG, PNG or PDF • Max 5MB</p>
                      </div>
                      {proofFile && <CheckCircle size={24} className="text-green-500" />}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setProofFile(e.target.files[0])}
                      />
                    </label>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Name</p>
                        <p className="mt-1 text-sm font-semibold text-white truncate">{form.full_name || '—'}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Course</p>
                        <p className="mt-1 text-sm font-semibold text-white truncate">{selectedCourse?.title || '—'}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Bank</p>
                        <p className="mt-1 text-sm font-semibold text-white truncate">{selectedBank?.bank_name || '—'}</p>
                      </div>
                      <div className="border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Proof</p>
                        <p className="mt-1 text-sm font-semibold text-white">{proofFile ? 'Ready' : 'Missing'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1 || loading}
                  className="border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                {canSubmit ? (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#f89f29] via-[#e08e1f] to-[#f89f29] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(248,159,41,0.28)] transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader size={22} className="animate-spin" />
                        {stepMessage || 'Processing...'}
                      </>
                    ) : (
                      <>
                        Create Account & Enroll
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-[red] via-[yellow] to-[red] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(21,200,251,0.25)] transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Continue
                    <ArrowRight size={20} />
                  </motion.button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[red] transition hover:text-[yellow]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}