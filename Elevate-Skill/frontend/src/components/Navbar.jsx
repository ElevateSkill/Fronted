import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown, Code2, Palette, BrainCircuit, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo-elevate.svg';
import logoJpg from '../assets/logo.jpg';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  
  // Initialize theme: Default to DARK
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('hachalu-theme');
    return saved ? saved === 'dark' : true; 
  });

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('hachalu-theme', newMode ? 'dark' : 'light');
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
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      onMouseLeave={() => setActiveMega(null)}
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-10 ${
        isScrolled || activeMega || mobileMenu
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 py-3' 
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
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#f89f29] rounded-full border-2 border-white dark:border-black" />
          </div>
          <span className="hidden sm:block text-sm font-black tracking-tight text-gray-900 dark:text-white">
            Elevate<span className="text-[#15c8fb]">Skill</span>
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
                <a href={link.href} className="flex items-center gap-1 text-[10px] font-black tracking-widest dark:text-white/70 text-slate-600 hover:text-[#15c8fb] transition-colors uppercase">
                  {link.name}
                  {link.isMega && <ChevronDown size={12} className={activeMega === link.name ? 'rotate-180' : ''} />}
                </a>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l dark:border-white/10 border-slate-200 pl-6">
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#15c8fb] hover:scale-110 transition-transform">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/register" className="px-5 py-2 bg-[#f89f29] text-white font-black text-[10px] tracking-widest rounded-md hover:brightness-110 transition-all uppercase">
              Portal
            </Link>
          </div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="lg:hidden flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg dark:text-[#15c8fb] text-slate-600 bg-slate-100 dark:bg-white/5">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="p-2 rounded-lg dark:text-white text-slate-900 bg-slate-100 dark:bg-white/5 relative z-[71]">
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
                <div key={i} className="group cursor-pointer p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <h4 className="text-xs font-black dark:text-white text-slate-900 mb-2 uppercase tracking-widest group-hover:text-[#15c8fb]">{sub.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{sub.desc}</p>
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
                <div key={link.name} className="border-b dark:border-white/5 pb-4">
                  <a 
                    href={link.href} 
                    onClick={() => setMobileMenu(false)}
                    className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter"
                  >
                    {link.name}
                  </a>
                </div>
              ))}
              <Link 
                to="/register" 
                onClick={() => setMobileMenu(false)}
                className="mt-4 w-full py-4 bg-[#f89f29] text-white text-center font-black rounded-lg uppercase tracking-widest shadow-lg"
              >
                Access Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}