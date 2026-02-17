import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Zap, ChevronDown, Code2, Palette, BrainCircuit, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ isDark, setIsDark }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('hachalu-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Monitor scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { 
      name: 'Courses', 
      href: '#courses', 
      isMega: true,
      subItems: [
        { title: 'Web Development', desc: 'React, Node, and scalable architectures.', icon: <Code2 className="text-[#15c8fb]" /> },
        { title: 'UI/UX Design', desc: 'Prototyping and user-centric systems.', icon: <Palette className="text-[#17c966]" /> },
        { title: 'AI Engineering', desc: 'LLMs and Neural Network integration.', icon: <BrainCircuit className="text-[#15c8fb]" /> },
        { title: 'Cloud Systems', desc: 'Docker, K8s, and AWS deployment.', icon: <Rocket className="text-[#17c966]" /> },
      ] 
    },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '/about' },
    { name: 'Reviews', href: '#stories' },
    { name: 'Contact', href: '#contact' },
  ];

    const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('hachalu-theme', newMode ? 'dark' : 'light');
  };

  return (
    <nav 
      onMouseLeave={() => setActiveMega(null)}
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 sm:px-10 ${
        isScrolled || activeMega
          ? 'dark:bg-charcoal/95 bg-white/95 backdrop-blur-xl border-b dark:border-white/5 border-black/5 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        
        {/* --- LOGO SECTION --- */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#15c8fb] blur-lg opacity-20 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-2xl tracking-tighter dark:text-white text-slate-900 flex items-center">
            <span className="font-light">ELEV</span>
            <span className="font-black italic text-[#17c966]">ATE</span>
          </span>
        </motion.div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex gap-10">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative py-2"
                onMouseEnter={() => link.isMega ? setActiveMega(link.name) : setActiveMega(null)}
              >
                <a href={link.href} className="flex items-center gap-1.5 text-[11px] font-black tracking-[0.25em] dark:text-white/60 text-slate-500 hover:text-[#15c8fb] dark:hover:text-[#15c8fb] transition-all uppercase">
                  {link.name}
                  {link.isMega && <ChevronDown size={14} className={`transition-transform duration-300 ${activeMega === link.name ? 'rotate-180 text-[#17c966]' : ''}`} />}
                </a>
                {/* Active Link Indicator */}
                {activeMega === link.name && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-4 left-0 w-full h-1 bg-[#15c8fb] rounded-full" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 border-l dark:border-white/10 border-slate-200 pl-8">
            <button 
              onClick={toggleTheme } 
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:scale-110 transition-all text-slate-600 dark:text-[#15c8fb]"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* <button className="px-8 py-3 bg-[#15c8fb] text-white font-black text-[10px] tracking-[0.2em] rounded-sm shadow-xl shadow-[#15c8fb]/20 hover:brightness-110 active:scale-95 transition-all uppercase">
              Member Portal
            </button> */}
            <Link to="/register" className="px-6 py-2 bg-[#15c8fb] text-white font-black text-[10px] tracking-[0.2em] rounded-sm shadow-xl shadow-[#15c8fb]/20 hover:brightness-110 active:scale-95 transition-all uppercase">
              Member Portal
            </Link>
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <div className="lg:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-2 rounded-lg dark:text-[#15c8fb] text-slate-600 bg-slate-100 dark:bg-white/5"
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button 
            onClick={() => setMobileMenu(true)} 
            className="p-2 rounded-lg dark:text-white text-slate-900 bg-slate-100 dark:bg-white/5"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* --- MEGA MENU DROPDOWN (DESKTOP) --- */}
      <AnimatePresence>
        {activeMega && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-charcoal border-b dark:border-white/5 border-slate-200 shadow-2xl py-14 px-10 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-10">
              {navLinks.find(l => l.name === activeMega)?.subItems.map((sub, i) => (
                <motion.a 
                  key={i}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="group flex gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <div className="shrink-0 p-4 h-fit rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/5 group-hover:border-[#15c8fb] transition-colors">
                    {sub.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black dark:text-white text-slate-900 mb-1 uppercase tracking-widest group-hover:text-[#15c8fb] transition-colors">
                      {sub.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[400px] dark:bg-charcoal bg-white z-[70] shadow-2xl p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                 <span className="text-xl font-light dark:text-white uppercase tracking-widest">Menu</span>
                 <button onClick={() => setMobileMenu(false)} className="p-2 dark:text-white text-slate-900 border dark:border-white/10 rounded-full">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex flex-col gap-10 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <button 
                      onClick={() => setActiveMega(activeMega === link.name ? null : link.name)}
                      className="w-full flex justify-between items-center text-4xl font-black dark:text-white text-slate-900 uppercase tracking-tighter group"
                    >
                      <span className={activeMega === link.name ? 'text-[#15c8fb]' : ''}>{link.name}</span>
                      {link.isMega && <ChevronDown size={30} className={activeMega === link.name ? 'rotate-180 text-[#17c966]' : 'text-slate-300'} />}
                    </button>
                    
                    <AnimatePresence>
                      {link.isMega && activeMega === link.name && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 flex flex-col gap-8 pl-4 border-l-2 border-[#15c8fb]"
                        >
                          {link.subItems.map((sub, i) => (
                            <a key={i} href="#" className="flex flex-col gap-1">
                              <span className="text-lg font-black dark:text-white/90 text-slate-800 uppercase tracking-tight">{sub.title}</span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">{sub.desc}</span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10 border-t dark:border-white/5 flex flex-col gap-4">
                <button className="w-full py-5 bg-[#17c966] text-white font-black rounded-sm uppercase tracking-widest text-xs">Register Account</button>
                <div className="flex justify-center gap-6 mt-4">
                    <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase cursor-pointer hover:text-[#15c8fb]">Privacy</span>
                    <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase cursor-pointer hover:text-[#15c8fb]">Terms</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}