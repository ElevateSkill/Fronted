import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Ticket, 
  ArrowRight, Github, Chrome, 
  ShieldCheck, Terminal, Fingerprint,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen flex transition-colors duration-500 bg-charcoal text-white overflow-hidden font-sans">
      
      {/* --- LEFT VISUAL PANEL (THE BLUEPRINT) --- */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden border-r border-white/5">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
          alt="Tech background" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#15c8fb]/20 to-[#17c966]/20 mix-blend-color" />
        
        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
              <Terminal size={20} className="text-[#15c8fb]" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Elevate_Skill_Alpha</span>
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-6xl font-black uppercase tracking-tighter leading-none">
              Initialize <br /> <span className="text-[#17c966]">Core_User</span>
            </h2>
            <p className="text-lg text-gray-400 font-medium max-w-sm">
              Connect your local node to the ASTU global engineering mesh. Access production-level repositories and peer-to-peer mentoring.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck className="text-[#17c966]" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Security Protocol Active</span>
            </div>
            <div className="flex -space-x-3 overflow-hidden">
               {[1,2,3,4].map(i => (
                 <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-black bg-zinc-800" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
               ))}
               <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#15c8fb] text-[10px] font-bold ring-2 ring-black">+2k</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL (THE INTERFACE) --- */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md">
          
          <header className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Create Account</h1>
            <p className="text-gray-400 font-medium">
              Join the elite engineering circle at Adama.
            </p>
          </header>

          {/* OAUTH INTEGRATION */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-surface border border-white/10 hover:border-[#15c8fb]/50 transition-all group shadow-sm">
              <Chrome size={18} className="text-[#15c8fb]" />
              <span className="text-xs font-black uppercase tracking-widest">Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-surface border border-white/10 hover:border-[#17c966]/50 transition-all group shadow-sm">
              <Github size={18} className="text-white" />
              <span className="text-xs font-black uppercase tracking-widest">GitHub</span>
            </button>
          </div>

          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center"><span className="px-4 bg-charcoal text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Manual_Entry</span></div>
          </div>

          {/* FORM DATA */}
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#15c8fb]" size={16} />
                  <input type="text" placeholder="Hachalu Hundessa" className="w-full pl-12 pr-4 py-4 bg-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#15c8fb]/20 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Email Logic</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#15c8fb]" size={16} />
                  <input type="email" placeholder="dev@astu.edu" className="w-full pl-12 pr-4 py-4 bg-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#15c8fb]/20 transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Phone Protocol</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#17c966]" size={16} />
                  <input type="tel" placeholder="+251 9..." className="w-full pl-12 pr-4 py-4 bg-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#17c966]/20 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1 flex items-center gap-1">Referral Token <Info size={10} /></label>
                <div className="relative group">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#17c966]" size={16} />
                  <input type="text" placeholder="AX-001" className="w-full pl-12 pr-4 py-4 bg-surface border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#17c966]/20 transition-all font-mono" />
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-[#15c8fb] hover:bg-[#17c966] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all shadow-xl shadow-[#15c8fb]/20 transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3">
              Deploy Profile <ArrowRight size={16} />
            </button>
          </form>

          <footer className="mt-12 flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
              Encryption Status: AES-256 Verified
            </p>
            <Link to="/login" className="text-xs font-bold text-[#15c8fb] hover:text-[#17c966] transition-colors">
              ALREADY REGISTERED? RETURN TO LOGIN
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}