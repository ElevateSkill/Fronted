import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Code2, Palette, BrainCircuit, Rocket, LogOut, User, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const logoJpg = '/logo.jpg';

export default function Navbar({ hasAnnouncements }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    { name: 'Announcements', href: '/announcements' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        onMouseLeave={() => setActiveMega(null)}
        className={`fixed w-full z-50 transition-all duration-300 px-4 sm:px-10 ${
          hasAnnouncements ? 'top-10' : 'top-0'
        } ${
          isScrolled || activeMega || mobileMenu
            ? 'bg-transparent backdrop-blur-lg border-b border-[#15c8fb]/10 dark:border-[#f89f29]/10 py-1' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="flex bg-transparent justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="relative z-[71] flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={logoJpg} 
                className="h-10 sm:h-12 w-auto shadow-lg shadow-black/10 dark:shadow-white/5 object-cover" 
                alt='ELEVATE'
              />
            </div>
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
                  <a href={link.href} className="flex items-center gap-1 text-[10px] font-black tracking-widest dark:text-white/80 text-slate-700 hover:text-[#f07000] transition-colors uppercase">
                    {link.name}
                    {link.isMega && <ChevronDown size={12} className={activeMega === link.name ? 'rotate-180' : ''} />}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l dark:border-white/10 border-slate-200 pl-6">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#15c8fb]/10 to-[#f89f29]/10 text-[#2a23b9] font-black text-[10px] tracking-widest hover:from-[#15c8fb]/20 hover:to-[#f89f29]/20 transition-all uppercase"
                  >
                    {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {user.full_name || user.username}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-5 py-2 bg-gradient-to-r from-[#fb6d15] to-[#e17f0e] text-white font-black text-[10px] tracking-widest hover:brightness-110 transition-all uppercase shadow-lg shadow-[#fb6d15]/20"
                  >
                    Login
                  </Link>

                  <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-[#37186c] to-[#251c63] text-white font-black text-[10px] tracking-widest hover:brightness-110 transition-all uppercase shadow-lg shadow-[#460fa5]/20">
                    Portal
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 dark:text-white text-slate-900 bg-slate-100 dark:bg-white/10 relative z-[71]">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MEGA MENU (DESKTOP) */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white dark:bg-black border-b dark:border-white/10 shadow-2xl py-8 px-8 hidden lg:block"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
                {navLinks.find(l => l.name === activeMega)?.subItems?.map((sub, i) => (
                  <div key={i} className="group cursor-pointer p-4 rounded-xl hover:bg-gradient-to-br hover:from-[#15c8fb]/5 hover:to-[#f89f29]/5 transition-all border border-transparent hover:border-[#15c8fb]/10">
                    <h4 className="text-xs font-black dark:text-white text-slate-900 mb-2 uppercase tracking-widest group-hover:text-[#f87b07]">{sub.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-gray-300 leading-relaxed">{sub.desc}</p>
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
              className="fixed inset-0 h-screen w-screen dark:bg-black bg-white z-[70] p-6 pt-24 flex flex-col"
            >
              <div className="flex flex-col gap-6 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b dark:border-white/10 border-gray-200 pb-4">
                    <a 
                      href={link.href} 
                      onClick={() => setMobileMenu(false)}
                      className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter hover:text-[#fb7915] transition-colors"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
                {user ? (
                  <>
                    <Link 
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setMobileMenu(false)}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-[#15c8fb] to-[#0e9ec9] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenu(false); }}
                      className="w-full py-2 bg-red-500/10 text-red-400 text-center font-black rounded-lg uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenu(false)}
                      className="w-full py-2 bg-gradient-to-r from-[#fb6d15] to-[#e17f0e] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenu(false)}
                      className="w-full py-2 bg-gradient-to-r from-[#9e77e3] to-[#1f1656] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg"
                    >
                      Portal
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.nav>
  );
}