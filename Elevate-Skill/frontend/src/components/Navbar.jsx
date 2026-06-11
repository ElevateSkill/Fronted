import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Code2, Palette, BrainCircuit, Rocket, LogOut, User, Shield, Bell, Megaphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, unwrapResults } from '../services/api';
import logoJpg from '../assets/logo.jpg';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnBanner, setShowAnnBanner] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch live announcements
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/announcements/')
        .then(res => {
          const data = unwrapResults(res.data);
          if (data.length > 0) setAnnouncements(data);
        })
        .catch(() => {});
    }
  }, [user]);

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
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* ANNOUNCEMENT BANNER (compact top) */}
      <AnimatePresence>
        {showAnnBanner && announcements.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#c16b08] via-[#e66808] to-[#f89f29] text-white text-xs"
          >
            <div className="flex items-center justify-center gap-2 px-4 py-1.5">
              <Megaphone size={14} className="shrink-0" />
              <span className="animate-pulse font-bold uppercase tracking-wider">NEW:</span>
              <span className="truncate max-w-[60vw]">{announcements[0]?.title}: {announcements[0]?.content}</span>
              <button onClick={() => setShowAnnBanner(false)} className="ml-2 shrink-0 rounded-full p-0.5 hover:bg-white/20 transition-colors">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        onMouseLeave={() => setActiveMega(null)}
        className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-10 ${
          showAnnBanner && announcements.length > 0 ? 'mt-8' : 'mt-0'
        } ${
          isScrolled || activeMega || mobileMenu
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-[#dc2626]/10 dark:border-[#f89f29]/10 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="relative z-[71] flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={logoJpg} 
                className="h-10 sm:h-12 w-auto rounded-xl shadow-lg shadow-black/10 dark:shadow-white/5 object-cover" 
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
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#15c8fb]/10 to-[#f89f29]/10 text-[#2a23b9] font-black text-[10px] tracking-widest rounded-md hover:from-[#15c8fb]/20 hover:to-[#f89f29]/20 transition-all uppercase"
                  >
                    {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {user.full_name || user.username}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-[#2a0765] to-[#1f1656] text-white font-black text-[10px] tracking-widest rounded-md hover:brightness-110 transition-all uppercase shadow-lg shadow-[#15c8fb]/20">
                    Portal
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-lg dark:text-white text-slate-900 bg-slate-100 dark:bg-white/10 relative z-[71]">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MEGA MENU (DESKTOP) */}
        <AnimatePresence>
          {activeMega && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-white dark:bg-black border-b dark:border-white/10 shadow-2xl py-10 px-10 hidden lg:block"
            >
              <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
                {navLinks.find(l => l.name === activeMega)?.subItems?.map((sub, i) => (
                  <div key={i} className="group cursor-pointer p-4 rounded-xl hover:bg-gradient-to-br hover:from-[#dc2626]/5 hover:to-[#f89f29]/5 transition-all border border-transparent hover:border-[#15c8fb]/10">
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
              className="fixed inset-0 h-screen w-screen dark:bg-black bg-white z-[70] p-8 pt-24 flex flex-col"
            >
              <div className="flex flex-col gap-6 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b dark:border-white/10 border-gray-200 pb-4">
                    <a 
                      href={link.href} 
                      onClick={() => setMobileMenu(false)}
                      className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter hover:text-[#dc2626] transition-colors"
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
                      className="mt-4 w-full py-4 bg-gradient-to-r from-[#dc2626] to-[#f89f29] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenu(false); }}
                      className="w-full py-4 bg-red-500/10 text-red-400 text-center font-black rounded-lg uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      onClick={() => setMobileMenu(false)}
                      className="w-full py-4 bg-gradient-to-r from-[#dc2626] to-[#f89f29] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg"
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
    </>
  );
}