import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Code2, Palette, BrainCircuit, Rocket, LogOut, LayoutDashboard, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo-elevate.svg';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  
  // Scroll logic: Hide/Show and Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Glassmorphism trigger
      setIsScrolled(currentScrollY > 20);

      // Hide/Show trigger
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { 
            name: 'Courses', 
            isMega: true,
            subItems: [
                { title: 'Web Development', desc: 'React, Node, and scalable architectures.', icon: <Code2 /> },
                { title: 'UI/UX Design', desc: 'Prototyping and user-centric systems.', icon: <Palette /> },
                { title: 'AI Engineering', desc: 'LLMs and Neural Networks.', icon: <BrainCircuit /> },
                { title: 'Cloud Systems', desc: 'Docker, K8s, and AWS.', icon: <Rocket /> },
            ] 
        },
        { name: 'Services', href: '#services' },
        { name: 'About', href: '/about' },
        { name: 'Partners', href: '/partners' },
        { name: 'Contact', href: '#contact' },
    ];

  return (
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      onMouseLeave={() => setActiveMega(null)}
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-10 ${
        isScrolled || activeMega || mobileMenu
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3' 
          : 'bg-black/20 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="relative z-[71] flex items-center gap-3 group">
          <div className="relative">
            <img
              src={logoSvg}
              className="h-10 sm:h-12 w-auto drop-shadow-lg"
              alt='ELEVATE'
            />
          </div>
          <span className={`hidden sm:block text-lg font-black tracking-tight drop-shadow-lg transition-colors duration-300 ${isScrolled || activeMega || mobileMenu ? 'text-gray-900' : 'text-white'}`}>
            Elevate<span className="text-[#3A3992]">Skill</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative py-2"
                onMouseEnter={() => link.isMega ? setActiveMega(link.name) : setActiveMega(null)}
              >
                <a href={link.href} className={`flex items-center gap-1 text-[10px] font-black tracking-widest uppercase transition-colors ${isScrolled ? 'text-slate-700 hover:text-[#3A3992]' : 'text-white/80 hover:text-white'}`}>
                  {link.name}
                  {link.isMega && <ChevronDown size={12} className={activeMega === link.name ? 'rotate-180' : ''} />}
                </a>
              </div>
            ))}
          </div>

           <div className="flex items-center gap-4 border-l border-white/20 pl-6">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to={user.role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-1.5 px-4 py-2 bg-[#EE8433] text-white font-black text-[10px] tracking-widest rounded-md hover:brightness-110 transition-all uppercase shadow-lg shadow-[#EE8433]/30">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={() => { logout(); navigate('/login'); }} className={`flex items-center gap-1.5 px-3 py-2 font-black text-[10px] tracking-widest rounded-md transition-all uppercase ${isScrolled ? 'bg-[#FEF0EE]/10 text-[#D95C4A] hover:bg-[#FEF0EE]/20' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}>Logout</button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3A3992] to-[#5A2DA8] flex items-center justify-center text-white font-black text-xs shadow-lg">
                    {(user?.full_name || 'U')[0]}
                  </div>
                </div>
              ) : (
                <Link to="/register" className="flex items-center gap-1.5 px-5 py-2 bg-[#EE8433] text-white font-black text-[10px] tracking-widest rounded-md hover:brightness-110 transition-all uppercase shadow-lg shadow-[#EE8433]/30 hover:scale-105 active:scale-95">
                  <GraduationCap size={12} /> Enroll Now
                </Link>
              )}
            </div>
         </div>

        {/* MOBILE CONTROLS */}
        <div className="lg:hidden flex items-center gap-3">
          <button onClick={() => setMobileMenu(!mobileMenu)} className={`p-2 rounded-lg relative z-[71] ${isScrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MEGA MENU (DESKTOP) */}
      <AnimatePresence>
        {activeMega && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl py-10 px-10 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
              {navLinks.find(l => l.name === activeMega)?.subItems?.map((sub, i) => (
                <div key={i} className="group cursor-pointer p-4 rounded-xl hover:bg-slate-50 transition-all">
                  <h4 className="text-xs font-black text-slate-900 mb-2 uppercase tracking-widest group-hover:text-[#3A3992]">{sub.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{sub.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 h-screen w-screen bg-white z-[70] p-8 pt-24 flex flex-col"
          >
            <div className="flex flex-col gap-6 overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-gray-100 pb-4">
                  <a 
                    href={link.href} 
                    onClick={() => setMobileMenu(false)}
                    className="text-3xl font-black text-slate-900 uppercase tracking-tighter"
                  >
                    {link.name}
                  </a>
                </div>
              ))}
              {user ? (
                <div className="mt-4 flex flex-col gap-3">
                  <Link to={user.role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenu(false)} className="w-full py-4 bg-[#EE8433] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <button onClick={() => { setMobileMenu(false); logout(); navigate('/login'); }} className="w-full py-4 bg-[#FEF0EE] text-[#D95C4A] text-center font-black rounded-lg uppercase tracking-widest flex items-center justify-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/register" onClick={() => setMobileMenu(false)} className="mt-4 w-full py-4 bg-[#3A3992] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                  <GraduationCap size={18} /> Enroll Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}